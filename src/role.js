import { guildDB } from "./index.js";
import { getGuildDoc, getUserIndex } from "./index.js";
import { client } from "./index.js";


export async function setMemberColor(member, color) {
    const roleID = await getGuildDoc(member.guild.id).then(guildDoc => {
        return guildDoc.users.find(user => user.id === member.user.id).roleID;
    });
    member.guild.roles.fetch(roleID).then(role => { role.setColor(color); });

    return "Your color on this server has been changed to **" + color + "**.";
}

export async function setMemberTitle(member, title) {
    const roleID = await getGuildDoc(member.guild.id).then(guildDoc => {
        return guildDoc.users.find(user => user.id === member.user.id).roleID;
    });
    member.guild.roles.fetch(roleID).then(role => { role.setName(title); });

    return "Your title on this server has been changed to **" + title + "**.";
}

export async function setMemberRole(member, roleID) {
    getUserIndex(member.guild.id, member.user.id).then(userIndex => {
        getGuildDoc(member.guild.id).then(guildDoc => {
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