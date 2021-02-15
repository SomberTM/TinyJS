import { Client } from "../Client";
import { Guild } from "./Guild";
import { Structure } from "./Structure";
import { Json } from "../../utils/Json";
import { Role } from "./Role";

const { Property } = Json;

@Json.Json
export class Emoji extends Structure {

    constructor(client: Client, data: Json.Acceptable<any>) {
        super(client);
        if (this.constructor.name == Emoji.name)
            Json.construct(this, data);
    }

    @Json.Property()
    public name!: string;

    @Json.Property()
    public id?: string;

}

@Json.Inherits(Emoji)
export class GuildEmoji extends Emoji {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client, data);

        this.guild = guild;
        this.roles = [];
        for (let id of data.roles) {
            let role: Role | undefined = this.guild.roles.cache.get(id);
            if (role) this.roles.push(role);
        }

        Json.construct(this, data);
    } 

    public guild: Guild;

    public roles: Role[];

    @Property("require_colons")
    public requireColons!: boolean;

    @Property("managed")
    public managed!: boolean;

    @Property("animated")
    public animated!: boolean;

    @Property("available")
    public available!: boolean;

    public toString() {
        if (this.name)
            if (this.requireColons) {
                return `:${this.name}:`;
            } else return this.name;

        return "�";
    }

}