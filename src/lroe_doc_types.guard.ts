/*
 * Generated type guards for "lroe_doc_types.ts".
 * WARNING: Do not manually change this file.
 */
import { Recipient, IssuerIrs, IssuerOther, Issuer, InvoiceType, PurchaseExpenseType, GoodAffectionType, SimplifiedRegimeType, ConceptType, VatLine, ExpenseVatLine, VatDetail, VatKey, CreditNoteType, Entity, InfoTax, Invoice, CancelInvoice, InvoiceResponseData } from "./lroe_doc_types";
import { isInvoiceId } from "./invoice_id.guard";

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

export function isRecipient(obj: unknown, argumentName: string = "recipient"): obj is Recipient {
    const typedObj = obj as Recipient
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"])
    )
}

export function isIssuerIrs(obj: unknown, argumentName: string = "issuerIrs"): obj is IssuerIrs {
    const typedObj = obj as IssuerIrs
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"]) &&
        evaluate(typeof typedObj["idType"] === "undefined", `${argumentName}["idType"]`, "undefined", typedObj["idType"]) &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"])
    )
}

export function isIssuerOther(obj: unknown, argumentName: string = "issuerOther"): obj is IssuerOther {
    const typedObj = obj as IssuerOther
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
        evaluate((typedObj["country"] === "LC" ||
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
            typedObj["country"] === "IE" ||
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

export function isIssuer(obj: unknown, argumentName: string = "issuer"): obj is Issuer {
    const typedObj = obj as Issuer
    return (
        (isIssuerIrs(typedObj) as boolean ||
            isIssuerOther(typedObj) as boolean)
    )
}

export function isInvoiceType(obj: unknown, argumentName: string = "invoiceType"): obj is InvoiceType {
    const typedObj = obj as InvoiceType
    return (
        (typedObj === "F1" ||
            typedObj === "F2" ||
            typedObj === "F3" ||
            typedObj === "F4" ||
            typedObj === "F5" ||
            typedObj === "F6" ||
            typedObj === "LC")
    )
}

export function isPurchaseExpenseType(obj: unknown, argumentName: string = "purchaseExpenseType"): obj is PurchaseExpenseType {
    const typedObj = obj as PurchaseExpenseType
    return (
        (typedObj === "C" ||
            typedObj === "G" ||
            typedObj === "I")
    )
}

export function isGoodAffectionType(obj: unknown, argumentName: string = "goodAffectionType"): obj is GoodAffectionType {
    const typedObj = obj as GoodAffectionType
    return (
        (typedObj === "I" ||
            typedObj === "R" ||
            typedObj === "N")
    )
}

export function isSimplifiedRegimeType(obj: unknown, argumentName: string = "simplifiedRegimeType"): obj is SimplifiedRegimeType {
    const typedObj = obj as SimplifiedRegimeType
    return (
        (typedObj === "N" ||
            typedObj === "E" ||
            typedObj === "S")
    )
}

export function isConceptType(obj: unknown, argumentName: string = "conceptType"): obj is ConceptType {
    const typedObj = obj as ConceptType
    return (
        (typedObj === "600" ||
            typedObj === "601" ||
            typedObj === "602" ||
            typedObj === "606" ||
            typedObj === "607" ||
            typedObj === "608" ||
            typedObj === "609" ||
            typedObj === "620" ||
            typedObj === "621" ||
            typedObj === "622" ||
            typedObj === "623" ||
            typedObj === "624" ||
            typedObj === "625" ||
            typedObj === "626" ||
            typedObj === "627" ||
            typedObj === "628" ||
            typedObj === "629" ||
            typedObj === "631" ||
            typedObj === "634" ||
            typedObj === "639" ||
            typedObj === "640" ||
            typedObj === "641" ||
            typedObj === "64201" ||
            typedObj === "64202" ||
            typedObj === "643" ||
            typedObj === "644" ||
            typedObj === "649" ||
            typedObj === "65" ||
            typedObj === "66" ||
            typedObj === "67" ||
            typedObj === "680" ||
            typedObj === "681" ||
            typedObj === "682" ||
            typedObj === "69")
    )
}

export function isVatLine(obj: unknown, argumentName: string = "vatLine"): obj is VatLine {
    const typedObj = obj as VatLine
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate((typeof typedObj["rate"] === "undefined" ||
            typeof typedObj["rate"] === "number"), `${argumentName}["rate"]`, "number | undefined", typedObj["rate"]) &&
        evaluate((typeof typedObj["amount"] === "undefined" ||
            typeof typedObj["amount"] === "number"), `${argumentName}["amount"]`, "number | undefined", typedObj["amount"]) &&
        evaluate(isPurchaseExpenseType(typedObj["purchaseExpenseType"]) as boolean, `${argumentName}["purchaseExpenseType"]`, "import(\"./src/lroe_doc_types\").PurchaseExpenseType", typedObj["purchaseExpenseType"]) &&
        evaluate(typeof typedObj["investmentSubjectPassive"] === "boolean", `${argumentName}["investmentSubjectPassive"]`, "boolean", typedObj["investmentSubjectPassive"]) &&
        evaluate((typeof typedObj["deductible"] === "undefined" ||
            typeof typedObj["deductible"] === "number"), `${argumentName}["deductible"]`, "number | undefined", typedObj["deductible"]) &&
        evaluate((typeof typedObj["compensationAmount"] === "undefined" ||
            typeof typedObj["compensationAmount"] === "number"), `${argumentName}["compensationAmount"]`, "number | undefined", typedObj["compensationAmount"]) &&
        evaluate((typeof typedObj["compensationPercent"] === "undefined" ||
            typeof typedObj["compensationPercent"] === "number"), `${argumentName}["compensationPercent"]`, "number | undefined", typedObj["compensationPercent"])
    )
}

export function isExpenseVatLine(obj: unknown, argumentName: string = "expenseVatLine"): obj is ExpenseVatLine {
    const typedObj = obj as ExpenseVatLine
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["epigraph"] === "string", `${argumentName}["epigraph"]`, "string", typedObj["epigraph"]) &&
        evaluate((typeof typedObj["goodAffection"] === "undefined" ||
            typedObj["goodAffection"] === "I" ||
            typedObj["goodAffection"] === "R" ||
            typedObj["goodAffection"] === "N"), `${argumentName}["goodAffection"]`, "import(\"./src/lroe_doc_types\").GoodAffectionType | undefined", typedObj["goodAffection"]) &&
        evaluate((typeof typedObj["concept"] === "undefined" ||
            typedObj["concept"] === "600" ||
            typedObj["concept"] === "601" ||
            typedObj["concept"] === "602" ||
            typedObj["concept"] === "606" ||
            typedObj["concept"] === "607" ||
            typedObj["concept"] === "608" ||
            typedObj["concept"] === "609" ||
            typedObj["concept"] === "620" ||
            typedObj["concept"] === "621" ||
            typedObj["concept"] === "622" ||
            typedObj["concept"] === "623" ||
            typedObj["concept"] === "624" ||
            typedObj["concept"] === "625" ||
            typedObj["concept"] === "626" ||
            typedObj["concept"] === "627" ||
            typedObj["concept"] === "628" ||
            typedObj["concept"] === "629" ||
            typedObj["concept"] === "631" ||
            typedObj["concept"] === "634" ||
            typedObj["concept"] === "639" ||
            typedObj["concept"] === "640" ||
            typedObj["concept"] === "641" ||
            typedObj["concept"] === "64201" ||
            typedObj["concept"] === "64202" ||
            typedObj["concept"] === "643" ||
            typedObj["concept"] === "644" ||
            typedObj["concept"] === "649" ||
            typedObj["concept"] === "65" ||
            typedObj["concept"] === "66" ||
            typedObj["concept"] === "67" ||
            typedObj["concept"] === "680" ||
            typedObj["concept"] === "681" ||
            typedObj["concept"] === "682" ||
            typedObj["concept"] === "69"), `${argumentName}["concept"]`, "import(\"./src/lroe_doc_types\").ConceptType | undefined", typedObj["concept"]) &&
        evaluate((typeof typedObj["reference"] === "undefined" ||
            typeof typedObj["reference"] === "string"), `${argumentName}["reference"]`, "string | undefined", typedObj["reference"]) &&
        evaluate(typeof typedObj["investmentSubjectPassive"] === "boolean", `${argumentName}["investmentSubjectPassive"]`, "boolean", typedObj["investmentSubjectPassive"]) &&
        evaluate((typeof typedObj["isUsingSimplifiedRegime"] === "undefined" ||
            typedObj["isUsingSimplifiedRegime"] === "N" ||
            typedObj["isUsingSimplifiedRegime"] === "E" ||
            typedObj["isUsingSimplifiedRegime"] === "S"), `${argumentName}["isUsingSimplifiedRegime"]`, "import(\"./src/lroe_doc_types\").SimplifiedRegimeType | undefined", typedObj["isUsingSimplifiedRegime"]) &&
        evaluate(typeof typedObj["base"] === "number", `${argumentName}["base"]`, "number", typedObj["base"]) &&
        evaluate((typeof typedObj["rate"] === "undefined" ||
            typeof typedObj["rate"] === "number"), `${argumentName}["rate"]`, "number | undefined", typedObj["rate"]) &&
        evaluate((typeof typedObj["amount"] === "undefined" ||
            typeof typedObj["amount"] === "number"), `${argumentName}["amount"]`, "number | undefined", typedObj["amount"]) &&
        evaluate((typeof typedObj["deductible"] === "undefined" ||
            typeof typedObj["deductible"] === "number"), `${argumentName}["deductible"]`, "number | undefined", typedObj["deductible"]) &&
        evaluate((typeof typedObj["rate2"] === "undefined" ||
            typeof typedObj["rate2"] === "number"), `${argumentName}["rate2"]`, "number | undefined", typedObj["rate2"]) &&
        evaluate((typeof typedObj["amount2"] === "undefined" ||
            typeof typedObj["amount2"] === "number"), `${argumentName}["amount2"]`, "number | undefined", typedObj["amount2"]) &&
        evaluate((typeof typedObj["compensationPercent"] === "undefined" ||
            typeof typedObj["compensationPercent"] === "number"), `${argumentName}["compensationPercent"]`, "number | undefined", typedObj["compensationPercent"]) &&
        evaluate((typeof typedObj["compensationAmount"] === "undefined" ||
            typeof typedObj["compensationAmount"] === "number"), `${argumentName}["compensationAmount"]`, "number | undefined", typedObj["compensationAmount"]) &&
        evaluate((typeof typedObj["expense"] === "undefined" ||
            typeof typedObj["expense"] === "number"), `${argumentName}["expense"]`, "number | undefined", typedObj["expense"]) &&
        evaluate((typeof typedObj["criteria"] === "undefined" ||
            typedObj["criteria"] === false ||
            typedObj["criteria"] === true), `${argumentName}["criteria"]`, "boolean | undefined", typedObj["criteria"])
    )
}

export function isVatDetail(obj: unknown, argumentName: string = "vatDetail"): obj is VatDetail {
    const typedObj = obj as VatDetail
    return (
        (isVatLine(typedObj) as boolean ||
            isExpenseVatLine(typedObj) as boolean)
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
            typedObj === "12" ||
            typedObj === "13")
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

export function isEntity(obj: unknown, argumentName: string = "entity"): obj is Entity {
    const typedObj = obj as Entity
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(typeof typedObj["irsId"] === "string", `${argumentName}["irsId"]`, "string", typedObj["irsId"])
    )
}

export function isInfoTax(obj: unknown, argumentName: string = "infoTax"): obj is InfoTax {
    const typedObj = obj as InfoTax
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typeof typedObj["date"] === "undefined" ||
            typedObj["date"] instanceof Date), `${argumentName}["date"]`, "Date | undefined", typedObj["date"]) &&
        evaluate((typeof typedObj["regNum"] === "undefined" ||
            typeof typedObj["regNum"] === "string"), `${argumentName}["regNum"]`, "string | undefined", typedObj["regNum"]) &&
        evaluate((typeof typedObj["externalRef"] === "undefined" ||
            typeof typedObj["externalRef"] === "string"), `${argumentName}["externalRef"]`, "string | undefined", typedObj["externalRef"]) &&
        evaluate((typeof typedObj["successedEntity"] === "undefined" ||
            isEntity(typedObj["successedEntity"]) as boolean), `${argumentName}["successedEntity"]`, "import(\"./src/lroe_doc_types\").Entity | undefined", typedObj["successedEntity"])
    )
}

export function isInvoice(obj: unknown, argumentName: string = "invoice"): obj is Invoice {
    const typedObj = obj as Invoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isRecipient(typedObj["recipient"]) as boolean, `${argumentName}["recipient"]`, "import(\"./src/lroe_doc_types\").Recipient", typedObj["recipient"]) &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/lroe_doc_types\").Issuer", typedObj["issuer"]) &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/invoice_id\").InvoiceId", typedObj["id"]) &&
        evaluate((typeof typedObj["endNumber"] === "undefined" ||
            typeof typedObj["endNumber"] === "string"), `${argumentName}["endNumber"]`, "string | undefined", typedObj["endNumber"]) &&
        evaluate(isInvoiceType(typedObj["type"]) as boolean, `${argumentName}["type"]`, "import(\"./src/lroe_doc_types\").InvoiceType", typedObj["type"]) &&
        evaluate(typeof typedObj["description"] === "string", `${argumentName}["description"]`, "string", typedObj["description"]) &&
        evaluate((typeof typedObj["operationDate"] === "undefined" ||
            typedObj["operationDate"] instanceof Date), `${argumentName}["operationDate"]`, "Date | undefined", typedObj["operationDate"]) &&
        evaluate(typedObj["receptionDate"] instanceof Date, `${argumentName}["receptionDate"]`, "Date", typedObj["receptionDate"]) &&
        evaluate(Array.isArray(typedObj["vatLines"]) &&
            typedObj["vatLines"].every((e: any) =>
                isVatDetail(e) as boolean
            ), `${argumentName}["vatLines"]`, "import(\"./src/lroe_doc_types\").VatDetail[]", typedObj["vatLines"]) &&
        evaluate(typeof typedObj["total"] === "number", `${argumentName}["total"]`, "number", typedObj["total"]) &&
        evaluate((typeof typedObj["baseCost"] === "undefined" ||
            typeof typedObj["baseCost"] === "number"), `${argumentName}["baseCost"]`, "number | undefined", typedObj["baseCost"]) &&
        evaluate(Array.isArray(typedObj["vatKeys"]) &&
            typedObj["vatKeys"].every((e: any) =>
                isVatKey(e) as boolean
            ), `${argumentName}["vatKeys"]`, "import(\"./src/lroe_doc_types\").VatKey[]", typedObj["vatKeys"]) &&
        evaluate((typeof typedObj["replacesTicket"] === "undefined" ||
            typedObj["replacesTicket"] === false ||
            typedObj["replacesTicket"] === true), `${argumentName}["replacesTicket"]`, "boolean | undefined", typedObj["replacesTicket"]) &&
        evaluate((typeof typedObj["replacedTicketIds"] === "undefined" ||
            Array.isArray(typedObj["replacedTicketIds"]) &&
            typedObj["replacedTicketIds"].every((e: any) =>
                isInvoiceId(e) as boolean
            )), `${argumentName}["replacedTicketIds"]`, "import(\"./src/invoice_id\").InvoiceId[] | undefined", typedObj["replacedTicketIds"]) &&
        evaluate((typeof typedObj["creditNote"] === "undefined" ||
            isCreditNoteType(typedObj["creditNote"]) as boolean), `${argumentName}["creditNote"]`, "import(\"./src/lroe_doc_types\").CreditNoteType | undefined", typedObj["creditNote"]) &&
        evaluate((typeof typedObj["otherInfoTax"] === "undefined" ||
            isInfoTax(typedObj["otherInfoTax"]) as boolean), `${argumentName}["otherInfoTax"]`, "import(\"./src/lroe_doc_types\").InfoTax | undefined", typedObj["otherInfoTax"])
    )
}

export function isCancelInvoice(obj: unknown, argumentName: string = "cancelInvoice"): obj is CancelInvoice {
    const typedObj = obj as CancelInvoice
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isInvoiceId(typedObj["id"]) as boolean, `${argumentName}["id"]`, "import(\"./src/invoice_id\").InvoiceId", typedObj["id"]) &&
        evaluate(isIssuer(typedObj["issuer"]) as boolean, `${argumentName}["issuer"]`, "import(\"./src/lroe_doc_types\").Issuer", typedObj["issuer"])
    )
}

export function isInvoiceResponseData(obj: unknown, argumentName: string = "invoiceResponseData"): obj is InvoiceResponseData {
    const typedObj = obj as InvoiceResponseData
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["lroeXml"] === "string", `${argumentName}["lroeXml"]`, "string", typedObj["lroeXml"]) &&
        evaluate(typeof typedObj["queueId"] === "number", `${argumentName}["queueId"]`, "number", typedObj["queueId"])
    )
}
