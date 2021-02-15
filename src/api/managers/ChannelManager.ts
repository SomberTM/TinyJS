import { Client } from "../Client";
import { Channel, ChannelResolvable } from "../structures/Channels";
import { StructureManager } from "./StructureManager";

export class ChannelManager extends StructureManager<ChannelResolvable> {

    constructor(client: Client) {
        super(client, Channel);
    }

}