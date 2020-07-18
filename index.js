import keys from "./keys.js"
import Discord from "discord.js"

const client = new Discord.Client();
client.login(keys.discordToken);