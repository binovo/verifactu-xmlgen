import { querySelector } from "./xmldom";
import {
    FormatAndValidationFunction,
    SimpleType,
    toStringMaxLength,
    toStringRegexp,
    toStringTruncate,
} from "./to_string";

export const toStr2 = toStringMaxLength(2);
export const toStr7 = toStringMaxLength(7);
export const toStr10 = toStringMaxLength(10);
export const toStr15 = toStringMaxLength(15);
export const toStr20 = toStringMaxLength(20);
export const toStr30 = toStringMaxLength(30);
export const toStr50 = toStringMaxLength(50);
export const toStr60 = toStringMaxLength(60);
export const toStr64 = toStringMaxLength(64);
export const toStr100 = toStringMaxLength(100);
export const toStr120 = toStringMaxLength(120);
export const toStr250 = toStringMaxLength(250);
export const toStr500 = toStringMaxLength(500);

export const toStrTruncate100 = toStringTruncate(100);

export const toNifStr = toStringRegexp(
    /^(([a-z|A-Z]{1}\d{7}[a-z|A-Z]{1})|(\d{8}[a-z|A-Z]{1})|([a-z|A-Z]{1}\d{8}))$/
);

export const toEsPostal = toStringRegexp(/^\d{5}$/);

export function updateDocument(
    doc: Document,
    selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]>
): void {
    for (const [selector, value, convert] of selectorsToValues) {
        const node = querySelector(doc, selector);
        if (node) {
            if (undefined === value && node.parentNode) {
                node.parentNode.removeChild(node);
            } else {
                node.textContent = convert(value);
            }
        }
    }
}

export function removeElement(e: Node): boolean {
    if (e.parentNode) {
        e.parentNode.removeChild(e);
        return true;
    }
    return false;
}
