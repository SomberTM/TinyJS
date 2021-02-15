import { Client } from "../Client";
import { Guild } from "../structures/Guild";
import { GuildMember } from "../structures/GuildMember";
import { StructureManager } from "./StructureManager";

export class GuildMemberManager extends StructureManager<GuildMember> {

    constructor(client: Client, guild: Guild) {
        super(client, GuildMember);
        this.guild = guild;
    }

    public guild: Guild;

}