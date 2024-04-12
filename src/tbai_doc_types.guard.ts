/*
 * Generated type guards for "tbai_doc_types.ts".
 * WARNING: Do not manually change this file.
 */
import { Issuer, RecipientIrs, RecipientOther, Recipient, TaxType, VatExemptReason, VatNotExemptType, NotSubjectToVatReason, MerchandiseOrService, InvoiceLine, VatLine, RetentionLine, InvoiceDescription, InvoiceDescriptionJson, VatKey, CreditNoteType, IssuedBy, FixActionType, Invoice, ChainedInvoice, CancelInvoice, InvoiceTbaiData, CancelInvoiceTbaiData, CancelInvoiceRef, QueryInvoiceRef, Message, QueueState } from "./tbai_doc_types";
import { isInvoiceId, isPreviousInvoiceId } from "./invoice_id.guard";

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

export function isIssuer(obj: unknown, argumentName: string = "issuer"): obj is Issuer {
    const typedObj = obj as Issuer
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"])
    )
}

export function isRecipientIrs(obj: unknown, argumentName: string = "recipientIrs"): obj is RecipientIrs {
    const typedObj = obj as RecipientIrs
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"]) &&
        evaluate(typeof typedObj["idType"] === "undefined", `${argumentName}["idType"]`, "undefined", typedObj["idType"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate((typedObj["country"] === "IE" ||
            typedObj["country"] === "LC" ||
            typedObj["country"] === "AF" ||
            typedObj["country"] === "AL" ||
            typedObj["country"] === "DE" ||
            typedObj["country"] === "AD" ||
            typedObj["country"] === "AO" ||
            typedObj["country"] === "AI" ||
            typedObj["country"] === "AQ" ||
            typedObj["country"] === "AG" ||
            typedObj["country"] === "SA" ||
            typedObj["country"] === "DZ" ||
            typedObj["country"] === "AR" ||
            typedObj["country"] === "AM" ||
            typedObj["country"] === "AW" ||
            typedObj["country"] === "AU" ||
            typedObj["country"] === "AT" ||
            typedObj["country"] === "AZ" ||
            typedObj["country"] === "BS" ||
            typedObj["country"] === "BH" ||
            typedObj["country"] === "BD" ||
            typedObj["country"] === "BB" ||
            typedObj["country"] === "BE" ||
            typedObj["country"] === "BZ" ||
            typedObj["country"] === "BJ" ||
            typedObj["country"] === "BM" ||
            typedObj["country"] === "BY" ||
            typedObj["country"] === "BO" ||
            typedObj["country"] === "BA" ||
            typedObj["country"] === "BW" ||
            typedObj["country"] === "BV" ||
            typedObj["country"] === "BR" ||
            typedObj["country"] === "BN" ||
            typedObj["country"] === "BG" ||
            typedObj["country"] === "BF" ||
            typedObj["country"] === "BI" ||
            typedObj["country"] === "BT" ||
            typedObj["country"] === "CV" ||
            typedObj["country"] === "KY" ||
            typedObj["country"] === "KH" ||
            typedObj["country"] === "CM" ||
            typedObj["country"] === "CA" ||
            typedObj["country"] === "CF" ||
            typedObj["country"] === "CC" ||
            typedObj["country"] === "CO" ||
            typedObj["country"] === "KM" ||
            typedObj["country"] === "CG" ||
            typedObj["country"] === "CD" ||
            typedObj["country"] === "CK" ||
            typedObj["country"] === "KP" ||
            typedObj["country"] === "KR" ||
            typedObj["country"] === "CI" ||
            typedObj["country"] === "CR" ||
            typedObj["country"] === "HR" ||
            typedObj["country"] === "CU" ||
            typedObj["country"] === "TD" ||
            typedObj["country"] === "CZ" ||
            typedObj["country"] === "CL" ||
            typedObj["country"] === "CN" ||
            typedObj["country"] === "CY" ||
            typedObj["country"] === "CW" ||
            typedObj["country"] === "DK" ||
            typedObj["country"] === "DM" ||
            typedObj["country"] === "DO" ||
            typedObj["country"] === "EC" ||
            typedObj["country"] === "EG" ||
            typedObj["country"] === "AE" ||
            typedObj["country"] === "ER" ||
            typedObj["country"] === "SK" ||
            typedObj["country"] === "SI" ||
            typedObj["country"] === "ES" ||
            typedObj["country"] === "US" ||
            typedObj["country"] === "EE" ||
            typedObj["country"] === "ET" ||
            typedObj["country"] === "FO" ||
            typedObj["country"] === "PH" ||
            typedObj["country"] === "FI" ||
            typedObj["country"] === "FJ" ||
            typedObj["country"] === "FR" ||
            typedObj["country"] === "GA" ||
            typedObj["country"] === "GM" ||
            typedObj["country"] === "GE" ||
            typedObj["country"] === "GS" ||
            typedObj["country"] === "GH" ||
            typedObj["country"] === "GI" ||
            typedObj["country"] === "GD" ||
            typedObj["country"] === "GR" ||
            typedObj["country"] === "GL" ||
            typedObj["country"] === "GU" ||
            typedObj["country"] === "GT" ||
            typedObj["country"] === "GG" ||
            typedObj["country"] === "GN" ||
            typedObj["country"] === "GQ" ||
            typedObj["country"] === "GW" ||
            typedObj["country"] === "GY" ||
            typedObj["country"] === "HT" ||
            typedObj["country"] === "HM" ||
            typedObj["country"] === "HN" ||
            typedObj["country"] === "HK" ||
            typedObj["country"] === "HU" ||
            typedObj["country"] === "IN" ||
            typedObj["country"] === "ID" ||
            typedObj["country"] === "IR" ||
            typedObj["country"] === "IQ" ||
            typedObj["country"] === "IM" ||
            typedObj["country"] === "IS" ||
            typedObj["country"] === "IL" ||
            typedObj["country"] === "IT" ||
            typedObj["country"] === "JM" ||
            typedObj["country"] === "JP" ||
            typedObj["country"] === "JE" ||
            typedObj["country"] === "JO" ||
            typedObj["country"] === "KZ" ||
            typedObj["country"] === "KE" ||
            typedObj["country"] === "KG" ||
            typedObj["country"] === "KI" ||
            typedObj["country"] === "KW" ||
            typedObj["country"] === "LA" ||
            typedObj["country"] === "LS" ||
            typedObj["country"] === "LV" ||
            typedObj["country"] === "LB" ||
            typedObj["country"] === "LR" ||
            typedObj["country"] === "LY" ||
            typedObj["country"] === "LI" ||
            typedObj["country"] === "LT" ||
            typedObj["country"] === "LU" ||
            typedObj["country"] === "XG" ||
            typedObj["country"] === "MO" ||
            typedObj["country"] === "MK" ||
            typedObj["country"] === "MG" ||
            typedObj["country"] === "MY" ||
            typedObj["country"] === "MW" ||
            typedObj["country"] === "MV" ||
            typedObj["country"] === "ML" ||
            typedObj["country"] === "MT" ||
            typedObj["country"] === "FK" ||
            typedObj["country"] === "MP" ||
            typedObj["country"] === "MA" ||
            typedObj["country"] === "MH" ||
            typedObj["country"] === "MU" ||
            typedObj["country"] === "MR" ||
            typedObj["country"] === "YT" ||
            typedObj["country"] === "UM" ||
            typedObj["country"] === "MX" ||
            typedObj["country"] === "FM" ||
            typedObj["country"] === "MD" ||
            typedObj["country"] === "MC" ||
            typedObj["country"] === "MN" ||
            typedObj["country"] === "ME" ||
            typedObj["country"] === "MS" ||
            typedObj["country"] === "MZ" ||
            typedObj["country"] === "MM" ||
            typedObj["country"] === "NA" ||
            typedObj["country"] === "NR" ||
            typedObj["country"] === "CX" ||
            typedObj["country"] === "NP" ||
            typedObj["country"] === "NI" ||
            typedObj["country"] === "NE" ||
            typedObj["country"] === "NG" ||
            typedObj["country"] === "NU" ||
            typedObj["country"] === "NF" ||
            typedObj["country"] === "NO" ||
            typedObj["country"] === "NC" ||
            typedObj["country"] === "NZ" ||
            typedObj["country"] === "IO" ||
            typedObj["country"] === "OM" ||
            typedObj["country"] === "NL" ||
            typedObj["country"] === "BQ" ||
            typedObj["country"] === "PK" ||
            typedObj["country"] === "PW" ||
            typedObj["country"] === "PA" ||
            typedObj["country"] === "PG" ||
            typedObj["country"] === "PY" ||
            typedObj["country"] === "PE" ||
            typedObj["country"] === "PN" ||
            typedObj["country"] === "PF" ||
            typedObj["country"] === "PL" ||
            typedObj["country"] === "PT" ||
            typedObj["country"] === "PR" ||
            typedObj["country"] === "QA" ||
            typedObj["country"] === "GB" ||
            typedObj["country"] === "RW" ||
            typedObj["country"] === "RO" ||
            typedObj["country"] === "RU" ||
            typedObj["country"] === "SB" ||
            typedObj["country"] === "SV" ||
            typedObj["country"] === "WS" ||
            typedObj["country"] === "AS" ||
            typedObj["country"] === "KN" ||
            typedObj["country"] === "SM" ||
            typedObj["country"] === "SX" ||
            typedObj["country"] === "PM" ||
            typedObj["country"] === "VC" ||
            typedObj["country"] === "SH" ||
            typedObj["country"] === "ST" ||
            typedObj["country"] === "SN" ||
            typedObj["country"] === "RS" ||
            typedObj["country"] === "SC" ||
            typedObj["country"] === "SL" ||
            typedObj["country"] === "SG" ||
            typedObj["country"] === "SY" ||
            typedObj["country"] === "SO" ||
            typedObj["country"] === "LK" ||
            typedObj["country"] === "SZ" ||
            typedObj["country"] === "ZA" ||
            typedObj["country"] === "SD" ||
            typedObj["country"] === "SS" ||
            typedObj["country"] === "SE" ||
            typedObj["country"] === "CH" ||
            typedObj["country"] === "SR" ||
            typedObj["country"] === "TH" ||
            typedObj["country"] === "TW" ||
            typedObj["country"] === "TZ" ||
            typedObj["country"] === "TJ" ||
            typedObj["country"] === "PS" ||
            typedObj["country"] === "TF" ||
            typedObj["country"] === "TL" ||
            typedObj["country"] === "TG" ||
            typedObj["country"] === "TK" ||
            typedObj["country"] === "TO" ||
            typedObj["country"] === "TT" ||
            typedObj["country"] === "TN" ||
            typedObj["country"] === "TC" ||
            typedObj["country"] === "TM" ||
            typedObj["country"] === "TR" ||
            typedObj["country"] === "TV" ||
            typedObj["country"] === "UA" ||
            typedObj["country"] === "UG" ||
            typedObj["country"] === "UY" ||
            typedObj["country"] === "UZ" ||
            typedObj["country"] === "VU" ||
            typedObj["country"] === "VA" ||
            typedObj["country"] === "VE" ||
            typedObj["country"] === "VN" ||
            typedObj["country"] === "VG" ||
            typedObj["country"] === "VI" ||
            typedObj["country"] === "WF" ||
            typedObj["country"] === "YE" ||
            typedObj["country"] === "DJ" ||
            typedObj["country"] === "ZM" ||
            typedObj["country"] === "ZW" ||
            typedObj["country"] === "QU" ||
            typedObj["country"] === "XB" ||
            typedObj["country"] === "XU" ||
            typedObj["country"] === "XN" ||
            typedObj["country"] === "AX" ||
            typedObj["country"] === "BL" ||
            typedObj["country"] === "EH" ||
            typedObj["country"] === "GF" ||
            typedObj["country"] === "GP" ||
            typedObj["country"] === "MF" ||
            typedObj["country"] === "MQ" ||
            typedObj["country"] === "RE" ||
            typedObj["country"] === "SJ"), `${argumentName}["country"]`, "import(\"./src/common_doc_types\").CountryCode", typedObj["country"]) &&
        evaluate((typeof typedObj["postal"] === "undefined" ||
            typeof typedObj["postal"] === "string"), `${argumentName}["postal"]`, "string | undefined", typedObj["postal"]) &&
        evaluate((typeof typedObj["address"] === "undefined" ||
            typeof typedObj["address"] === "string"), `${argumentName}["address"]`, "string | undefined", typedObj["address"]) &&
        evaluate((typeof typedObj["vat2"] === "undefined" ||
            typedObj["vat2"] === false ||
            typedObj["vat2"] === true), `${argumentName}["vat2"]`, "boolean | undefined", typedObj["vat2"]) &&
        evaluate((typeof typedObj["vatToVat2"] === "undefined" ||
            (typedObj["vatToVat2"] !== null &&
                typeof typedObj["vatToVat2"] === "object" ||
                typeof typedObj["vatToVat2"] === "function") &&
            Object.entries<any>(typedObj["vatToVat2"])
                .every(([key, value]) => (evaluate(typeof value === "number", `${argumentName}["vatToVat2"]["${key.toString().replace(/"/g, '\\"')}"]`, "number", value) &&
                    evaluate(typeof key === "string", `${argumentName}["vatToVat2"] (key: "${key.toString().replace(/"/g, '\\"')}")`, "string", key)))), `${argumentName}["vatToVat2"]`, "{ [vat: string]: number; } | undefined", typedObj["vatToVat2"])
    )
}

export function isRecipientOther(obj: unknown, argumentName: string = "recipientOther"): obj is RecipientOther {
    const typedObj = obj as RecipientOther
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["id"] === "string", `${argumentName}["id"]`, "string", typedObj["id"]) &&
        evaluate((typedObj["idType"] === "02" ||
            typedObj["idType"] === "03" ||
            typedObj["idType"] === "04" ||
            typedObj["idType"] === "05" ||
            typedObj["idType"] === "06"), `${argumentName}["idType"]`, "import(\"./src/common_doc_types\").IrsIdType", typedObj["idType"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate((typedObj["country"] === "IE" ||
            typedObj["country"] === "LC" ||
            typedObj["country"] === "AF" ||
            typedObj["country"] === "AL" ||
            typedObj["country"] === "DE" ||
            typedObj["country"] === "AD" ||
            typedObj["country"] === "AO" ||
            typedObj["country"] === "AI" ||
            typedObj["country"] === "AQ" ||
            typedObj["country"] === "AG" ||
            typedObj["country"] === "SA" ||
            typedObj["country"] === "DZ" ||
            typedObj["country"] === "AR" ||
            typedObj["country"] === "AM" ||
            typedObj["country"] === "AW" ||
            typedObj["country"] === "AU" ||
            typedObj["country"] === "AT" ||
            typedObj["country"] === "AZ" ||
            typedObj["country"] === "BS" ||
            typedObj["country"] === "BH" ||
            typedObj["country"] === "BD" ||
            typedObj["country"] === "BB" ||
            typedObj["country"] === "BE" ||
            typedObj["country"] === "BZ" ||
            typedObj["country"] === "BJ" ||
            typedObj["country"] === "BM" ||
            typedObj["country"] === "BY" ||
            typedObj["country"] === "BO" ||
            typedObj["country"] === "BA" ||
            typedObj["country"] === "BW" ||
            typedObj["country"] === "BV" ||
            typedObj["country"] === "BR" ||
            typedObj["country"] === "BN" ||
            typedObj["country"] === "BG" ||
            typedObj["country"] === "BF" ||
            typedObj["country"] === "BI" ||
            typedObj["country"] === "BT" ||
            typedObj["country"] === "CV" ||
            typedObj["country"] === "KY" ||
            typedObj["country"] === "KH" ||
            typedObj["country"] === "CM" ||
            typedObj["country"] === "CA" ||
            typedObj["country"] === "CF" ||
            typedObj["country"] === "CC" ||
            typedObj["country"] === "CO" ||
            typedObj["country"] === "KM" ||
            typedObj["country"] === "CG" ||
            typedObj["country"] === "CD" ||
            typedObj["country"] === "CK" ||
            typedObj["country"] === "KP" ||
            typedObj["country"] === "KR" ||
            typedObj["country"] === "CI" ||
            typedObj["country"] === "CR" ||
            typedObj["country"] === "HR" ||
            typedObj["country"] === "CU" ||
            typedObj["country"] === "TD" ||
            typedObj["country"] === "CZ" ||
            typedObj["country"] === "CL" ||
            typedObj["country"] === "CN" ||
            typedObj["country"] === "CY" ||
            typedObj["country"] === "CW" ||
            typedObj["country"] === "DK" ||
            typedObj["country"] === "DM" ||
            typedObj["country"] === "DO" ||
            typedObj["country"] === "EC" ||
            typedObj["country"] === "EG" ||
            typedObj["country"] === "AE" ||
            typedObj["country"] === "ER" ||
            typedObj["country"] === "SK" ||
            typedObj["country"] === "SI" ||
            typedObj["country"] === "ES" ||
            typedObj["country"] === "US" ||
            typedObj["country"] === "EE" ||
            typedObj["country"] === "ET" ||
            typedObj["country"] === "FO" ||
            typedObj["country"] === "PH" ||
            typedObj["country"] === "FI" ||
            typedObj["country"] === "FJ" ||
            typedObj["country"] === "FR" ||
            typedObj["country"] === "GA" ||
            typedObj["country"] === "GM" ||
            typedObj["country"] === "GE" ||
            typedObj["country"] === "GS" ||
            typedObj["country"] === "GH" ||
            typedObj["country"] === "GI" ||
            typedObj["country"] === "GD" ||
            typedObj["country"] === "GR" ||
            typedObj["country"] === "GL" ||
            typedObj["country"] === "GU" ||
            typedObj["country"] === "GT" ||
            typedObj["country"] === "GG" ||
            typedObj["country"] === "GN" ||
            typedObj["country"] === "GQ" ||
            typedObj["country"] === "GW" ||
            typedObj["country"] === "GY" ||
            typedObj["country"] === "HT" ||
            typedObj["country"] === "HM" ||
            typedObj["country"] === "HN" ||
            typedObj["country"] === "HK" ||
            typedObj["country"] === "HU" ||
            typedObj["country"] === "IN" ||
            typedObj["country"] === "ID" ||
            typedObj["country"] === "IR" ||
            typedObj["country"] === "IQ" ||
            typedObj["country"] === "IM" ||
            typedObj["country"] === "IS" ||
            typedObj["country"] === "IL" ||
            typedObj["country"] === "IT" ||
            typedObj["country"] === "JM" ||
            typedObj["country"] === "JP" ||
            typedObj["country"] === "JE" ||
            typedObj["country"] === "JO" ||
            typedObj["country"] === "KZ" ||
            typedObj["country"] === "KE" ||
            typedObj["country"] === "KG" ||
            typedObj["country"] === "KI" ||
            typedObj["country"] === "KW" ||
            typedObj["country"] === "LA" ||
            typedObj["country"] === "LS" ||
            typedObj["country"] === "LV" ||
            typedObj["country"] === "LB" ||
            typedObj["country"] === "LR" ||
            typedObj["country"] === "LY" ||
            typedObj["country"] === "LI" ||
            typedObj["country"] === "LT" ||
            typedObj["country"] === "LU" ||
            typedObj["country"] === "XG" ||
            typedObj["country"] === "MO" ||
            typedObj["country"] === "MK" ||
            typedObj["country"] === "MG" ||
            typedObj["country"] === "MY" ||
            typedObj["country"] === "MW" ||
            typedObj["country"] === "MV" ||
            typedObj["country"] === "ML" ||
            typedObj["country"] === "MT" ||
            typedObj["country"] === "FK" ||
            typedObj["country"] === "MP" ||
            typedObj["country"] === "MA" ||
            typedObj["country"] === "MH" ||
            typedObj["country"] === "MU" ||
            typedObj["country"] === "MR" ||
            typedObj["country"] === "YT" ||
            typedObj["country"] === "UM" ||
            typedObj["country"] === "MX" ||
            typedObj["country"] === "FM" ||
            typedObj["country"] === "MD" ||
            typedObj["country"] === "MC" ||
            typedObj["country"] === "MN" ||
            typedObj["country"] === "ME" ||
            typedObj["country"] === "MS" ||
            typedObj["country"] === "MZ" ||
            typedObj["country"] === "MM" ||
            typedObj["country"] === "NA" ||
            typedObj["country"] === "NR" ||
            typedObj["country"] === "CX" ||
            typedObj["country"] === "NP" ||
            typedObj["country"] === "NI" ||
            typedObj["country"] === "NE" ||
            typedObj["country"] === "NG" ||
            typedObj["country"] === "NU" ||
            typedObj["country"] === "NF" ||
            typedObj["country"] === "NO" ||
            typedObj["country"] === "NC" ||
            typedObj["country"] === "NZ" ||
            typedObj["country"] === "IO" ||
            typedObj["country"] === "OM" ||
            typedObj["country"] === "NL" ||
            typedObj["country"] === "BQ" ||
            typedObj["country"] === "PK" ||
            typedObj["country"] === "PW" ||
            typedObj["country"] === "PA" ||
            typedObj["country"] === "PG" ||
            typedObj["country"] === "PY" ||
            typedObj["country"] === "PE" ||
            typedObj["country"] === "PN" ||
            typedObj["country"] === "PF" ||
            typedObj["country"] === "PL" ||
            typedObj["country"] === "PT" ||
            typedObj["country"] === "PR" ||
            typedObj["country"] === "QA" ||
            typedObj["country"] === "GB" ||
            typedObj["country"] === "RW" ||
            typedObj["country"] === "RO" ||
            typedObj["country"] === "RU" ||
            typedObj["country"] === "SB" ||
            typedObj["country"] === "SV" ||
            typedObj["country"] === "WS" ||
            typedObj["country"] === "AS" ||
            typedObj["country"] === "KN" ||
            typedObj["country"] === "SM" ||
            typedObj["country"] === "SX" ||
            typedObj["country"] === "PM" ||
            typedObj["country"] === "VC" ||
            typedObj["country"] === "SH" ||
            typedObj["country"] === "ST" ||
            typedObj["country"] === "SN" ||
            typedObj["country"] === "RS" ||
            typedObj["country"] === "SC" ||
            typedObj["country"] === "SL" ||
            typedObj["country"] === "SG" ||
            typedObj["country"] === "SY" ||
            typedObj["country"] === "SO" ||
            typedObj["country"] === "LK" ||
            typedObj["country"] === "SZ" ||
            typedObj["country"] === "ZA" ||
            typedObj["country"] === "SD" ||
            typedObj["country"] === "SS" ||
            typedObj["country"] === "SE" ||
            typedObj["country"] === "CH" ||
            typedObj["country"] === "SR" ||
            typedObj["country"] === "TH" ||
            typedObj["country"] === "TW" ||
            typedObj["country"] === "TZ" ||
            typedObj["country"] === "TJ" ||
            typedObj["country"] === "PS" ||
            typedObj["country"] === "TF" ||
            typedObj["country"] === "TL" ||
            typedObj["country"] === "TG" ||
            typedObj["country"] === "TK" ||
            typedObj["country"] === "TO" ||
            typedObj["country"] === "TT" ||
            typedObj["country"] === "TN" ||
            typedObj["country"] === "TC" ||
            typedObj["country"] === "TM" ||
            typedObj["country"] === "TR" ||
            typedObj["country"] === "TV" ||
            typedObj["country"] === "UA" ||
            typedObj["country"] === "UG" ||
            typedObj["country"] === "UY" ||
            typedObj["country"] === "UZ" ||
            typedObj["country"] === "VU" ||
            typedObj["country"] === "VA" ||
            typedObj["country"] === "VE" ||
            typedObj["country"] === "VN" ||
            typedObj["country"] === "VG" ||
            typedObj["country"] === "VI" ||
            typedObj["country"] === "WF" ||
            typedObj["country"] === "YE" ||
            typedObj["country"] === "DJ" ||
            typedObj["country"] === "ZM" ||
            typedObj["country"] === "ZW" ||
            typedObj["country"] === "QU" ||
            typedObj["country"] === "XB" ||
            typedObj["country"] === "XU" ||
            typedObj["country"] === "XN" ||
            typedObj["country"] === "AX" ||
            typedObj["country"] === "BL" ||
            typedObj["country"] === "EH" ||
            typedObj["country"] === "GF" ||
            typedObj["country"] === "GP" ||
            typedObj["country"] === "MF" ||
            typedObj["country"] === "MQ" ||
            typedObj["country"] === "RE" ||
            typedObj["country"] === "SJ"), `${argumentName}["country"]`, "import(\"./src/common_doc_types\").CountryCode", typedObj["country"]) &&
        evaluate((typeof typedObj["postal"] === "undefined" ||
            typeof typedObj["postal"] === "string"), `${argumentName}["postal"]`, "string | undefined", typedObj["postal"]) &&
        evaluate((typeof typedObj["address"] === "undefined" ||
            typeof typedObj["address"] === "string"), `${argumentName}["address"]`, "string | undefined", typedObj["address"])
    )
}

export function isRecipient(obj: unknown, argumentName: string = "recipient"): obj is Recipient {
    const typedObj = obj as Recipient
    return (
        (isRecipientIrs(typedObj) as boolean ||
            isRecipientOther(typedObj) as boolean)
    )
}

export function isTaxType(obj: unknown, argumentName: string = "taxType"): obj is TaxType {
    const typedObj = obj as TaxType
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["id"] === "string", `${argumentName}["id"]`, "string", typedObj["id"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(typeof typedObj["tax"] === "number", `${argumentName}["tax"]`, "number", typedObj["tax"])
    )
}

export function isVatExemptReason(obj: unknown, argumentName: string = "vatExemptReason"): obj is VatExemptReason {
    const typedObj = obj as VatExemptReason
    return (
        (typedObj === "E1" ||
            typedObj === "E2" ||
            typedObj === "E3" ||
            typedObj === "E4" ||
            typedObj === "E5" ||
            typedObj === "E6")
    )
}

export function isVatNotExemptType(obj: unknown, argumentName: string = "vatNotExemptType"): obj is VatNotExemptType {
    const typedObj = obj as VatNotExemptType
    return (
        (typedObj === "S1" ||
            typedObj === "S2")
    )
}

export function isNotSubjectToVatReason(obj: unknown, argumentName: string = "notSubjectToVatReason"): obj is NotSubjectToVatReason {
    const typedObj = obj as NotSubjectToVatReason
    return (
        (typedObj === "OT" ||
            typedObj === "RL" ||
            typedObj === "VT" ||
            typedObj === "IE")
    )
}

export function isMerchandiseOrService(obj: unknown, argumentName: string = "merchandiseOrService"): obj is MerchandiseOrService {
    const typedObj = obj as MerchandiseOrService
    return (
        (typedObj === "merchandise" ||
            typedObj === "service")
    )
}

export function isInvoiceLine(obj: unknown, argumentName: string = "invoiceLine"): obj is InvoiceLine {
    const typedObj = obj as InvoiceLine
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["description"] === "string", `${argumentName}["description"]`, "string", typedObj["description"]) &&
        evaluate(typeof typedObj["quantity"] === "number", `${argumentName}["quantity"]`, "number", typedObj["quantity"]) &&
        evaluate(typeof typedObj["price"] === "number", `${argumentName}["price"]`, "number", typedObj["price"]) &&
        evaluate((typeof typedObj["discount"] === "undefined" ||
            typeof typedObj["discount"] === "number"), `${argumentName}["discount"]`, "number | undefined", typedObj["discount"]) &&
        evaluate((typeof typedObj["amount"] === "undefined" ||
            typeof typedObj["amount"] === "number"), `${argumentName}["amount"]`, "number | undefined", typedObj["amount"]) &&
        evaluate((typeof typedObj["amountWithVat"] === "undefined" ||
            typeof typedObj["amountWithVat"] === "number"), `${argumentName}["amountWithVat"]`, "number | undefined", typedObj["amountWithVat"]) &&
        evaluate((typeof typedObj["vat"] === "undefined" ||
            typeof typedObj["vat"] === "number"), `${argumentName}["vat"]`, "number | undefined", typedObj["vat"]) &&
        evaluate((typeof typedObj["retention"] === "undefined" ||
            typeof typedObj["retention"] === "number"), `${argumentName}["retention"]`, "number | undefined", typedObj["retention"]) &&
        evaluate((typeof typedObj["exemptionReason"] === "undefined" ||
            typedObj["exemptionReason"] === "E1" ||
            typedObj["exemptionReason"] === "E2" ||
            typedObj["exemptionReason"] === "E3" ||
            typedObj["exemptionReason"] === "E4" ||
            typedObj["exemptionReason"] === "E5" ||
            typedObj["exemptionReason"] === "E6"), `${argumentName}["exemptionReason"]`, "import(\"./src/tbai_doc_types\").VatExemptReason | undefined", typedObj["exemptionReason"]) &&
        evaluate((typeof typedObj["notExemptionType"] === "undefined" ||
            typedObj["notExemptionType"] === "S1" ||
            typedObj["notExemptionType"] === "S2"), `${argumentName}["notExemptionType"]`, "import(\"./src/tbai_doc_types\").VatNotExemptType | undefined", typedObj["notExemptionType"]) &&
        evaluate((typeof typedObj["notSubjectToVatReason"] === "undefined" ||
            typedObj["notSubjectToVatReason"] === "OT" ||
            typedObj["notSubjectToVatReason"] === "RL" ||
            typedObj["notSubjectToVatReason"] === "VT" ||
            typedObj["notSubjectToVatReason"] === "IE"), `${argumentName}["notSubjectToVatReason"]`, "import(\"./src/tbai_doc_types\").NotSubjectToVatReason | undefined", typedObj["notSubjectToVatReason"]) &&
        evaluate((typeof typedObj["merchandiseOrService"] === "undefined" ||
            typedObj["merchandiseOrService"] === "merchandise" ||
            typedObj["merchandiseOrService"] === "service"), `${argumentName}["merchandiseOrService"]`, "import(\"./src/tbai_doc_types\").MerchandiseOrService | undefined", typedObj["merchandiseOrService"]) &&
        evaluate((typeof typedObj["discountAmount"] === "undefined" ||
            typeof typedObj["discountAmount"] === "number"), `${argumentName}["discountAmount"]`, "number | undefined", typedObj["discountAmount"]) &&
        evaluate((typeof typedObj["isUsingSimplifiedRegime"] === "undefined" ||
            typedObj["isUsingSimplifiedRegime"] === false ||
            typedObj["isUsingSimplifiedRegime"] === true), `${argumentName}["isUsingSimplifiedRegime"]`, "boolean | undefined", typedObj["isUsingSimplifiedRegime"])
    )
}

export function isVatLine(obj: unknown, argumentName: string = "vatLine"): obj is VatLine {
    const typedObj = obj as VatLine
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate(typeof typedObj["rate"] === "number", `${argumentName}["rate"]`, "number", typedObj["rate"]) &&
        evaluate((typeof typedObj["amount"] === "undefined" ||
            typeof typedObj["amount"] === "number"), `${argumentName}["amount"]`, "number | undefined", typedObj["amount"]) &&
        evaluate((typeof typedObj["rate2"] === "undefined" ||
            typeof typedObj["rate2"] === "number"), `${argumentName}["rate2"]`, "number | undefined", typedObj["rate2"]) &&
        evaluate((typeof typedObj["amount2"] === "undefined" ||
            typeof typedObj["amount2"] === "number"), `${argumentName}["amount2"]`, "number | undefined", typedObj["amount2"]) &&
        evaluate((typeof typedObj["exemptionReason"] === "undefined" ||
            typedObj["exemptionReason"] === "E1" ||
            typedObj["exemptionReason"] === "E2" ||
            typedObj["exemptionReason"] === "E3" ||
            typedObj["exemptionReason"] === "E4" ||
            typedObj["exemptionReason"] === "E5" ||
            typedObj["exemptionReason"] === "E6"), `${argumentName}["exemptionReason"]`, "import(\"./src/tbai_doc_types\").VatExemptReason | undefined", typedObj["exemptionReason"]) &&
        evaluate((typeof typedObj["notExemptionType"] === "undefined" ||
            typedObj["notExemptionType"] === "S1" ||
            typedObj["notExemptionType"] === "S2"), `${argumentName}["notExemptionType"]`, "import(\"./src/tbai_doc_types\").VatNotExemptType | undefined", typedObj["notExemptionType"]) &&
        evaluate((typeof typedObj["notSubjectToVatReason"] === "undefined" ||
            typedObj["notSubjectToVatReason"] === "OT" ||
            typedObj["notSubjectToVatReason"] === "RL" ||
            typedObj["notSubjectToVatReason"] === "VT" ||
            typedObj["notSubjectToVatReason"] === "IE"), `${argumentName}["notSubjectToVatReason"]`, "import(\"./src/tbai_doc_types\").NotSubjectToVatReason | undefined", typedObj["notSubjectToVatReason"]) &&
        evaluate((typeof typedObj["merchandiseOrService"] === "undefined" ||
            typedObj["merchandiseOrService"] === "merchandise" ||
            typedObj["merchandiseOrService"] === "service"), `${argumentName}["merchandiseOrService"]`, "import(\"./src/tbai_doc_types\").MerchandiseOrService | undefined", typedObj["merchandiseOrService"]) &&
        evaluate((typeof typedObj["isUsingSimplifiedRegime"] === "undefined" ||
            typedObj["isUsingSimplifiedRegime"] === false ||
            typedObj["isUsingSimplifiedRegime"] === true), `${argumentName}["isUsingSimplifiedRegime"]`, "boolean | undefined", typedObj["isUsingSimplifiedRegime"])
    )
}

export function isRetentionLine(obj: unknown, argumentName: string = "retentionLine"): obj is RetentionLine {
    const typedObj = obj as RetentionLine
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate(typeof typedObj["rate"] === "number", `${argumentName}["rate"]`, "number", typedObj["rate"]) &&
        evaluate((typeof typedObj["amount"] === "undefined" ||
            typeof typedObj["amount"] === "number"), `${argumentName}["amount"]`, "number | undefined", typedObj["amount"])
    )
}

export function isInvoiceDescription(obj: unknown, argumentName: string = "invoiceDescription"): obj is InvoiceDescription {
    const typedObj = obj as InvoiceDescription
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["text"] === "string", `${argumentName}["text"]`, "string", typedObj["text"]) &&
        evaluate(typedObj["operationDate"] instanceof Date, `${argumentName}["operationDate"]`, "Date", typedObj["operationDate"])
    )
}

export function isInvoiceDescriptionJson(obj: unknown, argumentName: string = "invoiceDescriptionJson"): obj is InvoiceDescriptionJson {
    const typedObj = obj as InvoiceDescriptionJson
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["text"] === "string", `${argumentName}["text"]`, "string", typedObj["text"]) &&
        evaluate((typeof typedObj["operationDate"] === "string" ||
            typedObj["operationDate"] instanceof Date), `${argumentName}["operationDate"]`, "string | Date", typedObj["operationDate"])
    )
}

export function isVatKey(obj: unknown, argumentName: string = "vatKey"): obj is VatKey {
    const typedObj = obj as VatKey
    return (
        (typedObj === "01" ||
            typedObj === "02" ||
            typedObj === "03" ||
            typedObj === "04" ||
            typedObj === "05" ||
            typedObj === "06" ||
            typedObj === "07" ||
            typedObj === "08" ||
            typedObj === "09" ||
            typedObj === "10" ||
            typedObj === "11" ||
            typedObj === "12" ||
            typedObj === "13" ||
            typedObj === "14" ||
            typedObj === "15" ||
            typedObj === "17" ||
            typedObj === "19" ||
            typedObj === "51" ||
            typedObj === "52" ||
            typedObj === "53" ||
            typedObj === "54")
    )
}

export function isCreditNoteType(obj: unknown, argumentName: string = "creditNoteType"): obj is CreditNoteType {
    const typedObj = obj as CreditNoteType
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typedObj["reason"] === "R1" ||
            typedObj["reason"] === "R2" ||
            typedObj["reason"] === "R3" ||
            typedObj["reason"] === "R4" ||
            typedObj["reason"] === "R5"), `${argumentName}["reason"]`, "\"R1\" | \"R2\" | \"R3\" | \"R4\" | \"R5\"", typedObj["reason"]) &&
        evaluate((typedObj["style"] === "I" ||
            typedObj["style"] === "S"), `${argumentName}["style"]`, "\"I\" | \"S\"", typedObj["style"]) &&
        evaluate(Array.isArray(typedObj["ids"]) &&
            typedObj["ids"].every((e: any) =>
                isInvoiceId(e) as boolean
            ), `${argumentName}["ids"]`, "import(\"./src/invoice_id\").InvoiceId[]", typedObj["ids"]) &&
        evaluate((typeof typedObj["creditBase"] === "undefined" ||
            typeof typedObj["creditBase"] === "number"), `${argumentName}["creditBase"]`, "number | undefined", typedObj["creditBase"]) &&
        evaluate((typeof typedObj["creditVat"] === "undefined" ||
            typeof typedObj["creditVat"] === "number"), `${argumentName}["creditVat"]`, "number | undefined", typedObj["creditVat"]) &&
        evaluate((typeof typedObj["creditRecharge"] === "undefined" ||
            typeof typedObj["creditRecharge"] === "number"), `${argumentName}["creditRecharge"]`, "number | undefined", typedObj["creditRecharge"])
    )
}

export function isIssuedBy(obj: unknown, argumentName: string = "issuedBy"): obj is IssuedBy {
    const typedObj = obj as IssuedBy
    return (
        (typedObj === "N" ||
            typedObj === "T" ||
            typedObj === "D")
    )
}

export function isFixActionType(obj: unknown, argumentName: string = "fixActionType"): obj is FixActionType {
    const typedObj = obj as FixActionType
    return (
        (typedObj === "SUBSANAR" ||
            typedObj === "MODIFICAR")
    )
}

export function isInvoice(obj: unknown, argumentName: string = "invoice"): obj is Invoice {
    const typedObj = obj as Invoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/tbai_doc_types\").Issuer", typedObj["issuer"]) &&
        evaluate((typeof typedObj["recipient"] === "undefined" ||
            isRecipientIrs(typedObj["recipient"]) as boolean ||
            isRecipientOther(typedObj["recipient"]) as boolean), `${argumentName}["recipient"]`, "import(\"./src/tbai_doc_types\").Recipient | undefined", typedObj["recipient"]) &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/invoice_id\").InvoiceId", typedObj["id"]) &&
        evaluate((typeof typedObj["replacesTicket"] === "undefined" ||
            typedObj["replacesTicket"] === false ||
            typedObj["replacesTicket"] === true), `${argumentName}["replacesTicket"]`, "boolean | undefined", typedObj["replacesTicket"]) &&
        evaluate((typeof typedObj["replacedTicketIds"] === "undefined" ||
            Array.isArray(typedObj["replacedTicketIds"]) &&
            typedObj["replacedTicketIds"].every((e: any) =>
                isInvoiceId(e) as boolean
            )), `${argumentName}["replacedTicketIds"]`, "import(\"./src/invoice_id\").InvoiceId[] | undefined", typedObj["replacedTicketIds"]) &&
        evaluate((typeof typedObj["creditNote"] === "undefined" ||
            isCreditNoteType(typedObj["creditNote"]) as boolean), `${argumentName}["creditNote"]`, "import(\"./src/tbai_doc_types\").CreditNoteType | undefined", typedObj["creditNote"]) &&
        evaluate((typeof typedObj["simple"] === "undefined" ||
            typedObj["simple"] === false ||
            typedObj["simple"] === true), `${argumentName}["simple"]`, "boolean | undefined", typedObj["simple"]) &&
        evaluate((typeof typedObj["description"] === "undefined" ||
            isInvoiceDescription(typedObj["description"]) as boolean), `${argumentName}["description"]`, "import(\"./src/tbai_doc_types\").InvoiceDescription | undefined", typedObj["description"]) &&
        evaluate((typeof typedObj["vatLines"] === "undefined" ||
            Array.isArray(typedObj["vatLines"]) &&
            typedObj["vatLines"].every((e: any) =>
                isVatLine(e) as boolean
            )), `${argumentName}["vatLines"]`, "import(\"./src/tbai_doc_types\").VatLine[] | undefined", typedObj["vatLines"]) &&
        evaluate((typeof typedObj["retentionLines"] === "undefined" ||
            Array.isArray(typedObj["retentionLines"]) &&
            typedObj["retentionLines"].every((e: any) =>
                isRetentionLine(e) as boolean
            )), `${argumentName}["retentionLines"]`, "import(\"./src/tbai_doc_types\").RetentionLine[] | undefined", typedObj["retentionLines"]) &&
        evaluate((typeof typedObj["lines"] === "undefined" ||
            Array.isArray(typedObj["lines"]) &&
            typedObj["lines"].every((e: any) =>
                isInvoiceLine(e) as boolean
            )), `${argumentName}["lines"]`, "import(\"./src/tbai_doc_types\").InvoiceLine[] | undefined", typedObj["lines"]) &&
        evaluate((typeof typedObj["total"] === "undefined" ||
            typeof typedObj["total"] === "number"), `${argumentName}["total"]`, "number | undefined", typedObj["total"]) &&
        evaluate((typeof typedObj["retentionAmount"] === "undefined" ||
            typeof typedObj["retentionAmount"] === "number"), `${argumentName}["retentionAmount"]`, "number | undefined", typedObj["retentionAmount"]) &&
        evaluate((typeof typedObj["vat"] === "undefined" ||
            typeof typedObj["vat"] === "number"), `${argumentName}["vat"]`, "number | undefined", typedObj["vat"]) &&
        evaluate((typeof typedObj["retention"] === "undefined" ||
            typeof typedObj["retention"] === "number"), `${argumentName}["retention"]`, "number | undefined", typedObj["retention"]) &&
        evaluate((typeof typedObj["vatKeys"] === "undefined" ||
            Array.isArray(typedObj["vatKeys"]) &&
            typedObj["vatKeys"].every((e: any) =>
                isVatKey(e) as boolean
            )), `${argumentName}["vatKeys"]`, "import(\"./src/tbai_doc_types\").VatKey[] | undefined", typedObj["vatKeys"]) &&
        evaluate((typeof typedObj["issuedBy"] === "undefined" ||
            typedObj["issuedBy"] === "N" ||
            typedObj["issuedBy"] === "T" ||
            typedObj["issuedBy"] === "D"), `${argumentName}["issuedBy"]`, "import(\"./src/tbai_doc_types\").IssuedBy | undefined", typedObj["issuedBy"]) &&
        evaluate((typeof typedObj["isFix"] === "undefined" ||
            typedObj["isFix"] === false ||
            typedObj["isFix"] === true), `${argumentName}["isFix"]`, "boolean | undefined", typedObj["isFix"]) &&
        evaluate((typeof typedObj["hashFix"] === "undefined" ||
            typeof typedObj["hashFix"] === "string"), `${argumentName}["hashFix"]`, "string | undefined", typedObj["hashFix"]) &&
        evaluate((typeof typedObj["actionTypeFix"] === "undefined" ||
            typedObj["actionTypeFix"] === "SUBSANAR" ||
            typedObj["actionTypeFix"] === "MODIFICAR"), `${argumentName}["actionTypeFix"]`, "import(\"./src/tbai_doc_types\").FixActionType | undefined", typedObj["actionTypeFix"])
    )
}

export function isChainedInvoice(obj: unknown, argumentName: string = "chainedInvoice"): obj is ChainedInvoice {
    const typedObj = obj as ChainedInvoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isInvoice(typedObj["invoice"]) as boolean, `${argumentName}["invoice"]`, "import(\"./src/tbai_doc_types\").Invoice", typedObj["invoice"]) &&
        evaluate((typedObj["previousId"] === null ||
            isPreviousInvoiceId(typedObj["previousId"]) as boolean), `${argumentName}["previousId"]`, "import(\"./src/invoice_id\").PreviousInvoiceId | null", typedObj["previousId"])
    )
}

export function isCancelInvoice(obj: unknown, argumentName: string = "cancelInvoice"): obj is CancelInvoice {
    const typedObj = obj as CancelInvoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/invoice_id\").InvoiceId", typedObj["id"]) &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/tbai_doc_types\").Issuer", typedObj["issuer"])
    )
}

export function isInvoiceTbaiData(obj: unknown, argumentName: string = "invoiceTbaiData"): obj is InvoiceTbaiData {
    const typedObj = obj as InvoiceTbaiData
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["qrcode"] === "string", `${argumentName}["qrcode"]`, "string", typedObj["qrcode"]) &&
        evaluate(isPreviousInvoiceId(typedObj["chainInfo"]) as boolean, `${argumentName}["chainInfo"]`, "import(\"./src/invoice_id\").PreviousInvoiceId", typedObj["chainInfo"]) &&
        evaluate(typeof typedObj["tbaiXml"] === "string", `${argumentName}["tbaiXml"]`, "string", typedObj["tbaiXml"]) &&
        evaluate(typeof typedObj["tbaiId"] === "string", `${argumentName}["tbaiId"]`, "string", typedObj["tbaiId"]) &&
        evaluate(typeof typedObj["queueId"] === "number", `${argumentName}["queueId"]`, "number", typedObj["queueId"])
    )
}

export function isCancelInvoiceTbaiData(obj: unknown, argumentName: string = "cancelInvoiceTbaiData"): obj is CancelInvoiceTbaiData {
    const typedObj = obj as CancelInvoiceTbaiData
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["tbaiXml"] === "string", `${argumentName}["tbaiXml"]`, "string", typedObj["tbaiXml"]) &&
        evaluate(typeof typedObj["tbaiId"] === "string", `${argumentName}["tbaiId"]`, "string", typedObj["tbaiId"]) &&
        evaluate(typeof typedObj["queueId"] === "number", `${argumentName}["queueId"]`, "number", typedObj["queueId"])
    )
}

export function isCancelInvoiceRef(obj: unknown, argumentName: string = "cancelInvoiceRef"): obj is CancelInvoiceRef {
    const typedObj = obj as CancelInvoiceRef
    return (
        (typeof typedObj === "string" ||
            typeof typedObj === "number" ||
            isCancelInvoice(typedObj) as boolean)
    )
}

export function isQueryInvoiceRef(obj: unknown, argumentName: string = "queryInvoiceRef"): obj is QueryInvoiceRef {
    const typedObj = obj as QueryInvoiceRef
    return (
        (typeof typedObj === "string" ||
            typeof typedObj === "number" ||
            isCancelInvoice(typedObj) as boolean)
    )
}

export function isMessage(obj: unknown, argumentName: string = "message"): obj is Message {
    const typedObj = obj as Message
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["message"] === "string", `${argumentName}["message"]`, "string", typedObj["message"])
    )
}

export function isQueueState(obj: unknown, argumentName: string = "queueState"): obj is QueueState {
    const typedObj = obj as QueueState
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typedObj["state"] === "draft" ||
            typedObj["state"] === "pending" ||
            typedObj["state"] === "sent" ||
            typedObj["state"] === "cancel" ||
            typedObj["state"] === "error"), `${argumentName}["state"]`, "\"draft\" | \"pending\" | \"sent\" | \"cancel\" | \"error\"", typedObj["state"])
    )
}
