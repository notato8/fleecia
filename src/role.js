import { guildDB } from "./index.js";
import { getGuildDoc, getUserIndex } from "./index.js";
import { client } from "./index.js";


export async function setColor(guildID, userID, color) {
    const guild = client.guilds.cache.find(guild => guild.id === guildID);
    const roleID = await getGuildDoc(guildID).then(guildDoc => {
        return guildDoc.users.find(user => user.id === userID).roleID;
    });

    const role = guild.roles.cache.find(role => role.id === roleID);
    role.setColor(color);
}

export async function clearColor(guildID, userID) {
    const guild = client.guilds.cache.find(guild => guild.id === guildID);
    const roleID = await getGuildDoc(guildID).then(guildDoc => {
        return guildDoc.users.find(user => user.id === userID).roleID;
    });

    const role = guild.roles.cache.find(role => role.id === roleID);
    role.setColor("000000");
}

export async function setName(guildID, userID, name) {
    const guild = client.guilds.cache.find(guild => guild.id === guildID);
    const roleID = await getGuildDoc(guildID).then(guildDoc => {
        return guildDoc.users.find(user => user.id === userID).roleID;
    });

    const role = guild.roles.cache.find(role => role.id === roleID);
    role.setName(name);
}

export async function clearName(guildID, userID) {
    const guild = client.guilds.cache.find(guild => guild.id === guildID);
    const roleID = await getGuildDoc(guildID).then(guildDoc => {
        return guildDoc.users.find(user => user.id === userID).roleID;
    });

    const member = await guild.members.fetch(userID).then(member => { return member; });
    console.log(member);
    const role = guild.roles.cache.find(role => role.id === roleID);
    role.setName(member.displayName);
}

export async function link(guildID, userID, roleID) {
    getUserIndex(guildID, userID).then(userIndex => {
        getGuildDoc(guildID).then(guildDoc => {
            guildDoc.users[userIndex].roleID = roleID;
            guildDB.put(guildDoc);
        });
    });
    /* client.api.interactions(interaction.id, interaction.token).callback.post({
        data: { type: 4, data: { content: 
            "Linked role " + 
            client.guilds.cache.find(guild => guild.id === guildID).roles.cache.find(role => role.id === command.options[0].options[0].value).name +
            " to user " +
            interaction.member.user.username
         } }
    }) */
}

export async function unlink(guildID, userID) {

}

export async function query(guildID, userID) {
    getGuildDoc(guildID).then(console.log);
}