import Discord from "discord.js";

import keys from "./keys.js";
import { readGuilds } from "./guilds.js";

import * as commands from "./commands.js";


const client = new Discord.Client();
client.login(keys.discordToken);

readGuilds();


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


    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data;
        const member = await client.guilds.fetch(interaction.guild_id).then(guild => {
            return guild.members.fetch(interaction.member.user.id).then(member => { return member; })
        });

        const response = (async () => {
            switch (command.name) { 
                case "color": 
                    if (command.hasOwnProperty("options")) {
                        return await commands.color(member, command.options[0].value.toUpperCase());
                    } else {
                        return await commands.color(member, "000000");
                    }
                case "title":
                    if (command.hasOwnProperty("options")) {
                        return await commands.title(member, command.options[0].value);
                    } else {
                        return await commands.title(member, member.displayName);
                    }
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