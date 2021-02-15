import { DefaultMessageNotificationLevel, ExplicitContentFilterLevel, GuildFeatures, MFALevel, PremiumTier, VerificationLevel } from "../../utils/Constants";
import { Json } from "../../utils/Json";
import { Permissions } from "../../utils/Permissions";
import { SystemChannelFlags } from "../../utils/SystemChannelFlags";
import { Client } from "../Client";
import { EmojiManager } from "../managers/EmojiManager";
import { RoleManager } from "../managers/RoleManager";
import { CategoryChannel, Channel, createGuildChannel, GuildChannel, GuildChannelResolvable, TextChannel, VoiceChannel } from "./Channels";
import { GuildEmoji } from "./Emoji";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { GuildChannelManager } from "../managers/GuildChannelManager";
import { GuildMemberManager } from "../managers/GuildMemberManager";
import { GuildMember } from "./GuildMember";
import { VoiceStateManager } from "../managers/VoiceStateManager";
import { VoiceState } from "./VoiceState";
import { Presence } from "./Presence";
import { CacheEntry } from "../../utils/Cache";
import { Message } from "./Message";

export type GuildResolvable = Guild | string | GuildMember | GuildChannel | GuildEmoji | Role;

export const GuildRegion = Json.mirror([
    "brazil",
    "europe",
    "hongkong",
    "india",
    "japan",
    "russia",
    "singapore",
    "southafrica",
    "sydney",
    "us-central",
    "us-east",
    "us-south",
    "us-west"
]);

@Json.Json
export class Guild extends Structure
{

    constructor(client: Client, data: Json.Acceptable<any>) { 
        super(client); 
        Json.construct(this, data); 

        this.roles = new RoleManager(client);
        for (let role of data.roles)
            this.roles.cache.add(role.id, new Role(client, this, role));

        this.emojis = new EmojiManager(client);
        for (let emoji of data.emojis) 
            this.emojis.cache.add(emoji.id, new GuildEmoji(client, this, emoji));

        this.members = new GuildMemberManager(client, this);
        for (let member of data.members) {
            this.members.cache.add(member.user.id, new GuildMember(client, this, member));
        }

        this.channels = new GuildChannelManager(client, this);
        for (let channel of data.channels)  {
            let created = this.client.channels.cache.add(channel.id, createGuildChannel(client, this, channel));
            this.channels.cache.add( <CacheEntry<string, GuildChannelResolvable>> created );
        }

        for (let channel of this.channels.cache.values()) {
            if (channel.parentID) {
                channel.parent = this.channels.cache.get<CategoryChannel>(channel.parentID)!;
                channel.parent.children.add(channel.id, channel);
            }
        }

        this.voiceStates = new VoiceStateManager(client, this);
        for (let state of data.voice_states) 
            this.voiceStates.cache.add(state.user_id, new VoiceState(client, this, state));

        this.presences = [];
        for (let presence of data.presences)
            this.presences.push(new Presence(client, this, presence));

        if (this.systemChannelID)
            this.systemChannel = this.channels.cache.get(this.systemChannelID);

        if (this.afkChannelID)
            this.afkChannel = this.channels.cache.get(this.afkChannelID);

        if (this.rulesChannelID)
            this.rulesChannel = this.channels.cache.get(this.rulesChannelID);

        if (this.publicUpdatesChannelID)
            this.publicUpdatesChannel = this.channels.cache.get(this.publicUpdatesChannelID);

    }

    @Json.Property("id")
    public id!: string;

    @Json.Property("name")
    public name!: string;

    @Json.Default("icon", null)
    public icon!: string | null;

    @Json.Default("icon_hash", null)
    public iconHash!: string | null;

    @Json.Default("splash", null)
    public splash!: string | null;

    @Json.Default("discovery_splash", null)
    public discoverySplash!: string | null;

    @Json.Default("owner", null)
    public isOwner!: boolean | null;

    @Json.Property("owner_id")
    public ownerID!: string;

    @Json.Default("permissions", null)
    public permissions!: Permissions | null;

    @Json.Property("region")
    public region!: keyof typeof GuildRegion;

    @Json.Property("afk_channel_id")
    public afkChannelID!: string | undefined;
    public afkChannel: VoiceChannel | undefined;

    @Json.Property("afk_timeout")
    public afkTimeout!: number;

    @Json.Default("widget_enabled", false)
    public widgetEnabled!: boolean;

    @Json.Property("verification_level")
    public verificationLevel!: VerificationLevel;

    @Json.Property("default_message_notifications")
    public defaultMessageNotifications!: DefaultMessageNotificationLevel;

    @Json.Property("explicit_content_filter")
    public explicitContentFilter!: ExplicitContentFilterLevel;

    @Json.Property("features")
    public features!: (keyof typeof GuildFeatures)[]

    @Json.Property("mfa_level")
    public mfaLevel!: MFALevel;

    @Json.Property("application_id")
    public applicationID!: string | null;
    
    @Json.Property("system_channel_id")
    public systemChannelID!: string | undefined;
    public systemChannel: TextChannel | undefined;

    @Json.ResolveClass("system_channel_flags", SystemChannelFlags)
    public systemChannelFlags!: SystemChannelFlags;

    @Json.Property("rules_channel_id")
    public rulesChannelID!: string | undefined;
    public rulesChannel: TextChannel | undefined;

    @Json.ResolveClass("joined_at", Date)
    public joinedAt!: Date;

    @Json.Property("large")
    public large!: boolean;

    @Json.Property("unavailable")
    public unavailable!: boolean;

    @Json.Property("member_count")
    public memberCount!: number;

    @Json.ResolveFunction("max_presences", (value) => {
        if (value === null)
            return 25000;
        else value;
    })
    public maxPresences!: number;

    @Json.Property("max_members")
    public maxMembers!: number;

    @Json.Property("vanity_url_code")
    public vanityURLCode?: string;

    @Json.Property()
    public description?: string;

    @Json.Property()
    public banner?: string;

    @Json.Property("premium_tier")
    public premiumTier!: PremiumTier;

    @Json.ResolveFunction("premium_subscription_count", (count) => count ? count : 0)
    public boosts!: number;

    @Json.Property("preferred_locale")
    public preferredLocale!: string;

    @Json.Property("public_updates_channel_id")
    public publicUpdatesChannelID?: string
    public publicUpdatesChannel?: TextChannel;

    @Json.ResolveFunction("premium_subscription_count", (count) => count ? count : 0)
    public maxVideoChannelUsers!: number;

    @Json.Property("approximate_member_count")
    public approximateMemberCount?: number;

    @Json.Property("approximate_presence_count")
    public approximatePresenceCount?: number;

    public roles: RoleManager;

    public emojis: EmojiManager;

    public channels: GuildChannelManager;

    public members: GuildMemberManager;

    public voiceStates: VoiceStateManager;

    public presences: Presence[];

    public lastMessage?: Message;

}