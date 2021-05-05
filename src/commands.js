import * as guilds from "./guilds.js";


export async function color(member, color) {
    guilds.getMemberRole(member).then(role => {
        role.setColor(color);
    });

    if (color === "000000" || color === "99AAB5") {
        return "Your color on this server has been reset.";
    } else {
        return "Your color on this server has been changed to **" + color + "**.";
    }
}

export async function title(member, title) {
    guilds.getMemberRole(member).then(role => {
        role.setName(title);
    });

    if (title === member.displayName) {
        return "Your title on this server has been reset.";
    } else {
        return "Your title on this server has been changed to **" + title + "**.";
    }
}