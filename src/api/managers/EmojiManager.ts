import { Client } from "../Client";
import { Emoji, GuildEmoji } from "../structures/Emoji";
import { StructureManager } from "./StructureManager";

export class EmojiManager extends StructureManager<Emoji> {

    constructor(client: Client) {
        super(client, Emoji);
    }

}