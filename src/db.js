import PouchDB from "pouchdb";


export const guildDB = new PouchDB("./db/guilds/");


export function getGuild(guild) {
    return guildDB.get(guild.id)
    .catch(() => { return addGuild(guild).then(() => { return getGuild(guild)}); });
}

function addGuild(guild) { console.log("Adding guild " + guild.name + " (ID: " + guild.id + ")");
    return guildDB.put({
        _id: guild.id,
        members: [],
    });
}

export function getMemberIndex(member) {   
    return getGuild(member.guild).then(dbGuild => {
        if (dbGuild.members.some(dbMember => dbMember.id === member.id)) {
            return dbGuild.members.findIndex(dbMember => dbMember.id === member.id);
        } else {
            return addMember(member).then(() => { return getMemberIndex(member) });
        }
    });
}

function addMember(member) { console.log("Adding member " + member.displayName + " (ID: " + member.user.id + ") to guild " + member.guild.name + " (ID: " + member.guild.id + ")");
    return getGuild(member.guild).then(dbGuild => {
        dbGuild.members.push({ id: member.id });
        return guildDB.put(dbGuild);
    });
}

export function getMemberRoleID(member) {
    // get member or get member index??
}