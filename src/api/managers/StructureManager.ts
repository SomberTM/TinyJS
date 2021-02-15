import { Class } from "../../utils/Util";
import { Client } from "../Client";
import { Structure } from "../structures/Structure";
import { StructureCache } from "../../utils/StructureCache";

export abstract class StructureManager<Stores extends Structure = any, Key extends string = string> 
{

    public cacheType: Class<StructureCache<Key, Stores>> = StructureCache;
    public cache: StructureCache<Key, Stores>;
    public client: Client;
    public stores: Class<Stores>;
    
    constructor(client: Client, stores: Class<Stores>)
    {
        this.client = client;
        this.stores = stores;
        this.cache = new this.cacheType(this.stores);
    }

    public resolve(structure: any): Stores | undefined {
        if (structure instanceof this.stores) return structure;
        else if (typeof structure === 'string') return this.cache.get(<Key>structure);
        else return undefined;
    }

}