export class TbaiError extends Error {
    code: number | string;

    /**
     * Constructs the TbaiError class
     * @param {String} message human-readable description of the error
     * @param {String} code an id string representing the error
     * @constructor
     */
    constructor(message: string, code?: number | string) {
        super(message);
        Object.setPrototypeOf(this, TbaiError.prototype);
        this.name = this.constructor.name;
        this.code = code ? code : "";
    }
}

export enum TbaiErrorCodes {
    ERR_ISSUER = 1000,
    ERR_RECIPIENT_NO_SIMPLE = 1001,
    ERR_RECIPIENT_NO_R5_REASON = 1002,
    ERR_RECIPIENT_REPLACE_TICKET = 1003,
    ERR_RECIPIENT_TS2 = 1004,
    ERR_RECIPIENT_SURCHARGE = 1005,
    ERR_RECIPIENT_NO_ADDRESS = 1007,
    ERR_RECIPIENT_NIF_NUMBER = 1008,
    ERR_RECIPIENT_VAT_NUMBER = 1009,
    ERR_RECIPIENT_COUNTRY_VAT_NUMBER = 1010,
    ERR_RECIPIENT_ES_T03 = 1011,
    ERR_HEADER_NUMBER_EXP_DATE = 1013,
    ERR_HEADER_SERIAL = 1014,
    ERR_HEADER_ISSUED_TIME_FUTURE = 1015,
    ERR_HEADER_SIMPLE_EXCEEDED = 1016,
    ERR_HEADER_SERIAL_CREDIT_NOTE = 1017,
    ERR_HEADER_CREDIT_NOTE_TS = 1018,
    ERR_HEADER_MISSING_REPLACES = 1019,
    ERR_HEADER_100_REPLACES_MAX = 1020,
    ERR_HEADER_REPLACE_SERIAL = 1021,
    ERR_HEADER_MISSING_CREDIT_NOTES = 1022,
    ERR_HEADER_100_RECTIFIED_MAX = 1023,
    ERR_VAT_KEY_3_MAX = 1024,
    ERR_VAT_KEY_1_MAX = 1025,
    ERR_VAT_KEYS_INCOMPATIBLE = 1026,
    ERR_DATA_SUM_VAT_LINES_TOTAL = 1027,
    ERR_DATA_SUM_VAT_LINES_DETAILS = 1028,
    ERR_DATA_RETENTION_28_PERCENT = 1029,
    ERR_DATA_SUM_LINES_TOTAL = 1030,
    ERR_DATA_SERVICE_E5_REASON = 1031,
    ERR_DATA_VAT_KEY_01_E2_E3 = 1032,
    ERR_DATA_TAX_RATE = 1033,
    ERR_DATA_INVALID_SURCHARGE_TAX_RATE = 1034,
    ERR_DATA_INCOMPATIBLE_SURCHARGE_TAX_RATE = 1035,
    ERR_OP_DATE_FUTURE = 1036,
    ERR_OP_DATE_NO_AFTER_ISSUE = 1037,
    ERR_RATE_REQUIRED_LINES = 1038,
    ERR_AMOUNT_REQUIRED_LINES = 1039,
    ERR_AMOUNT_BASE_SIGN_LINES = 1040,
    ERR_VAT_KEY_03_09_BASE_0 = 1041,
    ERR_VAT_KEY_03_09_BASE_NO_0 = 1042,
    ERR_RATE_REQUIRED_VAT_LINE = 1043,
    ERR_AMOUNT2_BASE_SIGN_LINES = 1044,
    ERR_SIMPLE_NO_EXEMPTED_LINES = 1045,
    ERR_RATE_0_LINES_REQUIRED = 1046,
    ERR_AMOUNT_0_LINES_REQUIRED = 1047,
    ERR_RATE2_0_LINES_REQUIRED = 1048,
    ERR_AMOUNT2_0_LINES_REQUIRED = 1049,
    ERR_NOT_EXEMPTION_TYPE = 1050,
    ERR_VAT_KEY_02_ONE_EXEMPT = 1052,
    ERR_VAT_KEY_02_SUBJECT_EXEMPT = 1053,
    ERR_VAT_KEY_03_04_07_SUBJECT_VAT_LINES = 1054,
    ERR_VAT_KEY_04_VAT_TS2 = 1055,
    ERR_VAT_KEY_07_NO_VAT_TS2 = 1056,
    ERR_VAT_KEY_07_EXEMPT_REASON = 1057,
    ERR_VAT_KEY_08_ONLY_RL = 1058,
    ERR_VAT_KEY_08_ONLY_NOT_SUBJECT = 1059,
    ERR_VAT_KEY_10_ONLY_OT = 1060,
    ERR_VAT_KEY_11_12_13_ONLY_21_PERCENT = 1061,
    ERR_OP_DATE_AFTER_ISSUE = 1062,
    ERR_VAT_KEY_14_START_PQSV = 1063,
    ERR_VAT_KEY_17_ISSUED_JULY_2021 = 1064,
    ERR_VAT_KEY_17_OP_JULY_2021 = 1065,
    ERR_SIMPLIFIED_VAT_KEY_51_52 = 1066,
    ERR_VAT_KEY_51_NO_2_AMOUNT_RATE = 1067,
    ERR_VAT_KEY_51_INV_SIMPLIFIED = 1068,
    ERR_VAT_KEY_52_INV_SIMPLIFIED = 1069,
    ERR_VAT_KEY_53_NO_SUBJECT_OT = 1070,
    ERR_NO_SIMPLE_WITH_VAT_LINES = 1071,
    ERR_1_EURO_EXCEEDED_AMOUNT_LINES = 1072,
    ERR_10_EURO_EXCEEDED_AMOUNT_LINES = 1073,
    ERR_1_EURO_EXCEEDED_AMOUNT2_LINES = 1074,
    ERR_10_EURO_EXCEEDED_AMOUNT2_LINES = 1075,
    ERR_GIPUZKOA_LINES_REQUIRED = 1076,
    ERR_SOFTWARE_DATA = 1077,
    ERR_LINE_WITHOUT_AMOUNT_VAT = 1078,
    ERR_LINE_WITHOUT_VAT = 1079,
    ERR_VAT_NOT_FOUND = 1080,
    ERR_MISSING_DESTINATARIOS = 1081,
    ERR_MISSING_CABECERA_FACTURA = 1082,
    ERR_MISSING_FACTURA_RECTIFICATIVA = 1083,
    ERR_NOT_SUBJECT_TO_VAT_REQUIRED = 1084,
    ERR_EXEMPTION_REASON_REQUIRED = 1085,
    ERR_EXEMPTED_VAT_MAX = 1086,
    ERR_NOT_EXEMPTED_VAT_MAX = 1087,
    ERR_NOT_SUBJECT_TO_VAT_MAX = 1088,
    ERR_MERCH_SERVICE_VAT_LINES = 1089,
    ERR_LINES_OR_DESC_VAT_DETAILS = 1090,
    ERR_RETENTION_AMOUNT_RATES = 1091,
    ERR_MERCH_SERVICE_FOREIGNERS = 1092,
    ERR_TIPO_DESGLOSE_REQUIRED = 1093,
    ERR_1000_LINE_MAX = 1094,
    ERR_MISSING_DETALLES_FACTURA = 1095,
    ERR_MISSING_CLAVES = 1096,
    ERR_SIGNER_P12_PASSWD_ALIAS = 1097,
    ERR_SIGNER_P12_NO_CERT_BAG = 1098,
    ERR_SIGNER_P12_NO_KEY_BAG = 1099,
    ERR_SIGNER_P12_NO_CERT_KEY = 1100,
    ERR_SIGNER_XML_ERROR = 1101,
    ERR_SIGNER_BAD_TBAI_DOC = 1102,
    ERR_VALUE_MAX_LENGTH = 1103,
    ERR_VALUE_NOT_MATCH = 1104,
    ERR_DATE_EXPECTED_ERROR = 1105,
    ERR_IRS_INVALID = 1106,
    ERR_HEADER_CREDIT_NOTE_TS_BASE_VAT = 1107,
    ERR_HEADER_ISSUED_TIME_20_YEARS = 1108,
    ERR_OP_DATE_20_YEARS = 1109,
    ERR_VAT_KEY_19_NO_OT = 1110,
    ERR_VAT_KEY_19_ONLY_OT = 1111,
    ERR_03_09_RATE_AMOUNT = 1112,
    ERR_REPEATED_VATLINES = 1113,
    ERR_VAT_KEY_54_ONLY_IE_VT = 1114,
    ERR_IS_FIX_BIZKAIA = 1115,
    // Purchase errors
    ERR_VAT_KEY_09_TYPE_ID_02 = 4001,
    ERR_INCORRECT_END_NUMBER = 4002,
    ERR_MISSING_END_NUMBER = 4003,
    ERR_RECEP_DATE_NO_AFTER_4YEAR = 4004,
    ERR_RECEP_DATE_AFTER_ISSUE = 4005,
    ERR_INVOICE_TYPE_FOR_VAT_KEY_02 = 4006,
    ERR_RECIPIENT = 4007,
    ERR_BASE_COST_VAT_KEY = 4008,
    ERR_MISSING_BASE_COST = 4009,
    ERR_INVOICE_TYPE_SUBJECT_PASSIVE = 4010,
    ERR_VAT_KEYS_SUBJECT_PASSIVE = 4011,
    ERR_VAT_LINE_RATE_VAT_KEY_02 = 4012,
    ERR_DEDUCTIBLE_QUOTA = 4013,
    ERR_DEDUCTIBLE_QUOTA_MUST_BE_0 = 4014,
    ERR_INVALID_COMPENSATION_PERCENT = 4015,
    ERR_COMPENSATION_PERCENT = 4016,
    ERR_MISSING_COMPENSATION_AMOUNT = 4017,
    ERR_ACCOUNTING_DATE = 4018,
    ERR_MISSING_CONCEPT = 4019,
    ERR_CONCEPT_CANNOT_BE_INFORMED = 4020,
    ERR_MISSING_GOODS_REFERENCE = 4021,
    ERR_GOOD_REFERENCE_CANNOT_BE_INFORMED = 4022,
    ERR_VAT_LINE_AMOUNT_VAT_KEY_02 = 4023,
    ERR_COMPENSATION_AMOUNT_AND_BASE_SIGN = 4024,
    ERR_AMOUNT2_RATE2_REGIME = 4025,
}

export enum TbaiErrorMessages {
    ERR_ISSUER = "Issuer ID and fiscal name are required.",
    ERR_RECIPIENT_NO_SIMPLE = "Invoice without recipients and without simplified invoice check.",
    ERR_RECIPIENT_NO_R5_REASON = "Invoice without recipients with credit note reason other than R5.",
    ERR_RECIPIENT_REPLACE_TICKET = "Invoice without recipients for replaces ticket.",
    ERR_RECIPIENT_TS2 = "Invoice without recipients for non exemption type S2.",
    ERR_RECIPIENT_SURCHARGE = "Invoice without recipients with equivalence surcharge.",
    ERR_RECIPIENT_NO_ADDRESS = "Invoice without address for recipients.",
    ERR_RECIPIENT_NIF_NUMBER = "Incorrect VAT number, irsId has to be a Spanish VAT number.",
    ERR_RECIPIENT_VAT_NUMBER = "Incorrect VAT number.",
    ERR_RECIPIENT_COUNTRY_VAT_NUMBER = "Country code does not match the VAT number.",
    ERR_RECIPIENT_ES_T03 = "For recipient country 'ES', type must be '03'.",
    ERR_HEADER_NUMBER_EXP_DATE = "Invoice number and expedition date are required.",
    ERR_HEADER_SERIAL = "Invoice serie incorrect value.",
    ERR_HEADER_ISSUED_TIME_FUTURE = "issuedTime is not a valid date, it cannot be a future date.",
    ERR_HEADER_SIMPLE_EXCEEDED = "Simplified invoice cannot exceed 3000€.",
    ERR_HEADER_SERIAL_CREDIT_NOTE = "Invoice without serie for credit note.",
    ERR_HEADER_CREDIT_NOTE_TS = "Credit note must be type 'S'.",
    ERR_HEADER_MISSING_REPLACES = "Missing replaced ticket Ids.",
    ERR_HEADER_100_REPLACES_MAX = "Only up to 100 replaced invoices allowed",
    ERR_HEADER_REPLACE_SERIAL = "Replaced invoice serie incorrect value",
    ERR_HEADER_MISSING_CREDIT_NOTES = "Missing credit note Ids.",
    ERR_HEADER_100_RECTIFIED_MAX = "Only up to 100 rectified invoices allowed",
    ERR_VAT_KEY_3_MAX = "Only up to three VAT keys allowed",
    ERR_VAT_KEY_1_MAX = "Only up one VAT key for codes 02, 04, 09, 10, 14, 15, 17",
    ERR_VAT_KEYS_INCOMPATIBLE = "Incompatible VAT keys found for first key.",
    ERR_DATA_SUM_VAT_LINES_TOTAL = "The sum of the vat lines does not match the total invoice amount.",
    ERR_DATA_SUM_VAT_LINES_DETAILS = "The sum of the amounts indicated in the vatLines does not coincide with what was collected on the detail lines.",
    ERR_DATA_RETENTION_28_PERCENT = "Retention amount cannot be 28% greater than total.",
    ERR_DATA_SUM_LINES_TOTAL = "The sum of the amount of the lines does not match the total amount of the invoice.",
    ERR_DATA_SERVICE_E5_REASON = "If merchandiseOrService is 'service', exemption reason cannot be E5.",
    ERR_DATA_VAT_KEY_01_E2_E3 = "If VAT key is unique and 01, exemption reason cannot be E2 or E3.",
    ERR_DATA_TAX_RATE = "Invalid tax rate value.",
    ERR_DATA_INVALID_SURCHARGE_TAX_RATE = "Invalid equivalence surcharge tax rate value.",
    ERR_DATA_INCOMPATIBLE_SURCHARGE_TAX_RATE = "Incompatible equivalence surcharge tax rate value.",
    ERR_OP_DATE_FUTURE = "operationDate is not a valid date, it cannot be a future date.",
    ERR_OP_DATE_NO_AFTER_ISSUE = "Operation date cannot be after the date of issue.",
    ERR_RATE_REQUIRED_LINES = "Rate required in some lines.",
    ERR_AMOUNT_REQUIRED_LINES = "Amount required in some lines.",
    ERR_AMOUNT_BASE_SIGN_LINES = "Amount and base must have the same sign in some lines.",
    ERR_VAT_KEY_03_09_BASE_0 = "If the VAT key is unique with value 03 or 09, and the base is 0, the rate and amount must be empty or have value 0.",
    ERR_VAT_KEY_03_09_BASE_NO_0 = "If the VAT key is unique with value 03 or 09, and the base distinct of 0, the rate and amount cannot be empty or have value 0.",
    ERR_RATE_REQUIRED_VAT_LINE = "Rate required on at least one vat line.",
    ERR_AMOUNT2_BASE_SIGN_LINES = "Amount2 and base must have the same sign in some lines.",
    ERR_SIMPLE_NO_EXEMPTED_LINES = "Invoice cannot be simplified with not exempted lines.",
    ERR_RATE_0_LINES_REQUIRED = "Rate must be 0 in some lines.",
    ERR_AMOUNT_0_LINES_REQUIRED = "Amount must be 0 in some lines.",
    ERR_RATE2_0_LINES_REQUIRED = "Rate2 must be 0 in some lines",
    ERR_AMOUNT2_0_LINES_REQUIRED = "Amount2 must be 0 in some lines.",
    ERR_NOT_EXEMPTION_TYPE = "notExemptionType can only be S2 if vatKeys contains 01, 04, 05, 06, 07 or 12.",
    ERR_VAT_KEY_02_ONE_EXEMPT = "If vatKey 02, there must be at least one exempt subject operation.",
    ERR_VAT_KEY_02_SUBJECT_EXEMPT = "For unique vatKey 02, only can be indicated subject exempt in DesgloseTipoOperacion.",
    ERR_VAT_KEY_03_04_07_SUBJECT_VAT_LINES = "For unique vatKey 03, 04 or 07, there can be no not subject vat lines.",
    ERR_VAT_KEY_04_VAT_TS2 = "For vatKey 04 only vatType S2 is allowed.",
    ERR_VAT_KEY_07_NO_VAT_TS2 = "For vatKey 07 vatType S2 is not allowed.",
    ERR_VAT_KEY_07_EXEMPT_REASON = "For vatKey 07 exemptionReason E2, E3, E4 or E5 are not allowed.",
    ERR_VAT_KEY_08_ONLY_RL = "For vatKey 08 only notSubjectToVatReason RL is allowed.",
    ERR_VAT_KEY_08_ONLY_NOT_SUBJECT = "For vatKey 08 only notSubject is allowed.",
    ERR_VAT_KEY_10_ONLY_OT = "For vatKey 10 only notSubjectToVatReason OT is allowed.",
    ERR_VAT_KEY_11_12_13_ONLY_21_PERCENT = "For unique vatKey 11, 12 or 13, only rate 21% is allowed.",
    ERR_OP_DATE_AFTER_ISSUE = "Operation date must be after the date of issue.",
    ERR_VAT_KEY_14_START_PQSV = "For unique vatKey 14 VAT must start with P, Q, S o V.",
    ERR_VAT_KEY_17_ISSUED_JULY_2021 = "Issued date can't be before July 2021 for vatKey 17.",
    ERR_VAT_KEY_17_OP_JULY_2021 = "Operation date can't be before July 2021 for vatKey 17.",
    ERR_SIMPLIFIED_VAT_KEY_51_52 = "If isUsingSimplifiedRegime is true must include the vatKeys 51 or 52.",
    ERR_VAT_KEY_51_NO_2_AMOUNT_RATE = "For unique vatKey 51 you must not fill in amount2 or rate2.",
    ERR_VAT_KEY_51_INV_SIMPLIFIED = "For a single invoice vatKey 51, isUsingSimplifiedRegime must be true.",
    ERR_VAT_KEY_52_INV_SIMPLIFIED = "For a single invoice vatKey 52, isUsingSimplifiedRegime must be true.",
    ERR_VAT_KEY_53_NO_SUBJECT_OT = "If vatKey contain 53 only non-subject lines can be reported and the reason can only be 'OT'.",
    ERR_NO_SIMPLE_WITH_VAT_LINES = "Invoice cannot be vat lines with simplified regime.",
    ERR_1_EURO_EXCEEDED_AMOUNT_LINES = "Amount cannot exceed +-1 euro with respect to the base and rate in some lines.",
    ERR_10_EURO_EXCEEDED_AMOUNT_LINES = "Amount cannot exceed +-10 euro with respect to the base and rate in some lines.",
    ERR_1_EURO_EXCEEDED_AMOUNT2_LINES = "Amount2 cannot exceed +-1 euro with respect to the base and rate in some lines.",
    ERR_10_EURO_EXCEEDED_AMOUNT2_LINES = "Amount2 cannot exceed +-10 euro with respect to the base and rate in some lines.",
    ERR_GIPUZKOA_LINES_REQUIRED = "Lines required for invoice.",
    ERR_SOFTWARE_DATA = "Software license, name, version and Software Developer fiscal ID are required.",
    ERR_LINE_WITHOUT_AMOUNT_VAT = "Found invoice line without amountWithVat",
    ERR_LINE_WITHOUT_VAT = "Found invoice line without VAT and no default VAT defined",
    ERR_MISSING_DESTINATARIOS = "Missing Destinatarios element",
    ERR_MISSING_CABECERA_FACTURA = "Missing CabeceraFactura element",
    ERR_MISSING_FACTURA_RECTIFICATIVA = "Missing FacturaRectificativa element",
    ERR_NOT_SUBJECT_TO_VAT_REQUIRED = "Not subject to VAT reason is required.",
    ERR_EXEMPTION_REASON_REQUIRED = "Exemption reason is required.",
    ERR_EXEMPTED_VAT_MAX = "Exempted VAT max. occurs is 7",
    ERR_NOT_EXEMPTED_VAT_MAX = "Not exempted VAT max. occurs is 6",
    ERR_NOT_SUBJECT_TO_VAT_MAX = "Not subject to VAT max. occurs is 2",
    ERR_MERCH_SERVICE_VAT_LINES = "You must set merchandise or service for breakdown type of operation VAT lines.",
    ERR_LINES_OR_DESC_VAT_DETAILS = "Either lines or description + vat details must be provided.",
    ERR_RETENTION_AMOUNT_RATES = "You cannot set Retention Amount and Retention rates (IRPF) at the same time!",
    ERR_MERCH_SERVICE_FOREIGNERS = "merchandiseOrService is required for foreign receivers",
    ERR_TIPO_DESGLOSE_REQUIRED = "TipoDesglose XML node is required.",
    ERR_1000_LINE_MAX = "Only up to 1000 invoice lines allowed",
    ERR_MISSING_DETALLES_FACTURA = "Missing DetallesFactura element",
    ERR_MISSING_CLAVES = "Missing Claves element",
    ERR_SIGNER_P12_PASSWD_ALIAS = "Unsupported keystore format, wrong password or wrong alias",
    ERR_SIGNER_P12_NO_CERT_BAG = "No forge.pki.oids.certBag found.",
    ERR_SIGNER_P12_NO_KEY_BAG = "No forge.pki.oids.pkcs8ShroudedKeyBag found.",
    ERR_SIGNER_P12_NO_CERT_KEY = "No certified/private key found in p12 buffer.",
    ERR_SIGNER_XML_ERROR = "XML parse error",
    ERR_IRS_INVALID = "Invalid Irs",
    ERR_HEADER_CREDIT_NOTE_TS_BASE_VAT = "For credit note of type 'S' creditBase and creditVat are required.",
    ERR_HEADER_ISSUED_TIME_20_YEARS = "issuedTime is not a valid date, it cannot be less than 20 years ago date.",
    ERR_OP_DATE_20_YEARS = "operationDate is not a valid date, it cannot be less than 20 years ago date.",
    ERR_VAT_KEY_19_NO_OT = "For vatKey 19 at least a line with notSubjectToVatReason with 'OT' is required.",
    ERR_VAT_KEY_19_ONLY_OT = "For unique vatKey 19, only can be indicated notSubjectToVatReason with 'OT'.",
    ERR_03_09_RATE_AMOUNT = "For multiple keys including 03,09 and other keys, for S1 not exempted vat lines, amount and rate incoherence.",
    ERR_REPEATED_VATLINES = "Repeated vatLines.",
    ERR_VAT_KEY_54_ONLY_IE_VT = "For unique vatKey 54, only can be indicated notSubjectToVatReason with 'IE' or VT'.",
    ERR_IS_FIX_BIZKAIA = "isFix not supported for Bizkaia agency.",
    // Purchase errors
    ERR_VAT_KEY_09_TYPE_ID_02 = "If the VAT key is 09 , issuer type must be '02'.",
    ERR_INCORRECT_END_NUMBER = "The final invoice number cannot be reported when it is not of an F4 invoice type.",
    ERR_MISSING_END_NUMBER = "Missing final invoice number.",
    ERR_RECEP_DATE_NO_AFTER_4YEAR = "The invoice issue or operation date must not be earlier than the date of receipt in more than 4 years.",
    ERR_RECEP_DATE_AFTER_ISSUE = "Reception date must be after the date of issue.",
    ERR_INVOICE_TYPE_FOR_VAT_KEY_02 = "Invoice type cannot be F5 or LC if vat KEY is 02.",
    ERR_RECIPIENT = "Recipient ID and fiscal name are required.",
    ERR_BASE_COST_VAT_KEY = "The base at cost should not be reported if key VAT have a value other than 06.",
    ERR_MISSING_BASE_COST = "Missing base cost if vat key is 06.",
    ERR_INVOICE_TYPE_SUBJECT_PASSIVE = "Investment subject passive cannot be S if Invoice Type is F5 or LC.",
    ERR_VAT_KEYS_SUBJECT_PASSIVE = "Investment subject passive cannot be TRUE if vat key is 02, 03, 05, 08 or 13.",
    ERR_VAT_LINE_RATE_VAT_KEY_02 = "The tax rate cannot be informed if vat key is 02.",
    ERR_DEDUCTIBLE_QUOTA = "Incorrect deductible quota value.",
    ERR_DEDUCTIBLE_QUOTA_MUST_BE_0 = "The deductible quota must be 0.",
    ERR_INVALID_COMPENSATION_PERCENT = "Invalid compensation percente value.",
    ERR_COMPENSATION_PERCENT = "The compensation percent or amount should only come informed if vat key is 02.",
    ERR_MISSING_COMPENSATION_AMOUNT = "Missing compensation amount.",
    ERR_ACCOUNTING_DATE = "The accounting date must be equal to or greater than the issued date.",
    ERR_MISSING_CONCEPT = "Missing concept in some vat line.",
    ERR_CONCEPT_CANNOT_BE_INFORMED = "The concept cannot be informed for goodAffection with value 'I' or 'R'.",
    ERR_MISSING_GOODS_REFERENCE = "Missing goods reference in some vat line.",
    ERR_GOOD_REFERENCE_CANNOT_BE_INFORMED = "The goods reference cannot be informed in some vat line.",
    ERR_VAT_LINE_AMOUNT_VAT_KEY_02 = "The amount cannot be informed if vat key is 02.",
    ERR_COMPENSATION_AMOUNT_AND_BASE_SIGN = "Compensation amount and base must have the same sign in some lines",
    ERR_AMOUNT2_RATE2_REGIME = "Equivalence recharge data (amount2/rate2) cannot be informed if isUsingSimplifiedRegime is distinct of 'E'.",
}
