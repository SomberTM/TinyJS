import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Channel } from "./Channels";
import { Emoji } from "./Emoji";
import { Message } from "./Message";
import { Structure } from "./Structure";
import { User } from "./User";

export class ReactionEmoji extends Structure {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        if (this.constructor.name == ReactionEmoji.name)
            Json.construct(this, data);

        this.emoji = new Emoji(client, data);
        
        this.user = this.client.users.cache.get(data.user_id)!;
        this.channel = this.client.channels.cache.get(data.channel_id)!;
        this.message = this.client.messages.cache.get(data.message_id)!;
    }

    @Json.Property("user_id")
    public userID!: string;
    public user!: User;

    @Json.Property("message_id")
    public messageID!: string;
    public message!: Message;

    @Json.Property("channel_id")
    public channelID!: string;
    public channel!: Channel;

    public emoji!: Emoji;

}