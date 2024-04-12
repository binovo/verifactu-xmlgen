import { checkVAT, countries, spain } from "jsvat";
import {
    Software,
    InvoiceDescription,
    InvoiceFull,
    VatLineFull,
    RetentionLineFull,
    RecipientOther,
    RecipientIrs,
} from "./tbai_doc";
import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

export interface VatLinesByType {
    exemptedVatLines: Array<VatLineFull>;
    notExemptedVatS1Lines: Array<VatLineFull>;
    notExemptedVatS2Lines: Array<VatLineFull>;
    notSubjectToVatLines: Array<VatLineFull>;
}

export function computeVatLinesByType(vatLinesFull: Array<VatLineFull>): VatLinesByType {
    const exemptedVatLines: Array<VatLineFull> = [],
        notExemptedVatS1Lines: Array<VatLineFull> = [],
        notExemptedVatS2Lines: Array<VatLineFull> = [],
        notSubjectToVatLines: Array<VatLineFull> = [];

    for (const vatLine of vatLinesFull) {
        if (!vatLine.notSubjectToVatReason) {
            if (!vatLine.exemptionReason) {
                if (!vatLine.notExemptionType || "S1" === vatLine.notExemptionType) {
                    notExemptedVatS1Lines.push(vatLine);
                } else if ("S2" === vatLine.notExemptionType) {
                    notExemptedVatS2Lines.push(vatLine);
                }
            } else {
                exemptedVatLines.push(vatLine);
            }
        } else {
            notSubjectToVatLines.push(vatLine);
        }
    }
    return {
        exemptedVatLines,
        notExemptedVatS1Lines,
        notExemptedVatS2Lines,
        notSubjectToVatLines,
    };
}

export function ensureUniqueVatLines(vatLinesFull: Array<VatLineFull>): void {
    const grouped = vatLinesFull.reduce(function (r, a) {
        const key = [
            a.rate.toString(),
            a.rate2.toString(),
            a.isUsingSimplifiedRegime.toString(),
            a.notExemptionType ? a.notExemptionType.toString() : "",
            a.exemptionReason ? a.exemptionReason.toString() : "",
            a.notSubjectToVatReason ? a.notSubjectToVatReason.toString() : "",
        ].join("_");
        r[key] = r[key] || [];
        r[key].push(a);
        return r;
    }, Object.create(null));
    const invalidVatLines = Object.keys(grouped).find((vl) => grouped[vl].length > 1);
    if (invalidVatLines) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_REPEATED_VATLINES,
            TbaiErrorCodes.ERR_REPEATED_VATLINES
        );
    }
}

export function computeRetentionTotal(retentionLines: Array<RetentionLineFull>): number {
    return retentionLines.reduce((acc: number, line: RetentionLineFull) => {
        return acc + line.amount;
    }, 0);
}

export function computeTotal(vatLines: Array<VatLineFull>): number {
    return vatLines.reduce((acc: number, line: VatLineFull) => {
        return acc + line.base + line.amount + line.amount2;
    }, 0);
}

function ensureIssuer(invoice: InvoiceFull): void {
    if (!invoice.issuer || !invoice.issuer.irsId || !invoice.issuer.name) {
        throw new TbaiError(TbaiErrorMessages.ERR_ISSUER, TbaiErrorCodes.ERR_ISSUER);
    }
}

function ensureRecipient(invoice: InvoiceFull): void {
    if (!invoice.recipient) {
        // validationError g1158 + a10-51 + B4_2000018
        if (!invoice.simple) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_RECIPIENT_NO_SIMPLE,
                TbaiErrorCodes.ERR_RECIPIENT_NO_SIMPLE
            );
        }
    } else {
        // validationError g1104/g1153 + a10-68 + a10-55 + B4_2000011
        if (!invoice.recipient.idType) {
            const nif = "ES" + (invoice.recipient as RecipientIrs).irsId;
            const resNif = checkVAT(nif, [spain]);
            if (!resNif.isValid) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_RECIPIENT_NIF_NUMBER,
                    TbaiErrorCodes.ERR_RECIPIENT_NIF_NUMBER
                );
            }
        } else if (invoice.recipient.idType == "02") {
            const vat = (invoice.recipient as RecipientOther).id;
            const vatRes = checkVAT(vat, countries);
            if (vatRes.isSupportedCountry && !vatRes.isValid) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_RECIPIENT_VAT_NUMBER,
                    TbaiErrorCodes.ERR_RECIPIENT_VAT_NUMBER
                );
            }
        }
    }
}

function ensureDescription(invoice: InvoiceFull, description: InvoiceDescription): void {
    if (description) {
        // validationError g1167 + a10-90 + a10-59 + B4_2000046
        const codes = ["14", "15"];
        const found = invoice.vatKeys.some((v) => codes.includes(v));
        if (!found) {
            const now = new Date();
            const operationDate = new Date(description.operationDate);
            now.setHours(0, 0, 0, 0);
            operationDate.setHours(0, 0, 0, 0);
            if (operationDate > now) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_OP_DATE_FUTURE,
                    TbaiErrorCodes.ERR_OP_DATE_FUTURE
                );
            }
            // validationError g1197
            now.setFullYear(now.getFullYear() - 20);
            if (operationDate < now) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_OP_DATE_20_YEARS,
                    TbaiErrorCodes.ERR_OP_DATE_20_YEARS
                );
            }
            const issuedTime = new Date(invoice.id.issuedTime);
            issuedTime.setHours(0, 0, 0, 0);
            if (operationDate > issuedTime) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_OP_DATE_NO_AFTER_ISSUE,
                    TbaiErrorCodes.ERR_OP_DATE_NO_AFTER_ISSUE
                );
            }
        }
    }
}

export function ensureCreateInvoiceValidations(
    invoice: InvoiceFull,
    description: InvoiceDescription,
    g5015: number,
    g5016: boolean,
    g1177: boolean
): void {
    // General validations
    ensureIssuer(invoice);
    ensureDescription(invoice, description);
    ensureRecipient(invoice);
}

export function ensureCreateInvoiceArabaValidations(invoice: InvoiceFull): void {
    const vatLinesByType = computeVatLinesByType(invoice.vatLines);
    const vatLinesS2 = vatLinesByType.notExemptedVatS2Lines;
    if (vatLinesS2.length > 0) {
        // validationError a10-155
        if (vatLinesS2.find((vl) => vl.isUsingSimplifiedRegime)) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_NO_SIMPLE_WITH_VAT_LINES,
                TbaiErrorCodes.ERR_NO_SIMPLE_WITH_VAT_LINES
            );
        }
    }
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function ensureCreateInvoiceBizkaiaValidations(invoice: InvoiceFull): void {
    return;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function ensureCreateInvoiceGipuzkoaValidations(invoice: InvoiceFull): void {
    if (!invoice.lines || invoice.lines.length == 0) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_GIPUZKOA_LINES_REQUIRED,
            TbaiErrorCodes.ERR_GIPUZKOA_LINES_REQUIRED
        );
    }
}

export function ensureSoftwareValidations(software: Software): void {
    if (
        !software ||
        !software.license ||
        !software.name ||
        !software.version ||
        !software.developerIrsId
    ) {
        throw new TbaiError(TbaiErrorMessages.ERR_SOFTWARE_DATA, TbaiErrorCodes.ERR_SOFTWARE_DATA);
    }
}
