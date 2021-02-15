import { Client } from "../Client";
import { User } from "../structures/User";
import { StructureManager } from "./StructureManager";

export class UserManager extends StructureManager<User>
{

    constructor(client: Client) {
        super(client, User);
    }

}