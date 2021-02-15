import { Client } from "../Client";
import { Message } from "../structures/Message";
import { StructureManager } from "./StructureManager";

export class MessageManager extends StructureManager<Message> {

    constructor(client: Client) {
        super(client, Message);
    }

}