import { roundPrecision } from "./float_utils";
import { TbaiError, TbaiErrorCodes } from "./tbai_error";

export type SimpleType = string | Date | number | undefined;

export type FormatAndValidationFunction = (x: SimpleType) => string;

export function toString(v: SimpleType): string {
    if (undefined === v || null === v) {
        return "";
    }
    return v.toString();
}

export function toStringMaxLength(maxLength: number): FormatAndValidationFunction {
    return (v: SimpleType): string => {
        const r = toString(v);
        if (r.length > maxLength) {
            throw new TbaiError(
                `Value ${v} is longer than ${maxLength}.`,
                TbaiErrorCodes.ERR_VALUE_MAX_LENGTH
            );
        }
        return r;
    };
}

export function toStringTruncate(maxLength: number): FormatAndValidationFunction {
    return (v: SimpleType): string => {
        return toString(v).substr(0, maxLength);
    };
}

export function toStringRegexp(re: RegExp): FormatAndValidationFunction {
    return (v: SimpleType): string => {
        const str = toString(v);
        if (!re.test(str)) {
            const reStr = re.toString();
            throw new TbaiError(
                `Value ${v} does not match ${reStr}.`,
                TbaiErrorCodes.ERR_VALUE_NOT_MATCH
            );
        }
        return str;
    };
}

export function toDateString(d: SimpleType): string {
    if (d instanceof Date) {
        const day = ("00" + d.getDate()).slice(-2),
            month = ("00" + (d.getMonth() + 1)).slice(-2),
            year = d.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }
    throw new TbaiError(`Date expected and ${d} found.`, TbaiErrorCodes.ERR_DATE_EXPECTED_ERROR);
}

export function toTimeString(d: SimpleType): string {
    if (d instanceof Date) {
        const hours = ("00" + d.getHours()).slice(-2),
            minutes = ("00" + d.getMinutes()).slice(-2),
            seconds = ("00" + d.getSeconds()).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }
    throw new TbaiError(`Date expected and ${d} found.`, TbaiErrorCodes.ERR_DATE_EXPECTED_ERROR);
}

export function toUTCTimeString(d: SimpleType): string {
    if (d instanceof Date) {
        const hours = ("00" + d.getUTCHours()).slice(-2),
            minutes = ("00" + d.getUTCMinutes()).slice(-2),
            seconds = ("00" + d.getUTCSeconds()).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }
    throw new TbaiError(`Date expected and ${d} found.`, TbaiErrorCodes.ERR_DATE_EXPECTED_ERROR);
}

export function round2(n: number): number {
    return roundPrecision(n, 0.01);
}

export function round3(n: number): number {
    return roundPrecision(n, 0.001);
}

export function round8(n: number): number {
    return roundPrecision(n, 0.00000001);
}

export function round2ToString(n: SimpleType): string {
    if (typeof n === "number") {
        return round2(n).toFixed(2);
    }
    throw Error(`Number expected and ${n} found.`);
}

export function round8ToString(n: SimpleType): string {
    if (typeof n === "number") {
        return round8(n).toFixed(8);
    }
    throw Error(`Number expected and ${n} found.`);
}
