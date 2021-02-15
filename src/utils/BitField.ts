// @ts-nocheck
export interface RecursableArray<T> extends Array<RecursableArray<T> | T> {};
export type BitFieldResolvable<F extends string> = number | BitField<F> | F | RecursableArray<BitFieldResolvable<F>>;
export class BitField<F extends string> 
{

    public static FLAGS: { [key: string]: number } = {};

    protected bitfield: number;

    constructor(bits: BitFieldResolvable<F>) {
        this.bitfield = this.constructor.resolve(bits);
    }

    public any(bit: BitFieldResolvable<F>): boolean 
    {
        return (this.bitfield & this.constructor.resolve(bit)) !== 0;
    }

    public equals(other: BitFieldResolvable<F>): boolean 
    {
        return this.bitfield === this.constructor.resolve(other);
    }

    public has(bit: BitFieldResolvable<F>): boolean
    {
        if (Array.isArray(bit)) return bit.every((b: BitFieldResolvable<F>) => this.has(b));
        bit = this.constructor.resolve(bit);
        return (this.bitfield & bit) === bit;
    }

    public add(bit: BitFieldResolvable<F>, ...extras: BitFieldResolvable<F>[]): BitField<F> 
    {
        let total = 0;
        total |= this.constructor.resolve(bit);
        for (const e of extras)
            total |= this.constructor.resolve(e);
        this.bitfield |= total;
        return this;
    }

    public remove(bit: BitFieldResolvable<F>, ...extras: BitFieldResolvable<F>[]): BitField<F>
    {
        let total = 0;
        total |= this.constructor.resolve(bit);
        for (const e of extras)
            total |= this.constructor.resolve(bit);
        this.bitfield &= ~total;
        return this;
    }

    public missing(): F[]
    {
        return <F[]>Object.keys(this.constructor.FLAGS).filter((flag: string) => !this.has(<BitFieldResolvable<F>>flag));
    }

    public toArray(): F[]
    {
        return <F[]>Object.keys(this.constructor.FLAGS).filter((flag: string) => this.has(<BitFieldResolvable<F>>flag));
    }

    public toJson(asBoolean: boolean = false) 
    {
        const json = Object.create({});
        for (let [flag, bit] of Object.entries(this.constructor.FLAGS))
            if (asBoolean)
                json[flag] = this.has(bit);
            else if (this.has(bit))
                json[flag] = bit;
        return json;
    }

    public valueOf(): number { return this.bitfield; }

    public static resolve(bit: BitFieldResolvable<any>): number
    {
        if (typeof bit === 'number')
            return bit;
        if (bit instanceof BitField)
            return bit.valueOf();
        if (Array.isArray(bit))
            return bit.map((bit: BitFieldResolvable<any>) => this.resolve(bit)).reduce((accumulator: number, bit: number) => accumulator | bit, 0);
        if (typeof bit === 'string' && Object.keys(this.FLAGS).includes(bit))
            return this.FLAGS[bit]
        else if (typeof bit === 'string')   
            try { return Number(bit) } catch (error) {}
        
        throw new Error(`Invalid bits`);
    }

}