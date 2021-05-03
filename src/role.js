import * as db from "./db.js";


export async function setMemberColor(member, color) {
    const roleID = await db.getGuild(member.guild).then(dbGuild => {
        return dbGuild.members.find(dbMember => dbMember.id === member.user.id).roleID;
    });
    member.guild.roles.fetch(roleID).then(role => { role.setColor(color); });

    if (color === "000000" || color === "99AAB5") {
        return "Your color on this server has been reset.";
    } else {
        return "Your color on this server has been changed to **" + color + "**.";
    }
}

export async function setMemberTitle(member, title) {
    const roleID = await db.getGuild(member.guild).then(dbGuild => {
        return dbGuild.members.find(dbMember => dbMember.id === member.user.id).roleID;
    });
    member.guild.roles.fetch(roleID).then(role => { role.setName(title); });

    if (title === member.displayName) {
        return "Your title on this server has been reset.";
    } else {
        return "Your title on this server has been changed to **" + title + "**.";
    }
}

export async function setMemberRole(member, roleID) {
    db.getMemberIndex(member).then(dbMemberIndex => {
        db.getGuild(member.guild).then(dbGuild => {
            dbGuild.members[dbMemberIndex].roleID = roleID;
            db.guildDB.put(dbGuild);
            console.log(dbGuild);
        });
    });
    
    return "success";
}