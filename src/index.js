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
        console.log("adding guild...");
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
            console.log("adding user...");
            guildDoc.users.push({ id: userID });
            return guildDB.put(guildDoc)
            .then(() => { return getUserIndex(guildID, userID) });
        }
    });
}


client.on("ready", () => { console.log("Ready to start working.");
    
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
        const guildID = interaction.guild_id;
        const userID = interaction.member.user.id;

        // UNUSED: Determines user ID based on presence in command. Use author.user.id for now.
        /* const userID = (optionsIndex) => {
            if (command.hasOwnProperty("options")) {
                if (typeof command.options[optionsIndex] != "undefined") {
                    return command.options[optionsIndex].value;
                }
            }
            return author.user.id;
        } */

        switch (command.name) { 
            case "color": 
                if (command.hasOwnProperty("options")) role.setColor(guildID, userID, command.options[0].value);
                else role.clearColor(guildID, userID);
            break;
            case "title":
                if (command.hasOwnProperty("options")) role.setName(guildID, userID, command.options[0].value);
                else role.clearName(guildID, userID);
            break;
            case "role":
                if (command.hasOwnProperty("options")) role.link(guildId, userID, command.options[0].value);
                else role.unlink(guildID, userID);
            break;
        }
    });
    
});