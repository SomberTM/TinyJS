export namespace Snowflake 
{

    /**
     * Converts snowflake id to timestamp
     * @param {snowflake} snowflake 
     */
    export function timestamp(snowflake: string | number): number {
        const bitshift = BigInt(snowflake) >> BigInt(22);
        const epoch = BigInt(1420070400000);
        return Number( bitshift + epoch );
    }

}