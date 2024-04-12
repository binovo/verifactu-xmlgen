/*
 * Generated type guards for "invoice_id.ts".
 * WARNING: Do not manually change this file.
 */
import { InvoiceIdJson, PreviousInvoiceIdJson, InvoiceId, GeneralizedInvoiceId, PreviousInvoiceId } from "./invoice_id";

function evaluate(
    isCorrect: boolean,
    varName: string,
    expected: string,
    actual: any
): boolean {
    if (!isCorrect) {
        console.error(
            `${varName} type mismatch, expected: ${expected}, found:`,
            actual
        )
    }
    return isCorrect
}

export function isInvoiceIdJson(obj: unknown, argumentName: string = "invoiceIdJson"): obj is InvoiceIdJson {
    const typedObj = obj as InvoiceIdJson
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typeof typedObj["serie"] === "undefined" ||
            typeof typedObj["serie"] === "string"), `${argumentName}["serie"]`, "string | undefined", typedObj["serie"]) &&
        evaluate(typeof typedObj["number"] === "string", `${argumentName}["number"]`, "string", typedObj["number"]) &&
        evaluate((typeof typedObj["issuedTime"] === "string" ||
            typedObj["issuedTime"] instanceof Date), `${argumentName}["issuedTime"]`, "string | Date", typedObj["issuedTime"])
    )
}

export function isPreviousInvoiceIdJson(obj: unknown, argumentName: string = "previousInvoiceIdJson"): obj is PreviousInvoiceIdJson {
    const typedObj = obj as PreviousInvoiceIdJson
    return (
        isInvoiceIdJson(typedObj) as boolean &&
        evaluate(typeof typedObj["hash"] === "string", `${argumentName}["hash"]`, "string", typedObj["hash"])
    )
}

export function isInvoiceId(obj: unknown, argumentName: string = "invoiceId"): obj is InvoiceId {
    const typedObj = obj as InvoiceId
    return (
        isInvoiceIdJson(typedObj) as boolean &&
        evaluate(typedObj["issuedTime"] instanceof Date, `${argumentName}["issuedTime"]`, "Date", typedObj["issuedTime"])
    )
}

export function isGeneralizedInvoiceId(obj: unknown, argumentName: string = "generalizedInvoiceId"): obj is GeneralizedInvoiceId {
    const typedObj = obj as GeneralizedInvoiceId
    return (
        (typeof typedObj === "string" ||
            typeof typedObj === "number" ||
            isInvoiceId(typedObj) as boolean)
    )
}

export function isPreviousInvoiceId(obj: unknown, argumentName: string = "previousInvoiceId"): obj is PreviousInvoiceId {
    const typedObj = obj as PreviousInvoiceId
    return (
        isPreviousInvoiceIdJson(typedObj) as boolean &&
        evaluate(typedObj["issuedTime"] instanceof Date, `${argumentName}["issuedTime"]`, "Date", typedObj["issuedTime"])
    )
}
