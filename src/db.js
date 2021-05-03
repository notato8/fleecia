import PouchDB from "pouchdb";


export const guildDB = new PouchDB("./db/guilds/");


export function getGuild(guild) {
    return guildDB.get(guild.id)
    .catch(() => {
        return guildDB.put({
            _id: guild.id,
            members: [],
        }).then(() => { return getGuild(guild.id) });
    });   
}

export function getMemberIndex(member) {   
    return getGuild(member.guild).then(dbGuild => {
        if (dbGuild.members.some(dbMember => dbMember.id === member.id)) {
            return dbGuild.members.findIndex(dbMember => dbMember.id === member.id);
        } else {
            dbGuild.members.push({ id: member.id });
            return guildDB.put(dbGuild)
            .then(() => { return getMember(member) });
        }
    });
}

export function getMemberRoleID(member) {
    // get member or get member index??
}