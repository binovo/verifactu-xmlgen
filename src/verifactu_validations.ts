import { Invoice, CancelInvoice, Software } from "./verifactu_doc";

import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

function ensureRecipient(invoice: Invoice): void {
    if (!invoice.recipient) {
        if (!invoice.simple) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_RECIPIENT_NO_SIMPLE,
                TbaiErrorCodes.ERR_RECIPIENT_NO_SIMPLE
            );
        }
    }
}

export function ensureSoftwareValidations(software: Software): void {
    if (!software || !software.name || !software.version || !software.developerIrsId) {
        throw new TbaiError(TbaiErrorMessages.ERR_SOFTWARE_DATA, TbaiErrorCodes.ERR_SOFTWARE_DATA);
    }
}

export function ensureCreateInvoiceValidations(invoice: Invoice, software: Software): void {
    ensureSoftwareValidations(software);
    ensureRecipient(invoice);
}

export function ensureCancelInvoiceValidations(invoice: CancelInvoice, software: Software): void {
    ensureSoftwareValidations(software);
}
