import { Client } from "../Client";
import { GuildChannel } from "../structures/Channels";
import { GuildEmoji } from "../structures/Emoji";
import { Guild, GuildResolvable } from "../structures/Guild";
import { GuildMember } from "../structures/GuildMember";
import { Role } from "../structures/Role";
import { StructureManager } from "./StructureManager";

export class GuildManager extends StructureManager<Guild>
{
    
    constructor(client: Client) {
        super(client, Guild);
    }

    public resolve(guild: GuildResolvable): Guild | undefined {
        if (guild instanceof GuildChannel || 
            guild instanceof GuildMember  || 
            guild instanceof GuildEmoji ||
            guild instanceof Role
        ) return super.resolve(guild.guild);
        else return super.resolve(guild);
    }

}