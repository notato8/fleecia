import fs from "fs";

let guilds = {};
export function readGuilds() {
    fs.readFile("./src/guilds.json", "utf8", (err, data) => { 
        guilds = JSON.parse(data.toString());
        console.log(guilds);
    });
}
    

function getGuild(guild) {
    if (guilds.hasOwnProperty(guild.id)) {
        return guilds[guild.id];
    } else {
        console.log("Adding guild " + guild.name + " (ID: " + guild.id + ")");
        guilds[guild.id] = { members: {} };
        fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
        return getGuild(guild);
    }
}

function getMember(member) {
    const guild = getGuild(member.guild);
    if (guild.members.hasOwnProperty(member.id)) {
        return guild.members[member.id];
    } else {
        console.log("Adding member " + member.displayName + " (ID: " + member.user.id + ") to guild " + member.guild.name + " (ID: " + member.guild.id + ")");
        guild.members[member.id] = {};
        fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
        return getMember(member);
    }
}


export function getMemberRoleID(member) {
    if (getMember(member).hasOwnProperty("roleID")) {
        return getMember(member).roleID;
    } else {
        getMember(member).roleID = 0;
        fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
        return getMemberRoleID(member);
    }
}

export function setMemberRoleID(member, roleID) {
    getMember(member).roleID = roleID;
    fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
}