import {
    InvoiceId,
    PreviousInvoiceId,
    Invoice,
    ChainedInvoice,
    CancelInvoice,
    ChainedCancelInvoice,
} from "./verifactu_doc";
export { isSoftwareIdInfo } from "./verifactu_doc.guard";
import * as verifactuDocGuard from "./verifactu_doc_types.guard";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
function isInvoiceId(obj: any): obj is InvoiceId {
    if (!verifactuDocGuard.isInvoiceIdJson(obj)) {
        return false;
    }
    const d = new Date(obj.issuedTime);
    if (isNaN(d.getDate())) {
        console.error("issuedTime is not a valid date: ", obj.issuedTime);
        return false;
    }
    obj.issuedTime = d;
    return verifactuDocGuard.isInvoiceId(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isInvoice(obj: any): obj is Invoice {
    if (obj.id) {
        if (!isInvoiceId(obj.id)) {
            return false;
        }
    }
    if (obj.description) {
        if (!verifactuDocGuard.isInvoiceDescriptionJson(obj.description)) {
            return false;
        }
        const d = new Date(obj.description.operationDate);
        if (isNaN(d.getDate())) {
            console.error("operationDate is not a valid date: ", obj.description.operationDate);
            return false;
        }
        obj.description.operationDate = d;
    }

    if (obj.replacedTicketIds) {
        if (obj.type != "F3") {
            console.error("Invoice can not have replacesTicket if type is not F3");
            return false;
        }
        if (obj.creditNote) {
            console.error("Invoice can not have both creditNote and replacesTicket");
            return false;
        }
        if (!obj.replacedTicketIds.every(isInvoiceId)) {
            return false;
        }
    }

    const credit = obj.creditNote;
    if (credit) {
        if (!credit.ids.every(isInvoiceId)) {
            return false;
        }
        if (credit.style == "S") {
            if (credit.creditBase === undefined) {
                console.error("creditBase expected");
                return false;
            }
            if (credit.creditVat === undefined) {
                console.error("creditVat expected");
                return false;
            }
        }
    }
    return verifactuDocGuard.isInvoice(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isPreviousInvoiceId(obj: any): obj is PreviousInvoiceId {
    if (!verifactuDocGuard.isPreviousInvoiceIdJson(obj)) {
        return false;
    }
    const d = new Date(obj.issuedTime);
    if (isNaN(d.getDate())) {
        console.error("issuedTime is not a valid date: ", obj.issuedTime);
        return false;
    }
    obj.issuedTime = d;
    return true;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isChainedInvoice(obj: any): obj is ChainedInvoice {
    const varName = "chainedInvoice";
    if (obj === null) {
        console.error("ChainedInvoice cannot be null");
        return false;
    }
    if (typeof obj !== "object") {
        console.error("ChainedInvoice: object expected");
        return false;
    }
    if (!obj.invoice) {
        console.error(`${varName} type mismatch, expected: Invoice, found:`, obj.invoice);
        return false;
    }
    if (!obj.previousId) {
        console.error(
            `${varName} type mismatch, expected: PreviousInvoiceId, found:`,
            obj.previousId
        );
        return false;
    }
    return isInvoice(obj.invoice) && isPreviousInvoiceId(obj.previousId);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isCancelInvoice(obj: any): obj is CancelInvoice {
    if (!obj.id) {
        return false;
    }
    if (!obj.issuer) {
        return false;
    }
    return isInvoiceId(obj.id) && verifactuDocGuard.isIssuer(obj.issuer);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isChainedCancelInvoice(obj: any): obj is ChainedCancelInvoice {
    const varName = "chainedCancelInvoice";
    if (obj === null) {
        console.error("ChainedCancelInvoice cannot be null");
        return false;
    }
    if (typeof obj !== "object") {
        console.error("ChainedCancelInvoice: object expected");
        return false;
    }
    if (!obj.invoice) {
        console.error(`${varName} type mismatch, expected: CancelInvoice, found:`, obj.invoice);
        return false;
    }
    if (!obj.previousId) {
        console.error(
            `${varName} type mismatch, expected: PreviousInvoiceId, found:`,
            obj.previousId
        );
        return false;
    }
    return isCancelInvoice(obj.invoice) && isPreviousInvoiceId(obj.previousId);
}
