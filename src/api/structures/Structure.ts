import { Json } from "../../utils/Json";
import { Client } from "../Client";

export class Structure 
{

    public client!: Client;

    constructor(client: Client) { 
        Object.defineProperty(this, 'client', { value: client });
    }

}