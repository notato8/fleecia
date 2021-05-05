import fs from "fs";


let guilds = {};
export function readGuilds() {
    fs.readFile("./src/guilds.json", "utf8", (err, data) => { 
        guilds = JSON.parse(data.toString());
    });
}


function getGuild(guild) {
    if (guilds.hasOwnProperty(guild.id)) {
        return guilds[guild.id];
    } else {
        return createGuild(guild);
    }
}
function createGuild(guild) { console.log("Adding guild \"" + guild.name + "\" (ID: " + guild.id + ")");
    guilds[guild.id] = { members: {} };
    fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
    return guilds[guild.id];
}

function getMember(member) {
    if (getGuild(member.guild).members.hasOwnProperty(member.id)) {
        return getGuild(member.guild).members[member.id];
    } else {
        return addMember(member);
    }
}
function addMember(member) { console.log("Adding member \"" + member.displayName + "\" (ID: " + member.user.id + ") to guild \"" + member.guild.name + "\" (ID: " + member.guild.id + ")");
    getGuild(member.guild).members[member.id] = {};
    fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
    return getGuild(member.guild).members[member.id];
}

function getMemberRoleID(member) {
    if (getMember(member).hasOwnProperty("roleID")) {
        return getMember(member).roleID;
    } else {
        return setMemberRoleID(member, -1);
    }
}
function setMemberRoleID(member, roleID) {
    getMember(member).roleID = roleID;
    fs.writeFileSync("./src/guilds.json", JSON.stringify(guilds));
    return getMember(member).roleID;
}

export function getMemberRole(member) {
    return member.guild.roles.fetch(getMemberRoleID(member)).then(role => {
        if (role !== null) {
            return role;
        } else {
            return createMemberRole(member);
        }
    });  
}
function createMemberRole(member) {
    return member.guild.roles.create({ data: {
        name: member.displayName,
        permissions: [],
        mentionable: true
    }}).then(role => {
        setMemberRoleID(member, role.id);
        member.roles.add(role);
        return role;
    });
}