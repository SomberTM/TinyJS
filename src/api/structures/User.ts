import { PremiumType } from "../../utils/Constants";
import { Json } from "../../utils/Json";
import { Snowflake } from "../../utils/Snowflake";
import { UserFlags } from "../../utils/UserFlags";
import { Client } from "../Client";
import { Structure } from "./Structure";

@Json.Json
export class User extends Structure {

    constructor(client: Client, data: object) { super(client); Json.construct(this, data); }

    @Json.Property("id")
    public id!: string;

    @Json.Property("username")
    public username!: string;

    @Json.Property("discriminator")
    public discriminator!: string;

    @Json.Property("avatar")
    public avatarHash!: string | null;

    @Json.Default("bot", false)
    public bot!: boolean | undefined;

    @Json.Property("system")
    public system!: boolean;

    @Json.Property("mfa_enabled")
    public mfaEnabled!: boolean;

    @Json.Property("locale")
    public locale!: string | undefined;

    @Json.Property("verified")
    public verified!: boolean;

    @Json.Property("email")
    public email!: string | null;

    @Json.ResolveFunction("flags", (value: number) => { if (value) return new UserFlags(value); else return null; })
    public flags!: UserFlags | null;

    @Json.Default("premium_type", PremiumType.NONE)
    public premiumType!: PremiumType | undefined;

    @Json.Default("public_flags", new UserFlags('NONE'))
    public publicFlags!: UserFlags | undefined;
    
    @Json.Defer("id", (value: string) => { return new Date(Snowflake.timestamp(value)); })
    public createdAt!: Date;
    
}