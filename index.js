import keys from "./keys.js"
import Discord from "discord.js"
import PouchDB from "pouchdb"

const servers = new PouchDB("servers")
const client = new Discord.Client();
client.login(keys.discordToken);


const defaultConfig = [ // A list of all config settings and their default values.
    // Role Module
    {name: "enableRoleModule", default: false},
    {name: "roleModuleMode", default: "normal"},
    {name: "roleModuleWhitelist", default: []},
    {name: "roleModuleBlacklist", default: []},
    {name: "allowRoleColors", default: true},
    {name: "allowRoleNames", default: true},
    {name: "setRoleHeight", default: "top"},
    // Info Module
    {name: "enableInfoModule", default: false},
    {name: "infoModuleMode", default: "normal"},
    {name: "infoModuleWhitelist", default: []},
    {name: "infoModuleBlacklist", default: []},
    {name: "infoLabels", default: []},
    {name: "enableGoogleSheets", default: false},
    {name: "googleSheetsID", default: ""}
]

client.on("ready", () => { // When Fleecia starts up
    servers.allDocs({include_docs: true})
    .then(server => {
        for (let i = 0; i < server.rows.length; i++) {
            defaultConfig.forEach(configSetting => { // For each config setting, if it doesn't already exist, create it and set it to the default.
                if (!server.rows[i].doc.config.hasOwnProperty(configSetting.name)) {server.rows[i].doc.config[configSetting.name] = configSetting.default};
            });
            console.log(server.rows[i].doc);
        };
    });
});

client.on("guildCreate", guild => { // When Fleecia joins a server
    servers.get(guild.id) // Check if the server is already in the database
    .catch( () => { // If it isn't, add it.
        servers.put({
            _id: guild.id,
            name: guild.name,
            config: {},
            users: [],
        })
        servers.get(guild.id)
        .then(server => {
            defaultConfig.forEach(configSetting => { // For each config setting, if it doesn't already exist, create it and set it to the default.
                server.config[configSetting.name] = configSetting.default;
            });
        });
    });
});

client.on("message", message => { // When a message is sent
    if (message.guild && (message.content.startsWith("/fleecia ") || message.content.startsWith("!fleecia "))) { // If the message is a command
        servers.get(message.guild.id)
        .then(guild => {
            const command = message.content.split(" ");
            const response = [];
            if (command[1].toLowerCase() === "enableRoleModule") {
                
            };
            if (command[1].toLowerCase() === "help") {
                response.push("To see a full list of commands, including administrator commands, see the GitHub page: <https://github.com/notato8/Fleecia/wiki/Commands>");
                response.push("`help`: Returns a list of all enabled member commands in the server, if you have permission to use them.");
                if (guild.config.enableRolemodule === true) {
                    if (guild.config.roleModuleMode === "normal" || guild.config.roleModuleWhitelist.includes(message.author.id) || (guild.config.roleModuleMode === "blacklist" && !guild.config.roleModuleBlacklist.includes(message.author.id))) {
                        if (guild.config.allowRoleColors === true) {
                            response.push("`setRoleColor <color>`: Changes the color of your personal role.");
                            response.push("`clearRoleColor`: Resets the color of your personal role to default (Discord's default role color)");
                        }
                        if (guild.config.allowRoleNames === true) {
                            response.push("`setRoleName <string>`: Changes the name of your personal role.");
                        }
                    }
                }
                if (guild.config.enableInfoModule === true) {
                    if (guild.config.infoModuleMode === "normal" || guild.config.infoModuleWhitelist.includes(message.author.id) || (guild.config.infoModuleMode === "blacklist" && !guild.config.infoModuleBlacklist.includes(message.author.id))) {
                        response.push("`viewLabels`: Returns a list of all current information labels.");
                        response.push("`setInfo <label> <string>`: Changes your display under an information label.");
                        response.push("`clearInfo <label>`: Resets your display under an information label to empty.");
                        response.push("`viewInfo <label>`: Returns all members' listings under a specific label.");
                        response.push("`viewInfo <member>`: Returns all of a specific member's labels.");
                        if (guild.config.enableGoogleSheets === true) {
                            response.push("`viewInfo`: Returns a link to the Google Sheet.");
                        }
                    }
;               }
            };
            if (command[1].toLowerCase() === "setRoleColor") {
                if (guild.config.enableRoleModule === "true") {
                    if (guild.config.roleModuleMode === "normal" || guild.config.roleModuleWhitelist.includes(message.author.id) || (guild.config.roleModuleMode === "blacklist" && !guild.config.roleModuleBlacklist.includes(message.author.id))) {
                        if (guild.config.allowRoleColors === true) {
                            message.guild.roles.cache.find(role => role.id === guild.users.find(user => message.author.id === user.id).roleID).setColor(command[2]);
                        }
                    }
                }
            };
            if (response.length > 0) {
                if (message.content.startsWith("/")) message.author.send(response);
                if (message.content.startsWith("!")) message.channel.send(response);
            };
        }); 
    };
});