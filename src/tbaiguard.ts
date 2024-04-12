import { InvoiceId, PreviousInvoiceId, Invoice, ChainedInvoice, CancelInvoice } from "./tbai_doc";
export { isSoftwareIdInfo } from "./tbai_doc.guard";
import { isInvoiceIdJson, isPreviousInvoiceIdJson } from "./invoice_id.guard";
import * as tbaiInvoiceDocGuard from "./invoice_id.guard";
import * as tbaiDocTypesGuard from "./tbai_doc_types.guard";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
function isInvoiceId(obj: any): obj is InvoiceId {
    if (!isInvoiceIdJson(obj)) {
        return false;
    }
    const d = new Date(obj.issuedTime);
    if (isNaN(d.getDate())) {
        console.error("issuedTime is not a valid date: ", obj.issuedTime);
        return false;
    }
    obj.issuedTime = d;
    return tbaiInvoiceDocGuard.isInvoiceId(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isInvoice(obj: any): obj is Invoice {
    if (obj.id) {
        if (!isInvoiceId(obj.id)) {
            return false;
        }
    }
    if (obj.description) {
        if (!tbaiDocTypesGuard.isInvoiceDescriptionJson(obj.description)) {
            return false;
        }
        const d = new Date(obj.description.operationDate);
        if (isNaN(d.getDate())) {
            console.error("operationDate is not a valid date: ", obj.description.operationDate);
            return false;
        }
        obj.description.operationDate = d;
    }

    if (obj.replacesTicket && obj.replacedTicketIds) {
        if (obj.simple) {
            console.error("Invoice can not have both simple and replacesTicket");
            return false;
        }
        if (obj.creditNote) {
            console.error("Invoice can not have both creditNote and replacesTicket");
            return false;
        }
        if (!obj.replacedTicketIds.every(isInvoiceId)) {
            return false;
        }
    } else if (obj.replacesTicket || obj.replacedTicketIds) {
        console.error("replacesTicket or replacedTicketIds expected");
        return false;
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
    if (obj.isFix) {
        if (!obj.hashFix) {
            console.error("hashFix expected for a Fix Invoice");
            return false;
        }
        if (!obj.actionTypeFix) {
            console.error("actionTypeFix expected for a Fix Invoice");
            return false;
        }
    }
    return tbaiDocTypesGuard.isInvoice(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isPreviousInvoiceId(obj: any): obj is PreviousInvoiceId {
    if (!isPreviousInvoiceIdJson(obj)) {
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
    return isInvoiceId(obj.id) && tbaiDocTypesGuard.isIssuer(obj.issuer);
}
