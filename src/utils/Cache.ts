import { Json } from "./Json";

export interface CacheOptions<K extends string, V> {
    ttl?: number,
    size?: number
    iterable?: Iterable<CacheEntry<K, V>>,
}

export type CacheEntry<K extends string, V> = [key: K, value: V];

export class Cache<K extends string, V> 
{

    public static defaultOptions: CacheOptions<any, any> = { ttl: 0 }
    public static isCache(value: any) { return value.constructor.name === Cache.name || value.name === Cache.name; }

    protected options: CacheOptions<K, V>;
    protected data: { [P in K]: V } = Object.create({});

    constructor(options: CacheOptions<K, V> = Cache.defaultOptions)
    {
        if (options.iterable)
        {
            for (let [key, value] of options.iterable)
                this.add(key, value)
            delete options.iterable;
        }

        this.options = Json.merge(Cache.defaultOptions, options);
    }

    public size(): number { return this.values().length; }

    public has(key: K): boolean;
    public has(value: V): boolean;
    public has(data: K | V): boolean
    {
        if (typeof data === 'string')
            return typeof this.data[<K>data] !== 'undefined' ? true : false;
        else
            return Object.values(this.data).includes(data);
    }

    public get<As extends V = V>(key: K): As | undefined
    {
        return <As>this.data[key];
    }

    public getMany(keys: Iterable<K>): V[]
    {
        const out: V[] = [];
        for (let key of keys)
            if (this.has(key))  
                out.push(this.get(key)!);
        return out;
    }

    public add(entry: CacheEntry<K, V>): CacheEntry<K, V>;
    public add(key: K, value: V): CacheEntry<K, V>;
    public add(kentry: K | CacheEntry<K, V>, value?: V): CacheEntry<K, V> {
        if (typeof kentry === 'string' && !this.has(kentry) && value) {
            this.data[kentry] = value;
            return [kentry, value];
        } else if (Array.isArray(kentry)) {
            let [key, value] = kentry;
            if (!this.has(key))
                this.data[key] = value;
            return kentry;
        } else return [<K><unknown>undefined, <V><unknown>undefined];
    }

    public addMany(iterable: Iterable<CacheEntry<K, V>>)
    {
        for (let entry of iterable)
            this.add(entry);
    }

    public set(key: K, value: V): void;
    public set(entry: CacheEntry<K, V>): void;
    public set(kentry: K | CacheEntry<K, V>, value?: V): void {
        if (typeof kentry === 'string' && value)
            this.data[kentry] = value;
        else if (Array.isArray(kentry))
            this.data[kentry[0]] = kentry[1];
    }

    public setMany(iterable: Iterable<CacheEntry<K, V>>)
    {
        for (let entry of iterable)
            this.set(entry);
    }

    public delete(key: K): boolean {
        if (this.has(key)) {
            delete this.data[key];
            return true;
        } else return false;
    }

    public update(key: K, fn: (value: V) => V): void {
        this.data[key] = fn(this.data[key]);
    }

    public first(): V | undefined 
    {
        return this.values()[0];
    }

    public find(fn: (value: V) => boolean): V | undefined
    {
        for (let value of this.values())
            if (fn(value))
                return value;
        return undefined;
    }

    public filter(filter: (value: V) => boolean): V[]
    {
        const out: V[] = [];
        for (let value of this.values())
            if (filter(value))
                out.push(value);
        return out;
    }

    public where(filter: (value: V) => boolean): Cache<K, V> 
    {
        const out: Cache<K, V> = new Cache<K, V>();
        for (let [key, value] of this.entries())
            if (filter(value))
                out.add(key, value);
        return out;
    }

    public map(fn: (value: V, iteration: number, data: { [P in K]: V }) => V): Cache<K, V> 
    {
        let out: Cache<K, V> = new Cache<K, V>();
        let iteration: number = 0;
        for (let [key, value] of this.entries())
        {
            out.set(<K>key, fn(value, iteration, this.data));
            iteration++;
        }
        return out;
    }

    public forEach(fn: (value: V, iteration: number, data: { [P in K]: V }) => void): void
    {
        for (let i = 0, v = this.values(); i < v.length; i++)
            fn(v[i], i, this.data);
    }

    public every(fn: (value: V, iteration: number, data: { [P in K]: V}) => boolean): boolean 
    {
        let ok: boolean = true;
        for (let i = 0, v = this.values(); i < v.length; i++)
            if (!fn(v[i], i, this.data))
            {
                ok = false
                break;
            }
        return ok;
    }

    public some(fn: (value: V, iteration: number, data: { [P in K]: V }) => boolean): boolean
    {
        for (let i = 0, v = this.values(); i < v.length; i++)
            if (fn(v[i], i, this.data))
                return true;
        return false;
    }

    public random(): V {
        return this.values()[Math.floor(Math.random() * this.size())];
    }

    public keys(): Array<K>
    {
        return <Array<K>> Object.keys(this.data);
    }

    public values(): Array<V>
    {
        return Object.values<V>(this.data);
    }

    public entries(): Array<CacheEntry<K, V>>
    {
        return <Array<CacheEntry<K, V>>> Object.entries<V>(this.data);
    }

    public toString(spaces: number = 4): string
    {
        // @ts-ignore
        return `${this.constructor.name}<${this.keys().length > 0 ? typeof this.keys()[0] : 'unknown'}, ${this.first() != undefined ? this.first().constructor.name : 'unknown'}> ${JSON.stringify(this.data, null, spaces)}`;
    }

    public toArray(): V[] { return this.values(); }
    get array(): V[] { return this.values(); }

    *[Symbol.iterator]() {
        yield* Object.entries<V>(this.data);
    }

}
