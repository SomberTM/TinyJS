import Case from "case";
import { Json } from "../../utils/Json";
import { Permissions } from "../../utils/Permissions";
import { Client } from "../Client";
import { Guild } from "./Guild";
import { Structure } from "./Structure";

const { Property, ResolveClass, ResolveFunction, formatKeys, Serializable } = Json;

export type RoleResolvable = Role | string;

@Json.Json
export class Role extends Structure {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) { 
        super(client); 
        Json.construct(this, data); this.guild = guild;  
    }

    public guild: Guild;

    @Property("id")
    public id!: string;

    @Property("name")
    public name!: string;

    @Property("color")
    public color!: number;

    @Property("hoist")
    public hoist!: boolean;

    @Property("position")
    public position!: number;

    @ResolveClass("permissions", Permissions)
    public permissions!: Permissions;

    @Property("managed")
    public managed!: boolean;

    @Property("mentionable")
    public mentionable!: boolean;

    @ResolveFunction("tags", (value: object) => { if (!value) return undefined; else return formatKeys(value, Case.camel); })
    public tags!: { botId?: string, integrationId?: string, premiumSubscriber?: null } | undefined

}