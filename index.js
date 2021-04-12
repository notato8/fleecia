import keys from "./keys.js"
import Discord from "discord.js"
import PouchDB from "pouchdb"

const serverDB = new PouchDB("servers")
const client = new Discord.Client();
client.login(keys.discordToken);


client.on("ready", () => { console.log("Ready to start working.");
    client.api.applications(client.user.id).guilds(keys.guildID).commands.post({data: {
        name: "role",
        description: "Changes personal role settings.",
        options: [
            {
                name: "color",
                description: "Changes personal role color.",
                type: 2,
                options: [
                    {
                        name: "set",
                        description: "Sets personal role color.",
                        type: 1,
                        options: [
                            {
                                name: "color",
                                description: "New hex color code",
                                type: 3,
                                required: true
                            },
                            {
                                name: "user",
                                description: "Target user",
                                type: 6,
                                required: false
                            }
                        ]
                    },
                    {
                        name: "clear",
                        description: "Clears personal role color.",
                        type: 1,
                        options: [
                            {
                                name: "user",
                                description: "Target user",
                                type: 6,
                                required: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "name",
                description: "Changes personal role name.",
                type: 2,
                options: [
                    {
                        name: "set",
                        description: "Sets personal role name.",
                        type: 1,
                        options: [
                            {
                                name: "name",
                                description: "New name",
                                type: 3,
                                required: true
                            },
                            {
                                name: "user",
                                description: "Target user",
                                type: 6,
                                required: false
                            }
                        ]
                    },
                    {
                        name: "clear",
                        description: "Clears personal role name.",
                        type: 1,
                        options: [
                            {
                                name: "user",
                                description: "Target user",
                                type: 6,
                                requried: false
                            }
                        ]
                    }
                ]
            }
        ]
    }});

    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === "hello") {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello!"
                    }
                }
            })
        }
    });
    
});


client.on("guildCreate", guild => {
    // Check if the server is already in the database
    serverDB.get(guild.id).catch(() => newServer(guild));

    serverDB.get(guild.id).then(server => {
        guild.members.cache.forEach(member => {
            server.users.push({id: member.id});
        })
        serverDB.put(server);
    });
});

client.on("message", message => {
    if (message.guild && (message.content.startsWith("/fleecia ") || message.content.startsWith("!fleecia "))) { // If the message is a command in a guild
        serverDB.get(message.guild.id).then(server => {
            const config = server.config;
            const authorID = message.author.id;
            const roles = message.guild.roles.cache;
            const command = message.content.split(" ");
            const response = [];
            // const waitingForConfirmation = {};

            switch (command[1]) {

                case "setRoleColor":
                    if (validate("role", config, authorID) && config.allowRoleColors === true) {
                        let foundRole = roles.find(role => role.id === server.users.find(user => authorID === user.id).roleID);
                        if (foundRole) {
                            foundRole.setColor(command[2]);
                        } else {
                            newRole(message.guild, message.member, server)
                            .then(role => role.setColor(command[2]));
                        }
                    }
                break;

                case "clearRoleColor":
                    if (validate("role", config, authorID) && config.allowRoleColors === true) {
                        let foundRole = roles.find(role => role.id === server.users.find(user => authorID === user.id).roleID);
                        if (foundRole) {
                            foundRole.setColor("000000");
                        } else {
                            newRole(message.guild, message.member, server)
                            .then(role => role.setColor("000000"));
                        }
                    }
                break;
                
                case "setRoleName":
                    if (validate("role", config, authorID) && config.allowRoleNames === true) {
                        let foundRole = roles.find(role => role.id === server.users.find(user => authorID === user.id).roleID);
                        if (foundRole) {
                            foundRole.setName(command[2]);
                        } else {
                            newRole(message.guild, message.member, server)
                            .then(role => role.setName(command[2]));
                        }
                    }
                break;

            }
        });
    };
});

function newServer(guild) {
    serverDB.put({
        _id: guild.id,
        users: [],
    });
}

function newRole(guild, member, server) {
    return guild.roles.create({ data: {
        name: member.displayName,
        permissions: [],
        mentionable: true
    }})
    .then(role => {
        member.roles.add(role);
        server.users.find(user => user.id === member.id).role = role.id;
    });
}