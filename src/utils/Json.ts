// @ts-nocheck
import { Class } from "./Util";

export namespace Json
{

    export type AcceptableKey = string | number;
    export type Acceptable<R> = { 
        [key: string]: R, 
        [key: number]: R 
    };

    const classes: { [key: string]: {
        constructor: Function,
        references: { [key: string]: string },
        resolvers: { [key: string]: { reference: string, class: Class<any> } },
        fnresolvers: { [key: string]: { reference: string, fn: Function } },
        defaults: { [key: string]: { reference: string, value: any } },
        serializables: string[],
        defered: { [key: string]: { deferedKey: string, fn: Function } },
        superClass?: Function
    } } = {};

    function put(constructor: Function) {
        if (!has(constructor))
            classes[constructor.name] = { constructor, references: {}, resolvers: {}, fnresolvers: {}, defaults: {}, defered: {}, serializables: [] };
    }

    function refer({ constructor }: any, classKey: string, jsonReference: string) {
        if (!has(constructor)) put(constructor);
        classes[constructor.name]["references"][classKey] = jsonReference;
    }

    function assignResolver({ constructor }: any, classKey: string, jsonReference: string, create: Class<any>) {
        if (!has(constructor)) put(constructor);
        classes[constructor.name]["resolvers"][classKey] = { reference: jsonReference, class: create };
    }

    function assignFnResolver({ constructor }: any, propertyKey: string, jsonReference: string, fn: (value: any) => any) {
        if (!has(constructor)) put(constructor);
        classes[constructor.name]["fnresolvers"][propertyKey] = { reference: jsonReference, fn };
    }

    function assignDefault({ constructor }: any, classKey: string, jsonReference: string, value: any) {
        if (!has(constructor)) put(constructor);
        classes[constructor.name]["defaults"][classKey] = { reference: jsonReference, value };
    }

    function assignDefered({ constructor }: any, deferedKey: string, targetKey: string, fn: (value: any) => void) {
        if (!has(constructor)) put(constructor);
        classes[constructor.name]["defered"][targetKey] = { deferedKey, fn };
    }

    function references(constructor: Function) {
        return classes[constructor.name]["references"];
    }

    function resolvers(constructor: Function) {
        return classes[constructor.name]["resolvers"];
    }

    function fnresolvers(constructor: Function) {
        return classes[constructor.name]["fnresolvers"];
    }

    function defaults(constructor: Function) {
        return classes[constructor.name]["defaults"];
    }

    function serializables(constructor: Function) {
        return classes[constructor.name]["serializables"];
    }

    function defered(constructor: Function) {
        return classes[constructor.name]["defered"];
    }

    function has(constructor: Function): boolean {
        return classes[constructor.name] ? true : false;
    }

    /* -- EXPOSED FUNCS -- */
    
    export function construct<Json extends Acceptable<any>>(filling: Acceptable<any>, json: Json, constructorOverride?: Function): void {
        let constructor = filling.constructor;
        if (constructorOverride)
            constructor = constructorOverride;

        if (classes[constructor.name].superClass)
            construct(filling, json, classes[constructor.name].superClass);

        if (!has(constructor) || Object.entries(classes[constructor.name]).every((v) => Object.values(v).length <= 0 )) return;

        for (let [key, value] of Object.entries(references(constructor))) {
            if (key && value)
                filling[key] = json[value];
        }

        for (let [key, value] of Object.entries(resolvers(constructor))) {
            if (key && value)
                filling[key] = new value.class(json[value.reference]);
        }

        for (let [key, value] of Object.entries(fnresolvers(constructor))) {
            if (key && value)
                filling[key] = value.fn(json[value.reference]);
        }

        for (let [key, value] of Object.entries(defaults(constructor))) {
            if (key && value)
                if (json[value.reference] == undefined)
                    filling[key] = value.value;
        }

        for (let [key, value] of Object.entries(defered(constructor))) {
            if (key && value)
                filling[value.deferedKey] = value.fn(filling[key]);
        }

    }

    export function deserialize<T, Json extends Acceptable<any>>(creating: Class<T>, json: Json): T {
        let created: T;
        try {
            created = new creating();
            construct(created, json);
            return created;
        } catch (error) {
            try {
                created = new creating(json);
                return created;
            } catch (error) {
                throw error;
            }
        }
    }

    export function serializable(constructor: Function): boolean {
        return has(constructor);
    }

    export function serialize<R extends Acceptable<any> = Acceptable<any>>(value: Acceptable<any>): R {
        const { constructor } = value;
        if (!constructor || !has(constructor)) throw new Error();

        var jsonified: R = Object.create({});
        const refs = references(constructor);
        const referencedKeys = Object.keys(refs);

        const res = resolvers(constructor);
        const resolvedKeys = Object.values(res).map((value) => value.reference);

        const def = defaults(constructor);
        const defaultKeys = Object.values(def).map((value) => value.reference);

        for (let key of Object.keys(value))
            if (referencedKeys.includes(key))
                jsonified[refs[key]] = value[key];
            else if (resolvedKeys.includes(key))
                jsonified[res[key].reference] = value[key];
            else if (defaultKeys.includes(key))
                jsonified[def[key].reference] = value[key] != undefined ? value[key] : def[key].value;

        for (let v of Object.values(defered(constructor)))
            jsonified[v.deferedKey] = value[v.deferedKey];

        for (let key of serializables(constructor)) 
            if (!jsonified.hasOwnProperty(key))
                jsonified[key] = value[key];

        return <R> jsonified;
    }

    /* -- DECORATORS -- */

    export function Json(target: Function)
    {
        put(target);
    }

    export function Inherits(extended: Class<any>) 
    {
        return function(target: Function) {
            if (!has(target))
                put(target);
            classes[target.name].superClass = extended;
        }
    }
    
    export function Property(jsonReference?: string) {
        return function(target: any, classKey: string) {
            refer(target, classKey, jsonReference || classKey);
        }
    }
    
    export function ResolveClass(jsonReference: string, resolver: Class<any>)
    {
        return function(target: any, classKey: string) {
            assignResolver(target, classKey, jsonReference, resolver);
        }
    }

    export function ResolveFunction<T = any, R = any>(jsonReference: string, resolve: (value: T) => R)
    {
        return function(target: any, propertyKey: string) {
            assignFnResolver(target, propertyKey, jsonReference, resolve);
        }
    }

    export function Default(jsonReference: string, value: any) 
    {
        return function(target: any, classKey: string) {
            assignDefault(target, classKey, jsonReference, value);
        }
    }

    export function Serializable() {
        return function(target: any, propertyKey: string) {
            if (!has(target)) put(target);
            let serialized = serializables(target);
            if (!serialized.includes(propertyKey)) 
                serialized.push(propertyKey);
        }
    }

    export function Defer<T = any, R = any>(targetKey: string, fn: (deferedValue: T) => R) {
        return function(target: any, propertyKey: string) {
            assignDefered(target, propertyKey, targetKey, fn);
        }
    }

    /* -- MISC HELPERS -- */

    export type Mirrored<T extends AcceptableKey> = { [P in T]: P };
    export function mirror<T extends AcceptableKey>(array: T[]): Mirrored<T> {
        const out: Mirrored<T> = Object.create({});
        for (let element of array)
            out[element] = element;
        return out;
    }

    export function mirrorFormated<T extends AcceptableKey>(array: T[], formatFn: (value: T) => AcceptableKey): Acceptable<any> {
        const out: Acceptable<any> = Object.create({});
        for (let element of array)
            out[formatFn(element)] = element;
        return out;
    }

    export function mirrorFormatedFlip<T extends AcceptableKey>(array: T[], formatFn: (value: T) => AcceptableKey): Acceptable<any> {
        const out: Acceptable<any> = Object.create({});
        for (let element of array)
            out[element] = formatFn(element);
        return out;
    }

    export function formatKeys(obj: Acceptable<any>, formatFn: (value: string) => AcceptableKey): Acceptable<any> {
        const out: Acceptable<any> = Object.create({});
        for (let [key, value] of Object.entries(obj))
            out[formatFn(String(key))] = value;
        return out;
    }

    export function enumify<T extends AcceptableKey>(array: T[], start: number = 0) {
        const out: { [P in T]: number } = Object.create({});
        array.forEach((element: T, index: number) => {
            out[element] = start + index;
        });
        return out;
    }

    export function copy<O extends Acceptable<any>>(obj: O) {
        const out: { [P in keyof O]: O[P] } = Object.create({});
        for (let [key, value] of Object.entries(obj))
            // @ts-ignore
            out[key] = value;           
        return out;
    }

    export function merge<B extends Acceptable<any>, M extends Acceptable<any>>(base: B, toMerge: M): { [P in keyof B & keyof M]: B[P] & M[P] } {
        const out: { [P in keyof B & keyof M]: B[P] & M[P] } = base;
        for (let [key, value] of Object.entries(toMerge))
            if (!base[key] || base[key] != value)
                // @ts-ignore
                base[key] = value;
        return out;
    }

    export function differs(base: Acceptable<any>, compare: Acceptable<any>) {
        for (let key of Object.keys(base)) {
            if (!compare.hasOwnProperty(key))
                return true;
            else if (base[key] !== compare[key]) return true;
        }
        return false;
    }

    export function choose<J extends Acceptable<any>, K extends keyof J>(json: J, keys: K[]): { [P in K]: J[P] } {
        let out: { [P in K]: J[P] } = Object.create({});
        for (let [key, value] of Object.entries(json) as [K, J[K]][])
            if (keys.includes(key))
                out[key] = value;
        return out;
    }

    export function swap<J extends Acceptable<string | number | symbol>, K extends keyof J>(json: J): { [P in J[K]]: K }
    {
        let out: { [P in J[K]]: K } = Object.create({})
        for (let [key, value] of Object.entries(json))
            out[value] = key;
        return out;
    }

}