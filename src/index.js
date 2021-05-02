import keys from "../lib/keys.js";

import * as role from "./role.js";

import Discord from "discord.js";
import PouchDB from "pouchdb";


export const guildDB = new PouchDB("./db/guilds/");
export const client = new Discord.Client();
client.login(keys.discordToken);


export function getGuildDoc(guildID) {
    return guildDB.get(guildID)
    .catch(() => {
        return guildDB.put({
            _id: guildID,
            users: [],
        }).then(() => { return getGuildDoc(guildID) });
    });   
}

export function getUserIndex(guildID, userID) {
    return getGuildDoc(guildID).then(guildDoc => {
        if (guildDoc.users.some(user => user.id === userID)) {
            return guildDoc.users.findIndex(user => user.id === userID);
        } else {
            guildDoc.users.push({ id: userID });
            return guildDB.put(guildDoc)
            .then(() => { return getUserIndex(guildID, userID) });
        }
    });
}


client.on("ready", () => { console.log("Ready!");
    
    client.api.applications(client.user.id).guilds(keys.guildID).commands.post({ data:
        { name: "color", description: "Change color on this server.", options: [
            { name: "new_color", description: "New color", type: 3, required: false }
        ]}
    });
    client.api.applications(client.user.id).guilds(keys.guildID).commands.post({ data:
        { name: "title", description: "Change title on this server.", options: [
            { name: "new_title", description: "New title", type: 3, required: false }
        ]}
    });
    client.api.applications(client.user.id).guilds(keys.guildID).commands.post({ data:
        { name: "role", description: "Change linked role on this server.", options: [
            { name: "new_role", description: "New role", type: 8, required: false }
        ]}
    });

    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data;
        const member = await client.guilds.fetch(interaction.guild_id).then(guild => { 
            return guild.members.fetch(interaction.member.user.id).then(member => { return member; })
        });

        const response = (async () => {
            switch (command.name) { 
                case "color": 
                    if (command.hasOwnProperty("options")) return await role.setMemberColor(member, command.options[0].value);
                    else return await role.setMemberColor(member, "000000");
                case "title":
                    if (command.hasOwnProperty("options")) return await role.setMemberTitle(member, command.options[0].value);
                    else return await role.setMemberTitle(member, member.displayName);
                case "role":
                    if (command.hasOwnProperty("options")) return await role.setMemberRole(member, command.options[0].value);
                    else return await role.setMemberRole(member, "0");
            }
        })();

        client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: 4, data: {
                content: await response,
                flags: 64
            }
        }});
    });
    
});