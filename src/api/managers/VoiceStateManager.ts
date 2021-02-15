import { Client } from "../Client";
import { Guild } from "../structures/Guild";
import { VoiceState } from "../structures/VoiceState";
import { StructureManager } from "./StructureManager";

export class VoiceStateManager extends StructureManager<VoiceState> {

    constructor(client: Client, guild: Guild) {
        super(client, VoiceState);
        this.guild = guild;
    }

    public guild: Guild;

}