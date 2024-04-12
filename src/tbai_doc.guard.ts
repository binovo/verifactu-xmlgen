/*
 * Generated type guards for "tbai_doc.ts".
 * WARNING: Do not manually change this file.
 */
import { TaxAgency, InvoiceLineFull, VatLineFull, RetentionLineFull, InvoiceFull, SoftwareIdInfo, Software, ToXmlOptions } from "./tbai_doc";
import { isInvoice, isVatKey } from "./tbai_doc_types.guard";

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

export function isTaxAgency(obj: unknown, argumentName: string = "taxAgency"): obj is TaxAgency {
    const typedObj = obj as TaxAgency
    return (
        (typedObj === TaxAgency.Araba ||
            typedObj === TaxAgency.Bizkaia ||
            typedObj === TaxAgency.Gipuzkoa)
    )
}

export function isInvoiceLineFull(obj: unknown, argumentName: string = "invoiceLineFull"): obj is InvoiceLineFull {
    const typedObj = obj as InvoiceLineFull
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["description"] === "string", `${argumentName}["description"]`, "string", typedObj["description"]) &&
        evaluate(typeof typedObj["quantity"] === "number", `${argumentName}["quantity"]`, "number", typedObj["quantity"]) &&
        evaluate(typeof typedObj["price"] === "number", `${argumentName}["price"]`, "number", typedObj["price"]) &&
        evaluate(typeof typedObj["discount"] === "number", `${argumentName}["discount"]`, "number", typedObj["discount"]) &&
        evaluate(typeof typedObj["amount"] === "number", `${argumentName}["amount"]`, "number", typedObj["amount"]) &&
        evaluate(typeof typedObj["amountWithVat"] === "number", `${argumentName}["amountWithVat"]`, "number", typedObj["amountWithVat"]) &&
        evaluate(typeof typedObj["discountAmount"] === "number", `${argumentName}["discountAmount"]`, "number", typedObj["discountAmount"]) &&
        evaluate(typeof typedObj["vat"] === "number", `${argumentName}["vat"]`, "number", typedObj["vat"]) &&
        evaluate(typeof typedObj["vat2"] === "number", `${argumentName}["vat2"]`, "number", typedObj["vat2"]) &&
        evaluate(typeof typedObj["retention"] === "number", `${argumentName}["retention"]`, "number", typedObj["retention"]) &&
        evaluate((typeof typedObj["notSubjectToVatReason"] === "undefined" ||
            typedObj["notSubjectToVatReason"] === "OT" ||
            typedObj["notSubjectToVatReason"] === "RL" ||
            typedObj["notSubjectToVatReason"] === "VT" ||
            typedObj["notSubjectToVatReason"] === "IE"), `${argumentName}["notSubjectToVatReason"]`, "import(\"./src/tbai_doc_types\").NotSubjectToVatReason | undefined", typedObj["notSubjectToVatReason"]) &&
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
        evaluate((typeof typedObj["merchandiseOrService"] === "undefined" ||
            typedObj["merchandiseOrService"] === "merchandise" ||
            typedObj["merchandiseOrService"] === "service"), `${argumentName}["merchandiseOrService"]`, "import(\"./src/tbai_doc_types\").MerchandiseOrService | undefined", typedObj["merchandiseOrService"]) &&
        evaluate(typeof typedObj["isUsingSimplifiedRegime"] === "boolean", `${argumentName}["isUsingSimplifiedRegime"]`, "boolean", typedObj["isUsingSimplifiedRegime"]) &&
        evaluate((typedObj["raw"] !== null &&
            typeof typedObj["raw"] === "object" ||
            typeof typedObj["raw"] === "function") &&
            evaluate(typeof typedObj["raw"]["price"] === "number", `${argumentName}["raw"]["price"]`, "number", typedObj["raw"]["price"]) &&
            evaluate(typeof typedObj["raw"]["discount"] === "number", `${argumentName}["raw"]["discount"]`, "number", typedObj["raw"]["discount"]) &&
            evaluate(typeof typedObj["raw"]["amount"] === "number", `${argumentName}["raw"]["amount"]`, "number", typedObj["raw"]["amount"]), `${argumentName}["raw"]`, "{ price: number; discount: number; amount: number; }", typedObj["raw"])
    )
}

export function isVatLineFull(obj: unknown, argumentName: string = "vatLineFull"): obj is VatLineFull {
    const typedObj = obj as VatLineFull
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate(typeof typedObj["rate"] === "number", `${argumentName}["rate"]`, "number", typedObj["rate"]) &&
        evaluate(typeof typedObj["amount"] === "number", `${argumentName}["amount"]`, "number", typedObj["amount"]) &&
        evaluate(typeof typedObj["rate2"] === "number", `${argumentName}["rate2"]`, "number", typedObj["rate2"]) &&
        evaluate(typeof typedObj["amount2"] === "number", `${argumentName}["amount2"]`, "number", typedObj["amount2"]) &&
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
        evaluate(typeof typedObj["isUsingSimplifiedRegime"] === "boolean", `${argumentName}["isUsingSimplifiedRegime"]`, "boolean", typedObj["isUsingSimplifiedRegime"])
    )
}

export function isRetentionLineFull(obj: unknown, argumentName: string = "retentionLineFull"): obj is RetentionLineFull {
    const typedObj = obj as RetentionLineFull
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate(typeof typedObj["rate"] === "number", `${argumentName}["rate"]`, "number", typedObj["rate"]) &&
        evaluate(typeof typedObj["amount"] === "number", `${argumentName}["amount"]`, "number", typedObj["amount"])
    )
}

export function isInvoiceFull(obj: unknown, argumentName: string = "invoiceFull"): obj is InvoiceFull {
    const typedObj = obj as InvoiceFull
    return (
        isInvoice(typedObj) as boolean &&
        evaluate(typeof typedObj["replacesTicket"] === "boolean", `${argumentName}["replacesTicket"]`, "boolean", typedObj["replacesTicket"]) &&
        evaluate(typeof typedObj["simple"] === "boolean", `${argumentName}["simple"]`, "boolean", typedObj["simple"]) &&
        evaluate(Array.isArray(typedObj["vatLines"]) &&
            typedObj["vatLines"].every((e: any) =>
                isVatLineFull(e) as boolean
            ), `${argumentName}["vatLines"]`, "import(\"./src/tbai_doc\").VatLineFull[]", typedObj["vatLines"]) &&
        evaluate(Array.isArray(typedObj["retentionLines"]) &&
            typedObj["retentionLines"].every((e: any) =>
                isRetentionLineFull(e) as boolean
            ), `${argumentName}["retentionLines"]`, "import(\"./src/tbai_doc\").RetentionLineFull[]", typedObj["retentionLines"]) &&
        evaluate(Array.isArray(typedObj["lines"]) &&
            typedObj["lines"].every((e: any) =>
                isInvoiceLineFull(e) as boolean
            ), `${argumentName}["lines"]`, "import(\"./src/tbai_doc\").InvoiceLineFull[]", typedObj["lines"]) &&
        evaluate(typeof typedObj["total"] === "number", `${argumentName}["total"]`, "number", typedObj["total"]) &&
        evaluate(typeof typedObj["retentionAmount"] === "number", `${argumentName}["retentionAmount"]`, "number", typedObj["retentionAmount"]) &&
        evaluate(Array.isArray(typedObj["vatKeys"]) &&
            typedObj["vatKeys"].every((e: any) =>
                isVatKey(e) as boolean
            ), `${argumentName}["vatKeys"]`, "import(\"./src/tbai_doc_types\").VatKey[]", typedObj["vatKeys"])
    )
}

export function isSoftwareIdInfo(obj: unknown, argumentName: string = "softwareIdInfo"): obj is SoftwareIdInfo {
    const typedObj = obj as SoftwareIdInfo
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typedObj["idType"] === "02" ||
            typedObj["idType"] === "03" ||
            typedObj["idType"] === "04" ||
            typedObj["idType"] === "05" ||
            typedObj["idType"] === "06"), `${argumentName}["idType"]`, "import(\"./src/common_doc_types\").IrsIdType", typedObj["idType"]) &&
        evaluate((typedObj["country"] === "LC" ||
            typedObj["country"] === "IE" ||
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
            typedObj["country"] === "SJ"), `${argumentName}["country"]`, "import(\"./src/common_doc_types\").CountryCode", typedObj["country"])
    )
}

export function isSoftware(obj: unknown, argumentName: string = "software"): obj is Software {
    const typedObj = obj as Software
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["license"] === "string", `${argumentName}["license"]`, "string", typedObj["license"]) &&
        evaluate(typeof typedObj["developerIrsId"] === "string", `${argumentName}["developerIrsId"]`, "string", typedObj["developerIrsId"]) &&
        evaluate((typeof typedObj["idInfo"] === "undefined" ||
            isSoftwareIdInfo(typedObj["idInfo"]) as boolean), `${argumentName}["idInfo"]`, "import(\"./src/tbai_doc\").SoftwareIdInfo | undefined", typedObj["idInfo"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(typeof typedObj["version"] === "string", `${argumentName}["version"]`, "string", typedObj["version"])
    )
}

export function isToXmlOptions(obj: unknown, argumentName: string = "toXmlOptions"): obj is ToXmlOptions {
    const typedObj = obj as ToXmlOptions
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typeof typedObj["deviceId"] === "undefined" ||
            typeof typedObj["deviceId"] === "string"), `${argumentName}["deviceId"]`, "string | undefined", typedObj["deviceId"]) &&
        evaluate((typeof typedObj["roundTaxGlobally"] === "undefined" ||
            typedObj["roundTaxGlobally"] === false ||
            typedObj["roundTaxGlobally"] === true), `${argumentName}["roundTaxGlobally"]`, "boolean | undefined", typedObj["roundTaxGlobally"]) &&
        evaluate((typeof typedObj["g5015"] === "undefined" ||
            typeof typedObj["g5015"] === "number"), `${argumentName}["g5015"]`, "number | undefined", typedObj["g5015"]) &&
        evaluate((typeof typedObj["g5016"] === "undefined" ||
            typedObj["g5016"] === false ||
            typedObj["g5016"] === true), `${argumentName}["g5016"]`, "boolean | undefined", typedObj["g5016"]) &&
        evaluate((typeof typedObj["g1177"] === "undefined" ||
            typedObj["g1177"] === false ||
            typedObj["g1177"] === true), `${argumentName}["g1177"]`, "boolean | undefined", typedObj["g1177"])
    )
}
