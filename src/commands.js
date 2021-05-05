import * as guilds from "./guilds.js";


export async function color(member, color) {
     member.guild.roles.fetch(guilds.getMemberRoleID(member)).then(role => {
        role.setColor(color);
    });  

    if (color === "000000" || color === "99AAB5") {
        return "Your color on this server has been reset.";
    } else {
        return "Your color on this server has been changed to **" + color + "**.";
    }
}

export async function title(member, title) {
    member.guild.roles.fetch(guilds.getMemberRoleID(member)).then(role => {
        role.setTitle(title);
    });

    if (title === member.displayName) {
        return "Your title on this server has been reset.";
    } else {
        return "Your title on this server has been changed to **" + title + "**.";
    }
}

export async function role(member, roleID) {
    guilds.setMemberRoleID(member, roleID);
    
    return "success";
}