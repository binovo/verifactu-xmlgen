import { InvoiceId, Invoice, CancelInvoice } from "./lroe_doc";
import { isInvoiceIdJson } from "./invoice_id.guard";
import * as lroeInvoiceDocGuard from "./invoice_id.guard";
import * as lroeDocTypesGuard from "./lroe_doc_types.guard";

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
    return lroeInvoiceDocGuard.isInvoiceId(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isInvoice(obj: any): obj is Invoice {
    if (obj.id) {
        if (!isInvoiceId(obj.id)) {
            return false;
        }
    }
    const r = new Date(obj.receptionDate);
    if (isNaN(r.getDate())) {
        console.error("receptionDate is not a valid date: ", obj.receptionDate);
        return false;
    }
    obj.receptionDate = r;
    if (obj.operationDate) {
        const o = new Date(obj.operationDate);
        if (isNaN(o.getDate())) {
            console.error("operationDate is not a valid date: ", obj.operationDate);
            return false;
        }
        obj.operationDate = o;
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
    return lroeDocTypesGuard.isInvoice(obj);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isCancelInvoice(obj: any): obj is CancelInvoice {
    if (!obj.id) {
        return false;
    }
    if (!obj.issuer) {
        return false;
    }
    return isInvoiceId(obj.id) && lroeDocTypesGuard.isIssuer(obj.issuer);
}
