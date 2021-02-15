import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Channel } from "./Channels";
import { Guild } from "./Guild";
import { GuildMember } from "./GuildMember";
import { MessageEmbed } from "./MessageEmbed";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { User } from "./User";

export class Message extends Structure {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        
        if (data.guild_id) {
            this.guild = client.guilds.cache.get(data.guild_id)!;
            this.guild!.lastMessage = this;
            this.member = this.guild!.members.cache.get(data.author.id);
            data.member["user"] = data.author;
        }

        this.channel = client.channels.cache.get(data.channel_id)!;
        
        this.author = client.users.cache.getOrCreate(data.author.id, client, data.author);

        if (data.mentions?.length >= 0) {
            this.mentions.users = [];
            for (let user of data.mentions)
                this.mentions.users.push(client.users.cache.getOrCreate(user.id, client, user));
        }

        if (data.mention_channels?.length >= 0) {
            this.mentions.channels = [];
            for (let channel of data.mention_channels)
                this.mentions.channels.push(client.channels.cache.get(channel.id)!);
        }

        if (this.guild) {
            if (data.mention_roles?.length >= 0) {
                this.mentions.roles = [];
                for (let id of data.mention_roles)
                    this.mentions.roles.push(this.guild.roles.cache.get(id)!);
            }

            if (data.mentions?.length >= 0) {
                this.mentions.members = [];
                for (let user of this.mentions.users!)
                    if (this.guild.members.cache.has(user.id))
                        this.mentions.members.push(this.guild.members.cache.get(user.id)!);
            }      
        }

        if (data.attachments) {
            this.attachments = []
            for (let attachment of data.attachments)
                this.attachments.push(new MessageAttachment(this, attachment));
        }

        if (data.embeds) {
            this.embeds = [];
            for (let embed of data.embeds)
                this.embeds.push(new MessageEmbed(embed));
        }

        Json.construct(this, data);
    }

    public author!: User;

    @Json.Property()
    public id!: string;

    @Json.Property("channel_id")
    public channelID!: string;
    public channel!: Channel;

    @Json.Property("guild_id")
    public guildID?: string;
    public guild?: Guild;
    public member?: GuildMember;

    @Json.Property()
    public content!: string;

    @Json.ResolveClass("timestamp", Date)
    public timestamp!: Date;

    @Json.ResolveFunction("edited_timestamp", (ts) => ts ? new Date(ts) : undefined)
    public editedTimestamp?: Date;

    @Json.Property()
    public tts!: boolean;

    @Json.Property("mention_everyone")
    public mentionEveryone!: boolean;

    @Json.Property("webhook_id")
    public webhookID?: string;

    @Json.Defer("webhookID", (value: string | undefined) => value === undefined || value === null ? false : true)
    public isWebhook!: boolean;

    public mentions: {
        users?: User[],
        roles?: Role[],
        channels?: Channel[],
        members?: GuildMember[],
    } = {};

    public attachments?: MessageAttachment[];
    
    public embeds?: MessageEmbed[];
}

export class MessageAttachment {

    constructor(message: Message, data: Json.Acceptable<any>) {
        this.message = message;
        Json.construct(this, data);
    }

    public message: Message;

    @Json.Property()
    public id!: string;

    @Json.Property()
    public filename!: string;

    @Json.Property()
    public size!: number;

    @Json.Property()
    public url!: string;

    @Json.Property("proxy_url")
    public proxyUrl!: string;

    @Json.Property()
    public height?: number;

    @Json.Property()
    public width?: number;

}

