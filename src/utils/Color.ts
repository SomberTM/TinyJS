import { Json } from "./Json";

export type RGB = [red: number, green: number, blue: number];
export type ColorResolvable = number | string | RGB | keyof typeof Colors | Color;
export class Color {
    
    private decimal: number;

    constructor(color: ColorResolvable) {
        this.decimal = Color.resolve(color);
    }

    public valueOf(): number { return this.decimal; }

    static resolve(color: ColorResolvable): number {
        if (Array.isArray(color)) return Color.rgbToDecimal(color);
        // @ts-ignore
        else if (typeof color == 'string' && Object.keys(Colors).includes(color)) return Color.resolve(Colors[color]);
        else if (color instanceof Color) return color.valueOf();
        else if (String(color).length == 6 || (String(color).startsWith("#") && String(color).length == 7)) return Color.hexToDecimal(color);
        else return this.decimalValue(color);
    }

    static hexToDecimal(hex: string | number) {
        hex = Color.hexString(hex);
        let decimal: number = 0;

        for (let i = 0, e = 5; i <= 5; i++, e--) 
            decimal += Number(Color.hexTable[hex.charAt(i)]) * Math.pow(16, e);

        return decimal;
    }

    static rgbToDecimal(rgb: RGB) {
        return Color.hexToDecimal(Color.rgbToHex(rgb));
    }

    static decimalToHex(decimal: string | number) {
        decimal = Color.decimalValue(decimal);
        let hex: string = "";
        for (let i = 0; i < 6; i++) {
            decimal /= 16;
            let remainder = decimal - Math.floor(decimal);
            hex = hex.replace(/^/, String(Color.hexTable[remainder * 16]));
            decimal = Math.floor(decimal);
        }
        return hex;
    }

    static decimalToRGB(decimal: string | number): RGB {
        return Color.hexToRGB(Color.decimalToHex(decimal));
    }

    static rgbToHex(rgb: RGB) {
        let hex: string = "";
        
        for (let i = 0; i < rgb.length; i++) {
            let colorDiv: number = rgb[i] / 16;
            hex += Color.hexTable[Math.floor(colorDiv)];
            hex += Color.hexTable[(colorDiv - Math.floor(colorDiv)) * 16];     
        }

        return hex;
    }

    static hexToRGB(hex: string | number) {
        hex = Color.hexString(hex);

        let rgb: RGB = [0, 0, 0];
        let colorIndex: number = 0;
        for (let i = 0; i < 6; i += 2) {
            rgb[colorIndex] += Number(Color.hexTable[hex.charAt(i)]) * 16
            rgb[colorIndex] += Number(Color.hexTable[hex.charAt(i+1)]);
            colorIndex++;
        }

        return rgb;
    }

    static hexString(str: string | number): string {
        if (typeof str == 'string' && str.startsWith("#")) str = str.substring(1, str.length);
        else str = String(str);
        if (str.length > 6) throw new Error(`Invalid hex string length (Length exceeds 6)`);
        return str.toUpperCase();
    }

    static decimalValue(str: string | number): number {
        if (typeof str === 'string')
            if (str.match(/\d/g)?.length != str.length) {
                throw new Error(`Invalid decimal string (Length 10, all numerics)`);
            } else str = Number(str);
        return str;
    }

    static hexTable: { [key: string]: string | number, [key: number]: string | number } = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5, 
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: "A",
        11: "B",
        12: "C",
        13: "D",
        14: "E",
        15: "F",
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
    }

}


/**
 * Some standard colors from the [list of crayola crayon colors](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors#Standard_colors) and more
 */
export const Colors = Json.copy({
    RED: "#ED0A3F",
    MAROON: "#C32148",
    SCARLET: "#FD0E35",
    BRICK_RED: "#C62D42",
    CHESTNUT: "#B94E48",
    ORANGE_RED: "#FF5349",
    BITTERSWEET: "#FE6F5E",
    VIVID_TANGERINE: "#FF9980",
    BURNT_ORANGE: "#FF7034",
    RED_ORANGE: "#FF681F",
    ORANGE: "#FFA500",
    MAC_N_CHEESE: "#FFB97B",
    MANGO: "#E77200",
    YELLOW_ORANGE: "#FFAE42",
    ORANGE_YELLOW: "#F8D568",
    DANDELION: "#FED85D",
    YELLOW: "#FBE870",
    GREEN_YELLOW: "#F1E788",
    OLIVE_GREEN: "#B5B35C",
    CANARY: "#FFFF99",
    INCHWORM: "#AFE313",
    YELLOW_GREEN: "#C5E17A",
    ASPARAGUS: "#7BA05B",
    FERN: "#63B76C",
    FOREST_GREEN: "#5FA777",
    SEA_GREEN: "#93DFB8",
    SHAMROCK: "#33CC99",
    JUNGLE_GREEN: "#29AB87",
    TROPICAL_RAIN_FOREST: "#00755E",
    PINE_GREEN: "#01786F",
    TEAL_BLUE: "#008080",
    TURQOISE_BLUE: "#6CDAE7",
    OUTER_SPACE: "#2D383A",
    SKY_BLUE: "#76D7EA",
    PACIFIC_BLUE: "#009DC4",
    MIDNIGHT_BLUE: "#003366",
    NAVY_BLUE: "#0066CC",
    DENIM: "#1560BD",
    INDIGO: "#4F69C6",
    BLUE_VIOLET: "#6456B7",
    PURPLE_HEART: "#652DC1",
    ROYAL_PURPLE: "#6B3FA0",
    WISTERIA: "#C9A0DC",
    PINK_FLAMINGO: "#FC74FD",
    VIOLET_RED: "#F7468A",
    PURPLE: "#800080",
    BLUE: "#0000ff",
    GREEN: "#00FF00",
    BROWN: "#AF593E",
    PEACH: "#FFCBA4",
    RUBY: "#9C2542",
    BRONZE: "#A57164",
    ALMOND: "#EED9C4",
    COPPER: "#DA8A67",
    BLACK: "#000000",
    WHITE: "#FFFFFF",
    GRAY: "#8B8680",
    BLUE_GRAY: "#C8C8CD",
    DISCORD_BLUE: "#7289DA",
    DISCORD_DARK_GRAY: "#23272A",
    DISCORD_GRAY: "#2C2F33",
    DISCORD_LIGHT_GRAY: "#99AAB5"
});
