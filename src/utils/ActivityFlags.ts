import { BitField, BitFieldResolvable } from "./BitField";

export type ActivityFlag = keyof typeof ActivityFlags.FLAGS;
export type ActivityFlagsResolvable = BitFieldResolvable<ActivityFlag>;
export class ActivityFlags extends BitField<ActivityFlag> {

    constructor(bits: ActivityFlagsResolvable) 
    {
        super(ActivityFlags.resolve(bits));
    }

    public static FLAGS = {
        INSTANCE: 1 << 0,
        JOIN: 1 << 1,
        SPECTATE: 1 << 2,
        JOIN_REQUEST: 1 << 3,
        SYNC: 1 << 4,
        PLAY: 1 << 5
    }

    public static ALL = Object.values(ActivityFlags.FLAGS).reduce((accumulator, flag) => accumulator | flag, 0);
    public static resolve(bits: ActivityFlagsResolvable): number { return super.resolve(bits); }

}