export interface DynamicPromise<T = void> 
{
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
    awaitable: Promise<T>
}

/**
 * Promise that can be resolved outside of the Promise constructor
 */
export function dynamicPromise<T = void>(): DynamicPromise<T> 
{
    let dynamic: DynamicPromise<T> = Object.create({});

    const promise = new Promise<T>((res, rej) => {
        dynamic.resolve = res;
        dynamic.reject = rej;
    });

    dynamic.awaitable = promise;
    return dynamic;
}