import { Json } from "../../utils/Json";
import { Permissions } from "../../utils/Permissions";

export enum PermissionOverwriteType {
    ROLE,
    MEMBER
}

@Json.Json
export class PermissionOverwrite {

    constructor(data: Json.Acceptable<any>) { Json.construct(this, data); }

    @Json.Property("id")
    public id!: string;

    @Json.Property("type")
    public type!: PermissionOverwriteType;

    @Json.ResolveClass("allow", Permissions)
    public allow!: Permissions;

    @Json.ResolveClass("deny", Permissions)
    public deny!: Permissions;
    
}