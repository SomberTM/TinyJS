import { Client } from "../Client";
import { Role, RoleResolvable } from "../structures/Role";
import { StructureManager } from "./StructureManager";

export class RoleManager extends StructureManager<Role> 
{

    constructor(client: Client) {
        super(client, Role);
    }

    public resolve(role: RoleResolvable) {
        return super.resolve(role);
    }

}