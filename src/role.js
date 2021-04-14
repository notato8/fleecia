import { guildDB } from "./index.js";
import { getGuildDoc, getUserIndex } from "./index.js";


export async function setColor(guildID, userID, color) {

}

export async function clearColor(guildID, userID) {

}

export async function setName(guildID, userID, name) {

}

export async function clearName(guildId, userID) {

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