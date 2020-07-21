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
    .catch( () => {
        servers.put({
            _id: guild.id,
            name: guild.name,
            config: {},
            users: {},
        });
    });
});

// When a message is sent
client.on("message", message => {
    // If the message is a command
    if (message.guild && (message.content.startsWith("/fleecia ") || message.content.startsWith("!fleecia "))) {
        servers.get(message.guild.id)
        .then(guild => {
            const command = message.content.split(" ");
            const response = [];
            if (command[1] === "help") {
                response.push("To see a full list of commands including administrator commands, see the GitHub page: <https://github.com/notato8/Fleecia/wiki/Commands>");
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
            }
            if (message.content.startsWith("/")) message.author.send(response);
            if (message.content.startsWith("!")) message.channel.send(response);
        })  
    }
})