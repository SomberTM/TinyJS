import { Cache } from "../../utils/Cache";
import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Guild } from "./Guild";
import { Message } from "./Message";
import { PermissionOverwrite } from "./PermissionOverwrite";
import { Structure } from "./Structure";
import { User } from "./User";

export enum ChannelType {
    TEXT,
    DM,
    VOICE,
    GROUP_DM,
    CATEGORY,
    ANNOUNCEMENT,
    STORE
}

export const ChannelTypeStrings = Json.mirror([
    "TEXT",
    "DM",
    "VOICE",
    "GROUP_DM",
    "CATEGORY",
    "ANNOUNCEMENT",
    "STORE"
])

export function createChannel(client: Client, data: Json.Acceptable<any> & { type: ChannelType }, guild?: Guild): Channel {
    switch(data.type) {
        case ChannelType.DM:
            return new DMChannel(client, data);
        case ChannelType.GROUP_DM:
            return new GroupDMChannel(client, data);
        case ChannelType.TEXT:
        case ChannelType.ANNOUNCEMENT:
        case ChannelType.VOICE:
        case ChannelType.CATEGORY:
        case ChannelType.STORE:
            if (!guild) throw new Error(`Cannot create guild channel without a guild`);
            return createGuildChannel(client, guild, data);
    }
}

export function createGuildChannel(client: Client, guild: Guild, data: Json.Acceptable<any> & { type: ChannelType }): GuildChannel {
    switch(data.type) {
        case ChannelType.TEXT:
            return new TextChannel(client, guild, data);
        case ChannelType.ANNOUNCEMENT:
            return new AnnouncementChannel(client, guild, data);
        case ChannelType.VOICE:
            return new VoiceChannel(client, guild, data);
        case ChannelType.CATEGORY:
            return new CategoryChannel(client, guild, data);
        case ChannelType.STORE:
            return new StoreChannel(client, guild, data);
        default:
            return new GuildChannel(client, guild, data);
    }
}

@Json.Json
export class Channel extends Structure {

    constructor(client: Client) {
        super(client);
    }

    @Json.Property("id")
    public id!: string;

    @Json.Property("type")
    public type!: ChannelType;

    @Json.Defer("type", (value: ChannelType) => ChannelType[value])
    public typeString!: keyof typeof ChannelTypeStrings;

}

@Json.Inherits(Channel)
export class DMChannel extends Channel {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        Json.construct(this, data)

        if (this.lastMessageID)
            this.lastMessage = client.messages.cache.get(this.lastMessageID);

        this.recipients = [];
        for (let user of data.recipients)
            this.recipients.push(client.users.cache.getOrCreate(user.id, client, user));
    }

    @Json.Property("last_message_id")
    public lastMessageID?: string;
    public lastMessage?: Message;

    public recipients: User[];

}

@Json.Inherits(Channel)
export class GroupDMChannel extends Channel {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        Json.construct(this, data)

        if (this.lastMessageID)
            this.lastMessage = client.messages.cache.get(this.lastMessageID);

        this.recipients = [];
        for (let user of data.recipients)
            this.recipients.push(client.users.cache.getOrCreate(user.id, client, user));

        this.owner = client.users.cache.get(this.ownerID)!;
    }

    @Json.Property("last_message_id")
    public lastMessageID?: string;
    public lastMessage?: Message;

    @Json.Property()
    public icon?: string;

    @Json.Property("owner_id")
    public ownerID!: string;
    public owner!: User;

    public recipients: User[];

}

export type GuildChannelResolvable = GuildChannel | TextChannel | AnnouncementChannel | CategoryChannel | StoreChannel | VoiceChannel;
export type ChannelResolvable = GuildChannelResolvable | Channel | DMChannel | GroupDMChannel;

@Json.Inherits(Channel)
export class GuildChannel extends Channel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client);
        this.guild = guild;
        this.guildID = this.guild.id;
    }

    public guild: Guild;
    public guildID: string;

    @Json.Property("position")
    public position!: number;

    @Json.Property("name")
    public name!: string;

    @Json.ResolveFunction("permission_overwrites", (overwriteArray: Json.Acceptable<any>[]) => { 
        let out: PermissionOverwrite[] = [];
        for (let overwrite of overwriteArray)
            out.push(new PermissionOverwrite(overwrite));
        return out;
     })
    public permissionOverwrites!: PermissionOverwrite[];

    @Json.Property("parent_id")
    public parentID!: string | null;
    public parent: CategoryChannel | undefined;

    @Json.Default("nsfw", false)
    public nsfw!: boolean;

}

@Json.Inherits(GuildChannel)
export class TextChannel extends GuildChannel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, guild, data);
        Json.construct(this, data);
    }

    @Json.Property("rate_limit_per_user")
    public rateLimitPerUser!: number;

    @Json.Property("topic")
    public topic!: string | undefined;

    @Json.Property("last_message_id")
    public lastMessageID!: string | undefined;

}

@Json.Inherits(GuildChannel)
export class AnnouncementChannel extends GuildChannel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, guild, data);
        Json.construct(this, data);
    }

    @Json.Property("topic")
    public topic!: string | undefined;

    @Json.Property("last_message_id")
    public lastMessageID!: string | undefined;

}

@Json.Inherits(GuildChannel)
export class VoiceChannel extends GuildChannel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, guild, data);
        Json.construct(this, data);
    }

    @Json.Property("bitrate")
    public bitrate!: number;

    @Json.Property("user_limit")
    public userLimit!: number;

}

@Json.Inherits(GuildChannel)
export class CategoryChannel extends GuildChannel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, guild, data);
        Json.construct(this, data);
        this.children = new Cache<string, GuildChannel>();
    }

    public children: Cache<string, GuildChannel>;

}

@Json.Inherits(GuildChannel)
export class StoreChannel extends GuildChannel {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, guild, data);
        Json.construct(this, data);
    }

}