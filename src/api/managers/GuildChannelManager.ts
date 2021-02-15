import { Client } from "../Client";
import { GuildChannel, GuildChannelResolvable } from "../structures/Channels";
import { Guild } from "../structures/Guild";
import { StructureManager } from "./StructureManager";

export class GuildChannelManager extends StructureManager<GuildChannelResolvable> {

    constructor(client: Client, guild: Guild) {
        super(client, GuildChannel);
        this.guild = guild;
    }

    public guild: Guild;

}