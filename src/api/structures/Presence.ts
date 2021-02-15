import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Activity } from "./Activity";
import { Guild } from "./Guild";
import { Structure } from "./Structure";
import { User } from "./User";

export const PresenceStatus = Json.mirror([
    "idle",
    "dnd",
    "online",
    "offline"
])

@Json.Json
export class Presence extends Structure {
 
    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client);
        
        this.guild = guild;
        this.guildID = guild.id;

        this.user = client.users.cache.getOrCreate(data.user.id, client, data.user);
        
        Json.construct(this, data);

        this.activities = [];
        for (let activity of data.activities)
            this.activities.push(new Activity(client, activity));

    }

    public guild: Guild;
    public guildID: string;

    public user: User;

    public activities: Activity[];

    @Json.Property()
    public status!: keyof typeof PresenceStatus;

    @Json.Property("client_status")
    public clientStatus!: { desktop?: string, mobile?: string, web?: string }

}