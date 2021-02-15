import { BitField, BitFieldResolvable } from "./BitField";

export type SystemChannelFlag = keyof typeof SystemChannelFlags.FLAGS;
export type SystemChannelResolvable = BitFieldResolvable<SystemChannelFlag>;
export class SystemChannelFlags extends BitField<SystemChannelFlag> {

    constructor(bits: SystemChannelResolvable) 
    {
        super(SystemChannelFlags.resolve(bits));
    }

    public static FLAGS = {
        SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0,
        SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1
    }

    public static ALL = Object.values(SystemChannelFlags.FLAGS).reduce((accumulator, flag) => accumulator | flag, 0);
    public static resolve(bits: SystemChannelResolvable): number { return super.resolve(bits); }

}