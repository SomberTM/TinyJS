import { Intents } from "../api/gateway/Intents";
import { Json } from "./Json";

// Default options for gateway identification
export const gateway = {
    version: 8,
    encoding: 'json',
    identity: {
        large_threshold: 250,
        compress: false,
        intents: Intents.NON_PRIVILEGED,
        shard: [0, 1],
        properties: {
            $os: process.platform || 'browser',
            $browser: 'tiny.js',
            $device: 'tiny.js'
        }
    },
    op: Json.enumify([
        "DISPATCH",
        "HEARTBEAT",
        "IDENTIFY",
        "STATUS_UPDATE",
        "VOICE_STATUS_UPDATE",
        "VOICE_GUILD_PING",
        "RESUME",
        "RECONNECT",
        "REQUEST_GUILD_MEMBERS",
        "INVALID_SESSION",
        "HELLO",
        "HEARTBEAT_ACK"
    ]),
    dispatch: Json.mirror([
        'READY',
        'RESUMED',
        'GUILD_CREATE',
        'GUILD_DELETE',
        'GUILD_UPDATE',
        'INVITE_CREATE',
        'INVITE_DELETE',
        'GUILD_MEMBER_ADD',
        'GUILD_MEMBER_REMOVE',
        'GUILD_MEMBER_UPDATE',
        'GUILD_MEMBERS_CHUNK',
        'GUILD_INTEGRATIONS_UPDATE',
        'GUILD_ROLE_CREATE',
        'GUILD_ROLE_DELETE',
        'GUILD_ROLE_UPDATE',
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'GUILD_EMOJIS_UPDATE',
        'CHANNEL_CREATE',
        'CHANNEL_DELETE',
        'CHANNEL_UPDATE',
        'CHANNEL_PINS_UPDATE',
        'MESSAGE_CREATE',
        'MESSAGE_DELETE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'MESSAGE_REACTION_REMOVE_EMOJI',
        'USER_UPDATE',
        'PRESENCE_UPDATE',
        'TYPING_START',
        'VOICE_STATE_UPDATE',
        'VOICE_SERVER_UPDATE',
        'WEBHOOKS_UPDATE'
    ]),
    closeCode: Json.enumify([
        "UNKNOWN_ERROR",
        "UNKNOWN_OPCODE",
        "DECODE_ERROR",
        "NOT_AUTHENTICATED",
        "AUTHENTICATION_FAILED",
        "ALREADY_AUTHENTICATED", // 4005
        "NULL",                  // Filler (4006)
        "INVALID_SEQ",           // 4007
        "RATE_LIMITED",
        "SESSION_TIMED_OUT",
        "INVALID_SHARD",
        "SHARDING_REQUIRED",
        "INVALID_API_VERSION",
        "INVALID_INTENTS",
        "DISALLOWED_INTENTS"
    ], 4000)
}

export const http = {
    version: 8
}

export enum PremiumType 
{
    NONE,
    NITRO_CLASSIC,
    NITRO
}

export enum PremiumTier 
{
    NONE,
    TIER_1,
    TIER_2,
    TIER_3
}

export enum VerificationLevel {
    NONE,
    LOW,
    MEDIUM,
    HIGH,
    VERY_HIGH
}

export enum DefaultMessageNotificationLevel {
    ALL_MESSAGES,
    ONLY_MENTIONS
}

export enum ExplicitContentFilterLevel {
    DISABLED,
    MEMBERS_WITHOUT_ROLES,
    ALL_MEMBERS
}

export enum MFALevel {
    NONE,
    ELEVATED
}

export enum ChannelType {
    TEXT,
    DM,
    VOICE,
    GROUP_DM,
    CATEGORY,
    NEWS,
    STORE
}

export const GuildFeatures = Json.mirror([
    "INVITE_SPLASH",
    "VIP_REGIONS",
    "VANITY_URL",
    "VERIFIED",
    "PARTNERED",
    "COMMUNITY",
    "COMMERCE",
    "NEWS",
    "DISCOVERABLE",
    "FEATURABLE",
    "ANIMATED_ICON",
    "BANNER",
    "WELCOME_SCREEN_ENABLED"
]);



