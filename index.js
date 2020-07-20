import keys from "./keys.js"
import Discord from "discord.js"
import PouchDB from "pouchdb"

const dev = true;

const servers = new PouchDB("servers")
const client = new Discord.Client();
client.login(keys.discordToken);


// When Fleecia joins a server
client.on("guildCreate", guild => {
    servers.get(guild.id)
    .then(server => {

    })
    .catch(
        servers.put({
            _id: guild.id,
            name: guild.name,
            config: {},
            users: {},
        })
    );
})

// When a message is sent
client.on("message", message => {
    // If the message is a command
    if (message.content.startsWith("/fleecia ")) {
        let command = message.content.split(" ");
        let response = [];
        if (command[1] === "config") {
            if (command[2] === "role") {
                response.push("The Role Module allows me to automatically create permission-less roles for all members, or members of your choice. These roles can be customized by their associated members. By placing them above all other roles, these members can have complete freedom over the colors of their usernames, and have fun titles too!");
                response.push("This module is currently disabled. To enable it, verify that the config settings are to your preference, then type `/fleecia config role enable`.");
                response.push("Config settings:");
                response.push("`/fleecia config role mode`: Choose whether to use a whitelist, blacklist, or neither. Current setting: Neither");
                response.push("`/fleecia config role whitelist`: View and edit the whitelisted users and roles. Current number: 0");
                response.push("`/fleecia config role blacklist`: View and edit the blacklisted users and roles. Current number: 0");
                response.push("`/fleecia config role allowColors`: Choose whether users should be allowed to change their role colors. Current setting: Enabled");
                response.push("`/fleecia config role allowNames`: Choose whether users should be allowed to change their role names. Current setting: Enabled");
                response.push("`/fleecia config role resetColors`: Change the colors of all personal roles back to colorless.");
                response.push("`/fleecia config role resetNames`: Change the names of all personal roles back to their usernames.");
                response.push("`/fleecia config role default`: View the default config settings for this module, then confirm whether you would like to restore them.");
            } else {
                response.push("There are several modules. Any of them can be enabled or disabled at any time. Which one do you need help with?");
                response.push("`/fleecia config role`: Give members personal customizable roles. Current setting: Disabled");
                response.push("`/fleecia config info`: Allow users to edit their info in a custom database. Current setting: Disabled");
            }            
        } else {
            response.push("Commands:");
            response.push("`/fleecia setRoleColor`: Change the color of your personal role.");
            response.push("`/fleecia setRoleName`: Change the name of your personal role.");
            response.push("`/fleecia config`: View information about customizing modules. Admins only.");
            response.push("`/fleecia reset`: Restore all config settings to default, and delete all information stored by Fleecia. Admins only.")
        }
        message.channel.send(response);
    }
})