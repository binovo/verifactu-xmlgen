/**
 * See ocb/addons/web/static/src/js/core/utils.js
 */
export function roundPrecision(value: number, precision: number): number {
    if (!value) {
        return 0;
    } else if (!precision || precision < 0) {
        precision = 1;
    }
    let normalizedValue = value / precision;
    const epsilonMagnitude = Math.log(Math.abs(normalizedValue)) / Math.log(2);
    const epsilon = Math.pow(2, epsilonMagnitude - 52);
    normalizedValue += normalizedValue >= 0 ? epsilon : -epsilon;

    /**
     * Javascript performs strictly the round half up method, which is asymmetric. However, in
     * Python, the method is symmetric. For example:
     * - In JS, Math.round(-0.5) is equal to -0.
     * - In Python, round(-0.5) is equal to -1.
     * We want to keep the Python behavior for consistency.
     */
    const sign = normalizedValue < 0 ? -1.0 : 1.0;
    const roundedValue = sign * Math.round(Math.abs(normalizedValue));
    return roundedValue * precision;
}

/**
 * See ocb/odoo/tools/float_utils.py
 */
export function floatIsZero(value: number, precision: number): boolean {
    return Math.abs(roundPrecision(value, precision)) < precision;
}

/**
 * See ocb/odoo/tools/float_utils.py
 */
export function floatCompare(value1: number, value2: number, precision: number): -1 | 0 | 1 {
    value1 = roundPrecision(value1, precision);
    value2 = roundPrecision(value2, precision);
    const delta = value1 - value2;
    if (floatIsZero(delta, precision)) {
        return 0;
    }
    if (delta < 0.0) {
        return -1;
    } else {
        return 1;
    }
}
