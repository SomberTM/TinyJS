import { BitField, BitFieldResolvable } from "../../utils/BitField";

export type IntentFlag = keyof typeof Intents.FLAGS;
export type IntentsResolvable = BitFieldResolvable<IntentFlag>;
export class Intents extends BitField<IntentFlag>
{

    constructor(intents: IntentsResolvable) 
    {
        super(Intents.resolve(intents));
    }
    
    public static FLAGS = {
        GUILDS: 1 << 0,
        GUILD_MEMBERS: 1 << 1,
        GUILD_BANS: 1 << 2,
        GUILD_EMOJIS: 1 << 3,
        GUILD_INTEGRATIONS: 1 << 4,
        GUILD_WEBHOOKS: 1 << 5,
        GUILD_INVITES: 1 << 6,
        GUILD_VOICE_STATES: 1 << 7,
        GUILD_PRESENCES: 1 << 8,
        GUILD_MESSAGES: 1 << 9,
        GUILD_MESSAGE_REACTIONS: 1 << 10,
        GUILD_MESSAGE_TYPING: 1 << 11,
        DIRECT_MESSAGES: 1 << 12,
        DIRECT_MESSAGE_REACTIONS: 1 << 13,
        DIRECT_MESSAGE_TYPING: 1 << 14,
    } as const;

    public static PRIVILEGED: number = Intents.FLAGS.GUILD_MEMBERS | Intents.FLAGS.GUILD_PRESENCES;
    public static ALL = Object.values(Intents.FLAGS).reduce((accumulator, intent) => accumulator | intent, 0);
    public static NON_PRIVILEGED = Intents.ALL & ~Intents.PRIVILEGED;
    public static resolve(bit: IntentsResolvable): number { return super.resolve(bit); }

}