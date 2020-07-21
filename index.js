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
                if (!server.rows[i].doc.config.hasOwnProperty(configSetting.name)) server.rows[i].doc.config[configSetting.name] = configSetting.default;
            });
            const guild = client.guilds.cache.find(guild => guild.id === server.rows[i].doc._id) // For each member in the guild, if it isn't in the list, add it.
            guild.members.cache.forEach(member => {
                if (!server.rows[i].doc.users.some(user => user.id === member.id)) server.rows[i].doc.users.push({id: member.id});
            })
            servers.put(server.rows[i].doc);
        };
    });
});

client.on("guildCreate", guild => { // When Fleecia joins a server
    servers.get(guild.id) // Check if the server is already in the database
    .catch(() => { // If it isn't, add it.
        servers.put({
            _id: guild.id,
            config: {},
            users: [],
        });
        servers.get(guild.id)
        .then(server => {
            defaultConfig.forEach(configSetting => { // For each config setting, if it doesn't already exist, create it and set it to the default.
                server.config[configSetting.name] = configSetting.default;
            });
            guild.members.cache.forEach(member => {
                server.users.push({id: member.id});
            })
            servers.put(server);
        });
    });
    
});

client.on("guildDelete", guild => { // When Fleecia leaves a server
    servers.get(guild.id)
    .then(server => {
        server.oldConfig = server.config;
        defaultConfig.forEach(configSetting => {
            server.config[configSetting.name] = configSetting.default;
        });
        servers.put(server);
    })
});

const waitingForConfirmation = {};
client.on("message", message => { // When a message is sent
    if (message.guild && (message.content.startsWith("/fleecia ") || message.content.startsWith("!fleecia "))) { // If the message is a command in a guild
        servers.get(message.guild.id)
        .then(server => {
            const command = message.content.split(" ");
            const response = [];

            if (command[1] === "confirm") {
                if (waitingForConfirmation.prefix && waitingForConfirmation.prefix === message.content.charAt(0)) {
                    waitingForConfirmation.command(server);
                    delete waitingForConfirmation.prefix;
                    delete waitingForConfirmation.command;
                }
            }
            if (command[1] === "enableRoleModule") {
                if (command[2] === "true") {
                    server.config.enableRoleModule = true;
                }
                if (command[2] === "false") {
                    server.config.enableRoleModule = false;
                }
                servers.put(server);
            };
            if (command[1] === "help") {
                response.push("To see a full list of commands, including administrator commands, see the GitHub page: <https://github.com/notato8/Fleecia/wiki/Commands>");
                response.push("`help`: Returns a list of all enabled member commands in the server, if you have permission to use them.");
                if (server.config.enableRolemodule === true) {
                    if (server.config.roleModuleMode === "normal" || server.config.roleModuleWhitelist.includes(message.author.id) || (server.config.roleModuleMode === "blacklist" && !server.config.roleModuleBlacklist.includes(message.author.id))) {
                        if (server.config.allowRoleColors === true) {
                            response.push("`setRoleColor <color>`: Changes the color of your personal role.");
                            response.push("`clearRoleColor`: Resets the color of your personal role to default (Discord's default role color)");
                        }
                        if (server.config.allowRoleNames === true) {
                            response.push("`setRoleName <string>`: Changes the name of your personal role.");
                        }
                    }
                }
                if (server.config.enableInfoModule === true) {
                    if (server.config.infoModuleMode === "normal" || server.config.infoModuleWhitelist.includes(message.author.id) || (server.config.infoModuleMode === "blacklist" && !server.config.infoModuleBlacklist.includes(message.author.id))) {
                        response.push("`viewLabels`: Returns a list of all current information labels.");
                        response.push("`setInfo <label> <string>`: Changes your display under an information label.");
                        response.push("`clearInfo <label>`: Resets your display under an information label to empty.");
                        response.push("`viewInfo <label>`: Returns all members' listings under a specific label.");
                        response.push("`viewInfo <member>`: Returns all of a specific member's labels.");
                        if (server.config.enableGoogleSheets === true) {
                            response.push("`viewInfo`: Returns a link to the Google Sheet.");
                        }
                    }
;               }
            };
            if (command[1] === "restore") {
                if (server.oldConfig) {
                    confirm(message, "restore previous config settings and information", restore);
                } else {
                    response.push("No previous config settings or information found.");
                }
            }
            if (command[1] === "setRoleColor") {
                if (server.config.enableRoleModule === "true") {
                    if (server.config.roleModuleMode === "normal" || server.config.roleModuleWhitelist.includes(message.author.id) || (server.config.roleModuleMode === "blacklist" && !server.config.roleModuleBlacklist.includes(message.author.id))) {
                        if (server.config.allowRoleColors === true) {
                            message.guild.roles.cache.find(role => role.id === server.users.find(user => message.author.id === user.id).roleID).setColor(command[2]);
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

function confirm(message, response, command) {
    if (message.content.startsWith("/")) {
        waitingForConfirmation.prefix = "/";
        waitingForConfirmation.command = command;
        message.author.send("Are you sure you would like to " + response + "? If so, type `/fleecia confirm` in the server.");
    };
    if (message.content.startsWith("!")) {
        waitingForConfirmation.prefix = "!";
        waitingForConfirmation.command = command;
        message.channel.send("Are you sure you would like to " + response + "? If so, type `!fleecia confirm`.");
    };
}

function restore(server) {
    server.config = server.oldConfig;
    delete server.oldConfig;
    servers.put(server);
}