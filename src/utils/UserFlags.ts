import { BitField, BitFieldResolvable } from "./BitField";

export type UserFlag = keyof typeof UserFlags.FLAGS;
export type UserFlagsResolvable = BitFieldResolvable<UserFlag>
export class UserFlags extends BitField<UserFlag>
{

    constructor(bits: UserFlagsResolvable)
    {
        super(UserFlags.resolve(bits));
    }

    public static FLAGS = {
        NONE: 0,
        DISCORD_EMPLOYEE: 1 << 0,
        PARTNERED_SERVER_OWNER: 1 <<1,
        HYPESQUAD_EVENTS: 1 << 2,
        BUG_HUNTER_LEVEL_1: 1 << 3,
        HOUSE_BRAVERY: 1 << 6,
        HOUSE_BRILLIANCE: 1 << 7,
        HOUSE_BALANCE: 1 << 8,
        EARLY_SUPPORTER: 1 << 9,
        TEAM_USER: 1 << 10,
        SYSTEM: 1 << 12,
        BUG_HUNTER_LEVEL_2: 1 << 14,
        VERIFIED_BOT: 1 << 16,
        EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17
    } as const;

    public static ALL = Object.values(UserFlags.FLAGS).reduce((accumulator, flag) => accumulator | flag, 0);
    public static resolve(bits: UserFlagsResolvable): number { return super.resolve(bits); }

}