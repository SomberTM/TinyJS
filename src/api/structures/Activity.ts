import { ActivityFlags } from "../../utils/ActivityFlags";
import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Structure } from "./Structure";

export enum ActivityType {
    GAME      = 0,
    STREAMING = 1,
    LISTENING = 2,
    CUSTOM    = 4,
    COMPETING = 5
}

export const ActivityTypeString = Json.mirror([
    "GAME",
    "STREAMING",
    "LISTENING",
    "CUSTOM",
    "COMPETING"
]);

export interface ActivityEmoji {
    name: string,
    id?: string,
    animated?: boolean
}

export interface ActivityParty {
    id?: string,
    size?: { currentSize: number, maxSize: number }
}

@Json.Json
export class ActivityAsset {

    constructor(data: Json.Acceptable<any>) { Json.construct(this, data); }

    @Json.Property("large_image")
    public largeImage: string | undefined;

    @Json.Property("large_text")
    public largeText: string | undefined;

    @Json.Property("small_image")
    public smallImage: string | undefined;

    @Json.Property("small_text")
    public smallText: string | undefined;

}

@Json.Json
export class Activity extends Structure {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        Json.construct(this, data);
    }

    @Json.Property()
    public name!: string;

    @Json.Property()
    public type!: ActivityType;

    @Json.Defer("type", (value: ActivityType) => ActivityType[value])
    public typeString!: keyof typeof ActivityTypeString;

    @Json.Property()
    public url?: string;

    @Json.ResolveClass("created_at", Date)
    public createdAt!: Date;

    @Json.ResolveFunction("timestamps", (value?: { start?: number, end?: number }) => {
        if (value && value.start) return new Date(value.start);
        return undefined;
    })
    public start?: Date;

    @Json.ResolveFunction("timestamps", (value?: { start?: number, end?: number }) => {
        if (value && value.end) return new Date(value.end);
        return undefined;
    })
    public end?: Date;

    @Json.Property("application_id")
    public applicationID?: string;

    @Json.Property()
    public details?: string;

    @Json.Property()
    public state?: string;   

    @Json.Property()
    public emoji?: ActivityEmoji;

    @Json.ResolveFunction("party", (value) => {
        return value ? { 
            id: value.id || undefined,
            size: value.size ? {
                currentSize: value.size[0],
                maxSize: value.size[1]
            } : undefined
        } : undefined;
    })
    public party?: ActivityParty;

    @Json.ResolveClass("assets", ActivityAsset)
    public assets: ActivityAsset | undefined;

    @Json.Property()
    public secrets?: { join?: string, spectate?: string, match?: string };

    @Json.Property()
    public instance?: boolean;

    @Json.ResolveFunction("flags", (flags) => {
        if (flags) return new ActivityFlags(flags);
        return undefined;
    })
    public flags?: ActivityFlags;

}