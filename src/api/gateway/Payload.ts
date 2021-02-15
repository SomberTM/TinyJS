import { Json } from "../../utils/Json";

@Json.Json
export class Payload<T = Json.Acceptable<any>> {

    constructor(json: object) { Json.construct(this, json); }

    @Json.Property("op")
    public opcode!: number;

    @Json.Property("d")
    public data!: T;

    @Json.Property("s")
    public sequence!: number | null;

    @Json.Property("t")
    public eventName!: string | null;

}

@Json.Json
export class Ready {
    
    constructor(json: object) { Json.construct(this, json); }

    @Json.Property("v")
    public version!: number;

    @Json.Property("user")
    public user!: Json.Acceptable<any>;

    @Json.Property("private_channels")
    public privateChannels!: never[];

    @Json.Property("guilds")
    public guilds!: object[];

    @Json.Property("session_id")
    public sessionID!: string;

    @Json.Property("shard")
    public shard!: null | [shard_id: number, num_shards: number];

    @Json.Property("application")
    public application!: object; 

}