import { Cache } from "../../utils/Cache";
import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { Guild } from "./Guild";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { User } from "./User";

@Json.Json
export class GuildMember extends Structure {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client);

        this.guild = guild;
        this.user = client.users.cache.getOrCreate(data.user.id, client, data.user);
        
        Json.construct(this, data);
        
        this.roles = new Cache<string, Role>();
        for (let id of data.roles)
            this.roles.add(id, this.guild.roles.cache.get(id)!);

    }

    public guild: Guild;

    public user: User;
    
    public roles: Cache<string, Role>;

    @Json.Defer("user", (user: User) => { return user.username; })
    public username!: string;

    @Json.Defer("user", (user: User) => user.id)
    public id!: string;

    @Json.Property("nick")
    public nickname!: string | undefined;

    @Json.ResolveClass("joined_at", Date)
    public joinedAt!: Date;

    @Json.ResolveFunction("premium_since", (timestamp) => { if (timestamp) return new Date(timestamp); else return undefined; })
    public premiumSince!: Date | undefined;    

    @Json.Default("deaf", false)
    public deaf!: boolean;

    @Json.Default("mute", false)
    public mute!: boolean;

    @Json.Property("pending")
    public pending!: boolean | undefined;

}