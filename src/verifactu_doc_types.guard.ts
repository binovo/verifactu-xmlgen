/*
 * Generated type guards for "verifactu_doc_types.ts".
 * WARNING: Do not manually change this file.
 */
import { CountryCode, IrsIdType, Issuer, PartnerIrs, PartnerOther, Partner, VatExemptReason, VatType, VatKey, VatLine, InvoiceDescription, InvoiceDescriptionJson, InvoiceType, CreditNoteType, IssuedType, IssuedBy, InvoiceIdJson, InvoiceId, PreviousInvoiceIdJson, PreviousInvoiceId, Invoice, CancelInvoice, InvoiceVerifactuData } from "./verifactu_doc_types";

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

export function isCountryCode(obj: unknown, argumentName: string = "countryCode"): obj is CountryCode {
    const typedObj = obj as CountryCode
    return (
        (typedObj === "AF" ||
            typedObj === "AL" ||
            typedObj === "DE" ||
            typedObj === "AD" ||
            typedObj === "AO" ||
            typedObj === "AI" ||
            typedObj === "AQ" ||
            typedObj === "AG" ||
            typedObj === "SA" ||
            typedObj === "DZ" ||
            typedObj === "AR" ||
            typedObj === "AM" ||
            typedObj === "AW" ||
            typedObj === "AU" ||
            typedObj === "AT" ||
            typedObj === "AZ" ||
            typedObj === "BS" ||
            typedObj === "BH" ||
            typedObj === "BD" ||
            typedObj === "BB" ||
            typedObj === "BE" ||
            typedObj === "BZ" ||
            typedObj === "BJ" ||
            typedObj === "BM" ||
            typedObj === "BY" ||
            typedObj === "BO" ||
            typedObj === "BA" ||
            typedObj === "BW" ||
            typedObj === "BV" ||
            typedObj === "BR" ||
            typedObj === "BN" ||
            typedObj === "BG" ||
            typedObj === "BF" ||
            typedObj === "BI" ||
            typedObj === "BT" ||
            typedObj === "CV" ||
            typedObj === "KY" ||
            typedObj === "KH" ||
            typedObj === "CM" ||
            typedObj === "CA" ||
            typedObj === "CF" ||
            typedObj === "CC" ||
            typedObj === "CO" ||
            typedObj === "KM" ||
            typedObj === "CG" ||
            typedObj === "CD" ||
            typedObj === "CK" ||
            typedObj === "KP" ||
            typedObj === "KR" ||
            typedObj === "CI" ||
            typedObj === "CR" ||
            typedObj === "HR" ||
            typedObj === "CU" ||
            typedObj === "TD" ||
            typedObj === "CZ" ||
            typedObj === "CL" ||
            typedObj === "CN" ||
            typedObj === "CY" ||
            typedObj === "CW" ||
            typedObj === "DK" ||
            typedObj === "DM" ||
            typedObj === "DO" ||
            typedObj === "EC" ||
            typedObj === "EG" ||
            typedObj === "AE" ||
            typedObj === "ER" ||
            typedObj === "SK" ||
            typedObj === "SI" ||
            typedObj === "ES" ||
            typedObj === "US" ||
            typedObj === "EE" ||
            typedObj === "ET" ||
            typedObj === "FO" ||
            typedObj === "PH" ||
            typedObj === "FI" ||
            typedObj === "FJ" ||
            typedObj === "FR" ||
            typedObj === "GA" ||
            typedObj === "GM" ||
            typedObj === "GE" ||
            typedObj === "GS" ||
            typedObj === "GH" ||
            typedObj === "GI" ||
            typedObj === "GD" ||
            typedObj === "GR" ||
            typedObj === "GL" ||
            typedObj === "GU" ||
            typedObj === "GT" ||
            typedObj === "GG" ||
            typedObj === "GN" ||
            typedObj === "GQ" ||
            typedObj === "GW" ||
            typedObj === "GY" ||
            typedObj === "HT" ||
            typedObj === "HM" ||
            typedObj === "HN" ||
            typedObj === "HK" ||
            typedObj === "HU" ||
            typedObj === "IN" ||
            typedObj === "ID" ||
            typedObj === "IR" ||
            typedObj === "IQ" ||
            typedObj === "IE" ||
            typedObj === "IM" ||
            typedObj === "IS" ||
            typedObj === "IL" ||
            typedObj === "IT" ||
            typedObj === "JM" ||
            typedObj === "JP" ||
            typedObj === "JE" ||
            typedObj === "JO" ||
            typedObj === "KZ" ||
            typedObj === "KE" ||
            typedObj === "KG" ||
            typedObj === "KI" ||
            typedObj === "KW" ||
            typedObj === "LA" ||
            typedObj === "LS" ||
            typedObj === "LV" ||
            typedObj === "LB" ||
            typedObj === "LR" ||
            typedObj === "LY" ||
            typedObj === "LI" ||
            typedObj === "LT" ||
            typedObj === "LU" ||
            typedObj === "XG" ||
            typedObj === "MO" ||
            typedObj === "MK" ||
            typedObj === "MG" ||
            typedObj === "MY" ||
            typedObj === "MW" ||
            typedObj === "MV" ||
            typedObj === "ML" ||
            typedObj === "MT" ||
            typedObj === "FK" ||
            typedObj === "MP" ||
            typedObj === "MA" ||
            typedObj === "MH" ||
            typedObj === "MU" ||
            typedObj === "MR" ||
            typedObj === "YT" ||
            typedObj === "UM" ||
            typedObj === "MX" ||
            typedObj === "FM" ||
            typedObj === "MD" ||
            typedObj === "MC" ||
            typedObj === "MN" ||
            typedObj === "ME" ||
            typedObj === "MS" ||
            typedObj === "MZ" ||
            typedObj === "MM" ||
            typedObj === "NA" ||
            typedObj === "NR" ||
            typedObj === "CX" ||
            typedObj === "NP" ||
            typedObj === "NI" ||
            typedObj === "NE" ||
            typedObj === "NG" ||
            typedObj === "NU" ||
            typedObj === "NF" ||
            typedObj === "NO" ||
            typedObj === "NC" ||
            typedObj === "NZ" ||
            typedObj === "IO" ||
            typedObj === "OM" ||
            typedObj === "NL" ||
            typedObj === "BQ" ||
            typedObj === "PK" ||
            typedObj === "PW" ||
            typedObj === "PA" ||
            typedObj === "PG" ||
            typedObj === "PY" ||
            typedObj === "PE" ||
            typedObj === "PN" ||
            typedObj === "PF" ||
            typedObj === "PL" ||
            typedObj === "PT" ||
            typedObj === "PR" ||
            typedObj === "QA" ||
            typedObj === "GB" ||
            typedObj === "RW" ||
            typedObj === "RO" ||
            typedObj === "RU" ||
            typedObj === "SB" ||
            typedObj === "SV" ||
            typedObj === "WS" ||
            typedObj === "AS" ||
            typedObj === "KN" ||
            typedObj === "SM" ||
            typedObj === "SX" ||
            typedObj === "PM" ||
            typedObj === "VC" ||
            typedObj === "SH" ||
            typedObj === "LC" ||
            typedObj === "ST" ||
            typedObj === "SN" ||
            typedObj === "RS" ||
            typedObj === "SC" ||
            typedObj === "SL" ||
            typedObj === "SG" ||
            typedObj === "SY" ||
            typedObj === "SO" ||
            typedObj === "LK" ||
            typedObj === "SZ" ||
            typedObj === "ZA" ||
            typedObj === "SD" ||
            typedObj === "SS" ||
            typedObj === "SE" ||
            typedObj === "CH" ||
            typedObj === "SR" ||
            typedObj === "TH" ||
            typedObj === "TW" ||
            typedObj === "TZ" ||
            typedObj === "TJ" ||
            typedObj === "PS" ||
            typedObj === "TF" ||
            typedObj === "TL" ||
            typedObj === "TG" ||
            typedObj === "TK" ||
            typedObj === "TO" ||
            typedObj === "TT" ||
            typedObj === "TN" ||
            typedObj === "TC" ||
            typedObj === "TM" ||
            typedObj === "TR" ||
            typedObj === "TV" ||
            typedObj === "UA" ||
            typedObj === "UG" ||
            typedObj === "UY" ||
            typedObj === "UZ" ||
            typedObj === "VU" ||
            typedObj === "VA" ||
            typedObj === "VE" ||
            typedObj === "VN" ||
            typedObj === "VG" ||
            typedObj === "VI" ||
            typedObj === "WF" ||
            typedObj === "YE" ||
            typedObj === "DJ" ||
            typedObj === "ZM" ||
            typedObj === "ZW" ||
            typedObj === "QU" ||
            typedObj === "XB" ||
            typedObj === "XU" ||
            typedObj === "XN" ||
            typedObj === "AX" ||
            typedObj === "BL" ||
            typedObj === "EH" ||
            typedObj === "GF" ||
            typedObj === "GP" ||
            typedObj === "MF" ||
            typedObj === "MQ" ||
            typedObj === "RE" ||
            typedObj === "SJ")
    )
}

export function isIrsIdType(obj: unknown, argumentName: string = "irsIdType"): obj is IrsIdType {
    const typedObj = obj as IrsIdType
    return (
        (typedObj === "02" ||
            typedObj === "03" ||
            typedObj === "04" ||
            typedObj === "05" ||
            typedObj === "06" ||
            typedObj === "07")
    )
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

export function isPartnerIrs(obj: unknown, argumentName: string = "partnerIrs"): obj is PartnerIrs {
    const typedObj = obj as PartnerIrs
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"]) &&
        evaluate(typeof typedObj["idType"] === "undefined", `${argumentName}["idType"]`, "undefined", typedObj["idType"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(isCountryCode(typedObj["country"]) as boolean, `${argumentName}["country"]`, "import(\"./src/verifactu_doc_types\").CountryCode", typedObj["country"])
    )
}

export function isPartnerOther(obj: unknown, argumentName: string = "partnerOther"): obj is PartnerOther {
    const typedObj = obj as PartnerOther
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["id"] === "string", `${argumentName}["id"]`, "string", typedObj["id"]) &&
        evaluate(isIrsIdType(typedObj["idType"]) as boolean, `${argumentName}["idType"]`, "import(\"./src/verifactu_doc_types\").IrsIdType", typedObj["idType"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(isCountryCode(typedObj["country"]) as boolean, `${argumentName}["country"]`, "import(\"./src/verifactu_doc_types\").CountryCode", typedObj["country"])
    )
}

export function isPartner(obj: unknown, argumentName: string = "partner"): obj is Partner {
    const typedObj = obj as Partner
    return (
        (isPartnerIrs(typedObj) as boolean ||
            isPartnerOther(typedObj) as boolean)
    )
}

export function isVatExemptReason(obj: unknown, argumentName: string = "vatExemptReason"): obj is VatExemptReason {
    const typedObj = obj as VatExemptReason
    return (
        (typedObj === "E0" ||
            typedObj === "E1" ||
            typedObj === "E2" ||
            typedObj === "E3" ||
            typedObj === "E4" ||
            typedObj === "E5" ||
            typedObj === "E6")
    )
}

export function isVatType(obj: unknown, argumentName: string = "vatType"): obj is VatType {
    const typedObj = obj as VatType
    return (
        (typedObj === "S1" ||
            typedObj === "S2" ||
            typedObj === "N1" ||
            typedObj === "N2")
    )
}

export function isVatKey(obj: unknown, argumentName: string = "vatKey"): obj is VatKey {
    const typedObj = obj as VatKey
    return (
        (typedObj === "02" ||
            typedObj === "03" ||
            typedObj === "04" ||
            typedObj === "05" ||
            typedObj === "06" ||
            typedObj === "07" ||
            typedObj === "01" ||
            typedObj === "08" ||
            typedObj === "09" ||
            typedObj === "10" ||
            typedObj === "11" ||
            typedObj === "14" ||
            typedObj === "15" ||
            typedObj === "17" ||
            typedObj === "18" ||
            typedObj === "19" ||
            typedObj === "20")
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
        evaluate((typedObj["vatOperation"] === "E0" ||
            typedObj["vatOperation"] === "E1" ||
            typedObj["vatOperation"] === "E2" ||
            typedObj["vatOperation"] === "E3" ||
            typedObj["vatOperation"] === "E4" ||
            typedObj["vatOperation"] === "E5" ||
            typedObj["vatOperation"] === "E6" ||
            typedObj["vatOperation"] === "S1" ||
            typedObj["vatOperation"] === "S2" ||
            typedObj["vatOperation"] === "N1" ||
            typedObj["vatOperation"] === "N2"), `${argumentName}["vatOperation"]`, "import(\"./src/verifactu_doc_types\").VatExemptReason | import(\"/home/bittor/BINOVO/git/tbai-lib/submodules/verifactu-lib/src/verifactu_doc_types\").VatType", typedObj["vatOperation"]) &&
        evaluate(isVatKey(typedObj["vatKey"]) as boolean, `${argumentName}["vatKey"]`, "import(\"./src/verifactu_doc_types\").VatKey", typedObj["vatKey"]) &&
        evaluate((typeof typedObj["isUsingSimplifiedRegime"] === "undefined" ||
            typedObj["isUsingSimplifiedRegime"] === false ||
            typedObj["isUsingSimplifiedRegime"] === true), `${argumentName}["isUsingSimplifiedRegime"]`, "boolean | undefined", typedObj["isUsingSimplifiedRegime"])
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

export function isInvoiceType(obj: unknown, argumentName: string = "invoiceType"): obj is InvoiceType {
    const typedObj = obj as InvoiceType
    return (
        (typedObj === "F1" ||
            typedObj === "F2" ||
            typedObj === "F3" ||
            typedObj === "R1" ||
            typedObj === "R2" ||
            typedObj === "R3" ||
            typedObj === "R4" ||
            typedObj === "R5")
    )
}

export function isCreditNoteType(obj: unknown, argumentName: string = "creditNoteType"): obj is CreditNoteType {
    const typedObj = obj as CreditNoteType
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typedObj["style"] === "I" ||
            typedObj["style"] === "S"), `${argumentName}["style"]`, "\"I\" | \"S\"", typedObj["style"]) &&
        evaluate(Array.isArray(typedObj["ids"]) &&
            typedObj["ids"].every((e: any) =>
                isInvoiceId(e) as boolean
            ), `${argumentName}["ids"]`, "import(\"./src/verifactu_doc_types\").InvoiceId[]", typedObj["ids"]) &&
        evaluate((typeof typedObj["creditBase"] === "undefined" ||
            typeof typedObj["creditBase"] === "number"), `${argumentName}["creditBase"]`, "number | undefined", typedObj["creditBase"]) &&
        evaluate((typeof typedObj["creditVat"] === "undefined" ||
            typeof typedObj["creditVat"] === "number"), `${argumentName}["creditVat"]`, "number | undefined", typedObj["creditVat"]) &&
        evaluate((typeof typedObj["creditRecharge"] === "undefined" ||
            typeof typedObj["creditRecharge"] === "number"), `${argumentName}["creditRecharge"]`, "number | undefined", typedObj["creditRecharge"])
    )
}

export function isIssuedType(obj: unknown, argumentName: string = "issuedType"): obj is IssuedType {
    const typedObj = obj as IssuedType
    return (
        (typedObj === "T" ||
            typedObj === "D")
    )
}

export function isIssuedBy(obj: unknown, argumentName: string = "issuedBy"): obj is IssuedBy {
    const typedObj = obj as IssuedBy
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isIssuedType(typedObj["type"]) as boolean, `${argumentName}["type"]`, "import(\"./src/verifactu_doc_types\").IssuedType", typedObj["type"]) &&
        evaluate((typeof typedObj["issuer"] === "undefined" ||
            isPartnerIrs(typedObj["issuer"]) as boolean ||
            isPartnerOther(typedObj["issuer"]) as boolean), `${argumentName}["issuer"]`, "import(\"./src/verifactu_doc_types\").Partner | undefined", typedObj["issuer"])
    )
}

export function isInvoiceIdJson(obj: unknown, argumentName: string = "invoiceIdJson"): obj is InvoiceIdJson {
    const typedObj = obj as InvoiceIdJson
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["number"] === "string", `${argumentName}["number"]`, "string", typedObj["number"]) &&
        evaluate((typeof typedObj["issuedTime"] === "string" ||
            typedObj["issuedTime"] instanceof Date), `${argumentName}["issuedTime"]`, "string | Date", typedObj["issuedTime"])
    )
}

export function isInvoiceId(obj: unknown, argumentName: string = "invoiceId"): obj is InvoiceId {
    const typedObj = obj as InvoiceId
    return (
        isInvoiceIdJson(typedObj) as boolean &&
        evaluate(typedObj["issuedTime"] instanceof Date, `${argumentName}["issuedTime"]`, "Date", typedObj["issuedTime"])
    )
}

export function isPreviousInvoiceIdJson(obj: unknown, argumentName: string = "previousInvoiceIdJson"): obj is PreviousInvoiceIdJson {
    const typedObj = obj as PreviousInvoiceIdJson
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["issuerIrsId"] === "string", `${argumentName}["issuerIrsId"]`, "string", typedObj["issuerIrsId"]) &&
        evaluate(typeof typedObj["number"] === "string", `${argumentName}["number"]`, "string", typedObj["number"]) &&
        evaluate((typeof typedObj["issuedTime"] === "string" ||
            typedObj["issuedTime"] instanceof Date), `${argumentName}["issuedTime"]`, "string | Date", typedObj["issuedTime"]) &&
        evaluate(typeof typedObj["hash"] === "string", `${argumentName}["hash"]`, "string", typedObj["hash"])
    )
}

export function isPreviousInvoiceId(obj: unknown, argumentName: string = "previousInvoiceId"): obj is PreviousInvoiceId {
    const typedObj = obj as PreviousInvoiceId
    return (
        isPreviousInvoiceIdJson(typedObj) as boolean &&
        evaluate(typedObj["issuedTime"] instanceof Date, `${argumentName}["issuedTime"]`, "Date", typedObj["issuedTime"])
    )
}

export function isInvoice(obj: unknown, argumentName: string = "invoice"): obj is Invoice {
    const typedObj = obj as Invoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/verifactu_doc_types\").Issuer", typedObj["issuer"]) &&
        evaluate((typeof typedObj["recipient"] === "undefined" ||
            isPartnerIrs(typedObj["recipient"]) as boolean ||
            isPartnerOther(typedObj["recipient"]) as boolean), `${argumentName}["recipient"]`, "import(\"./src/verifactu_doc_types\").Partner | undefined", typedObj["recipient"]) &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/verifactu_doc_types\").InvoiceId", typedObj["id"]) &&
        evaluate(isInvoiceType(typedObj["type"]) as boolean, `${argumentName}["type"]`, "import(\"./src/verifactu_doc_types\").InvoiceType", typedObj["type"]) &&
        evaluate((typeof typedObj["replacesTicket"] === "undefined" ||
            typedObj["replacesTicket"] === false ||
            typedObj["replacesTicket"] === true), `${argumentName}["replacesTicket"]`, "boolean | undefined", typedObj["replacesTicket"]) &&
        evaluate((typeof typedObj["replacedTicketIds"] === "undefined" ||
            Array.isArray(typedObj["replacedTicketIds"]) &&
            typedObj["replacedTicketIds"].every((e: any) =>
                isInvoiceId(e) as boolean
            )), `${argumentName}["replacedTicketIds"]`, "import(\"./src/verifactu_doc_types\").InvoiceId[] | undefined", typedObj["replacedTicketIds"]) &&
        evaluate((typeof typedObj["creditNote"] === "undefined" ||
            isCreditNoteType(typedObj["creditNote"]) as boolean), `${argumentName}["creditNote"]`, "import(\"./src/verifactu_doc_types\").CreditNoteType | undefined", typedObj["creditNote"]) &&
        evaluate((typeof typedObj["simple"] === "undefined" ||
            typedObj["simple"] === false ||
            typedObj["simple"] === true), `${argumentName}["simple"]`, "boolean | undefined", typedObj["simple"]) &&
        evaluate((typeof typedObj["description"] === "undefined" ||
            isInvoiceDescription(typedObj["description"]) as boolean), `${argumentName}["description"]`, "import(\"./src/verifactu_doc_types\").InvoiceDescription | undefined", typedObj["description"]) &&
        evaluate(Array.isArray(typedObj["vatLines"]) &&
            typedObj["vatLines"].every((e: any) =>
                isVatLine(e) as boolean
            ), `${argumentName}["vatLines"]`, "import(\"./src/verifactu_doc_types\").VatLine[]", typedObj["vatLines"]) &&
        evaluate(typeof typedObj["amount"] === "number", `${argumentName}["amount"]`, "number", typedObj["amount"]) &&
        evaluate(typeof typedObj["total"] === "number", `${argumentName}["total"]`, "number", typedObj["total"]) &&
        evaluate((typeof typedObj["issuedBy"] === "undefined" ||
            isIssuedBy(typedObj["issuedBy"]) as boolean), `${argumentName}["issuedBy"]`, "import(\"./src/verifactu_doc_types\").IssuedBy | undefined", typedObj["issuedBy"])
    )
}

export function isCancelInvoice(obj: unknown, argumentName: string = "cancelInvoice"): obj is CancelInvoice {
    const typedObj = obj as CancelInvoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/verifactu_doc_types\").InvoiceId", typedObj["id"]) &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/verifactu_doc_types\").Issuer", typedObj["issuer"]) &&
        evaluate((typeof typedObj["issuedBy"] === "undefined" ||
            isIssuedBy(typedObj["issuedBy"]) as boolean), `${argumentName}["issuedBy"]`, "import(\"./src/verifactu_doc_types\").IssuedBy | undefined", typedObj["issuedBy"])
    )
}

export function isInvoiceVerifactuData(obj: unknown, argumentName: string = "invoiceVerifactuData"): obj is InvoiceVerifactuData {
    const typedObj = obj as InvoiceVerifactuData
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["qrcode"] === "string", `${argumentName}["qrcode"]`, "string", typedObj["qrcode"]) &&
        evaluate(isPreviousInvoiceId(typedObj["chainInfo"]) as boolean, `${argumentName}["chainInfo"]`, "import(\"./src/verifactu_doc_types\").PreviousInvoiceId", typedObj["chainInfo"]) &&
        evaluate(typeof typedObj["verifactuXml"] === "string", `${argumentName}["verifactuXml"]`, "string", typedObj["verifactuXml"])
    )
}
