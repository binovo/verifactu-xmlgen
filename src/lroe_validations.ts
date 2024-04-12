import { checkVAT, countries, spain } from "jsvat";
import { Invoice, IssuerIrs, IssuerOther, LroeModel } from "./lroe_doc";

import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

function ensureRecipient(invoice: Invoice): void {
    if (!invoice.recipient || !invoice.recipient.irsId || !invoice.recipient.name) {
        throw new TbaiError(TbaiErrorMessages.ERR_RECIPIENT, TbaiErrorCodes.ERR_RECIPIENT);
    }
}

function ensureIssuer(invoice: Invoice): void {
    // validationError B4_2000011 + B4_2000013
    if (!invoice.issuer.idType) {
        const nif = "ES" + (invoice.issuer as IssuerIrs).irsId;
        const resNif = checkVAT(nif, [spain]);
        if (!resNif.isValid) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_RECIPIENT_NIF_NUMBER,
                TbaiErrorCodes.ERR_RECIPIENT_NIF_NUMBER
            );
        }
    } else if (invoice.issuer.idType == "02") {
        const vat = (invoice.issuer as IssuerOther).id;
        const vatRes = checkVAT(vat, countries);
        if (vatRes.isSupportedCountry && !vatRes.isValid) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_RECIPIENT_VAT_NUMBER,
                TbaiErrorCodes.ERR_RECIPIENT_VAT_NUMBER
            );
        }
    }

    // validationError B4_2000100
    if (invoice.vatKeys[0] == "09" && invoice.issuer.idType != "02") {
        throw new TbaiError(
            TbaiErrorMessages.ERR_VAT_KEY_09_TYPE_ID_02,
            TbaiErrorCodes.ERR_VAT_KEY_09_TYPE_ID_02
        );
    }
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function ensureCreatePurchaseValidations(invoice: Invoice, model: LroeModel): void {
    ensureIssuer(invoice);
    ensureRecipient(invoice);
}
