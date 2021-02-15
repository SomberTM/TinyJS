import { Cache, CacheOptions } from "./Cache";
import { Class } from "./Util";
import { Structure } from "../api/structures/Structure";
import { Json } from "./Json";

export class StructureCache<K extends string, V extends Structure> extends Cache<K, V> 
{

    private stores: Class<V>;

    constructor(stores: Class<V>, options?: CacheOptions<K, V>) 
    {
        super(options);
        this.stores = stores;
    }

    public getOrCreate(key: K, ...createArgs: ConstructorParameters<Class<V>>): V 
    {
        let out: V | undefined = this.get(key);
        if (out) return out;

        out = new this.stores(...createArgs);
        this.add(key, out);
        return out;
    }

    public toString(spaces: number = 4): string
    {
        let json: Json.Acceptable<any> = Json.copy(this.data);
        for (let [key, value] of Object.entries(json))
            json[key] = Json.serialize(value);
        return `${this.constructor.name}<${this.keys().length > 0 ? typeof this.keys()[0] : 'unknown'}, ${this.first() != undefined ? this.first()!.constructor.name : 'unknown'}> ${JSON.stringify(json, null, spaces)}`;
    }

    [key: string]: any

}