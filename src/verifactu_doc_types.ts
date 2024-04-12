// prettier-ignore
export type CountryCode =
	| "AF" | "AL" | "DE" | "AD" | "AO" | "AI" | "AQ" | "AG" | "SA" | "DZ" | "AR"
	| "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BE" | "BZ"
	| "BJ" | "BM" | "BY" | "BO" | "BA" | "BW" | "BV" | "BR" | "BN" | "BG" | "BF"
	| "BI" | "BT" | "CV" | "KY" | "KH" | "CM" | "CA" | "CF" | "CC" | "CO" | "KM"
	| "CG" | "CD" | "CK" | "KP" | "KR" | "CI" | "CR" | "HR" | "CU" | "TD" | "CZ"
	| "CL" | "CN" | "CY" | "CW" | "DK" | "DM" | "DO" | "EC" | "EG" | "AE" | "ER"
	| "SK" | "SI" | "ES" | "US" | "EE" | "ET" | "FO" | "PH" | "FI" | "FJ" | "FR"
	| "GA" | "GM" | "GE" | "GS" | "GH" | "GI" | "GD" | "GR" | "GL" | "GU" | "GT"
	| "GG" | "GN" | "GQ" | "GW" | "GY" | "HT" | "HM" | "HN" | "HK" | "HU" | "IN"
	| "ID" | "IR" | "IQ" | "IE" | "IM" | "IS" | "IL" | "IT" | "JM" | "JP" | "JE"
	| "JO" | "KZ" | "KE" | "KG" | "KI" | "KW" | "LA" | "LS" | "LV" | "LB" | "LR"
	| "LY" | "LI" | "LT" | "LU" | "XG" | "MO" | "MK" | "MG" | "MY" | "MW" | "MV"
	| "ML" | "MT" | "FK" | "MP" | "MA" | "MH" | "MU" | "MR" | "YT" | "UM" | "MX"
	| "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MZ" | "MM" | "NA" | "NR" | "CX"
	| "NP" | "NI" | "NE" | "NG" | "NU" | "NF" | "NO" | "NC" | "NZ" | "IO" | "OM"
	| "NL" | "BQ" | "PK" | "PW" | "PA" | "PG" | "PY" | "PE" | "PN" | "PF" | "PL"
	| "PT" | "PR" | "QA" | "GB" | "RW" | "RO" | "RU" | "SB" | "SV" | "WS" | "AS"
	| "KN" | "SM" | "SX" | "PM" | "VC" | "SH" | "LC" | "ST" | "SN" | "RS" | "SC"
	| "SL" | "SG" | "SY" | "SO" | "LK" | "SZ" | "ZA" | "SD" | "SS" | "SE" | "CH"
	| "SR" | "TH" | "TW" | "TZ" | "TJ" | "PS" | "TF" | "TL" | "TG" | "TK" | "TO"
	| "TT" | "TN" | "TC" | "TM" | "TR" | "TV" | "UA" | "UG" | "UY" | "UZ" | "VU"
	| "VA" | "VE" | "VN" | "VG" | "VI" | "WF" | "YE" | "DJ" | "ZM" | "ZW" | "QU"
	| "XB" | "XU" | "XN" | "AX" | "BL" | "EH" | "GF" | "GP" | "MF" | "MQ" | "RE"
    | "SJ";

// prettier-ignore
export type IrsIdType =
    | "02"  // NIF-IVA
    | "03"  // Pasaporte
    | "04"  // IDEnPaisResidencia
    | "05"  // Certificado Residencia
    | "06"  // Otro documento probatorio
    | "07"; // No Censado

export interface Issuer {
    irsId: string;
    name: string;
}

export interface PartnerIrs {
    irsId: string;
    idType?: undefined;
    name: string;
    country: CountryCode;
}

export interface PartnerOther {
    id: string;
    idType: IrsIdType;
    name: string;
    country: CountryCode;
}

export type Partner = PartnerIrs | PartnerOther;

// prettier-ignore
export type VatExemptReason =
    | "E0"  // EXENTA sin especificar causa
    | "E1"  // EXENTA por Art. 20
    | "E2"  // EXENTA por Art. 21
    | "E3"  // EXENTA por Art. 22
    | "E4"  // EXENTA por Art. 24
    | "E5"  // EXENTA por Art. 25
    | "E6"; // EXENTA otros

// prettier-ignore
export type VatType =
    | "S1"  // OPERACIÓN SUJETA Y NO EXENTA - SIN INVERSIÓN DEL SUJETO PASIVO
    | "S2"  // OPERACIÓN SUJETA Y NO EXENTA - CON INVERSIÓN DEL SUJETO PASIVO
    | "N1"  // OPERACIÓN NO SUJETA ARTÍCULO 7, 14, OTROS
    | "N2"; // OPERACIÓN NO SUJETA POR REGLAS DE LOCALIZACIÓN

// prettier-ignore
export type VatKey =
    | "01"  // Operación de régimen general
    | "02"  // Exportación
    | "03"  // Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección
    | "04"  // Régimen especial del oro de inversión
    | "05"  // Régimen especial de las agencias de viajes
    | "06"  // Régimen especial grupo de entidades en IVA (Nivel Avanzado)
    | "07"  // Régimen especial del criterio de caja
    | "08"  // Operaciones sujetas al IPSI  / IGIC (Impuesto sobre la Producción, los Servicios y la Importación  / Impuesto General Indirecto Canario)
    | "09"  // Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (D.A.4ª RD1619/2012)
    | "10"  // Cobros por cuenta de terceros de honorarios profesionales o de derechos derivados de la propiedad industrial, de autor u otros por cuenta de sus socios, asociados o colegiados efectuados por sociedades, asociaciones, colegios profesionales u otras entidades que realicen estas funciones de cobro
    | "11"  // Operaciones de arrendamiento de local de negocio
    | "14"  // Factura con IVA pendiente de devengo en certificaciones de obra cuyo destinatario sea una Administración Pública
    | "15"  // Factura con IVA pendiente de devengo en operaciones de tracto sucesivo
    | "17"  // Operación acogida a alguno de los regímenes previstos en el Capítulo XI del Título IX (OSS e IOSS)
    | "18"  // Recargo de equivalencia
    | "19"  // Operaciones de actividades incluidas en el Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP)
    | "20"; // Régimen simplificado

export interface VatLine {
    base: number; // BaseImponibleOimporteNoSujeto
    rate: number; // TipoImpositivo
    amount?: number; // CuotaRepercutida
    rate2?: number; // TipoRecargoEquivalencia
    amount2?: number; // CuotaRecargoEquivalencia
    vatOperation: VatType | VatExemptReason; // CalificacionOperacion o OperacionExenta
    vatKey: VatKey; // ClaveRegimen
    isUsingSimplifiedRegime?: boolean; // false por defecto, true si se trata de una factura expedida por un contribuyente en régimen simpolificado o en régimen de recargo de equivalencia.
}

export interface InvoiceDescription {
    text: string;
    operationDate: Date;
}

export interface InvoiceDescriptionJson {
    text: string;
    operationDate: Date | string;
}

export type InvoiceType =
    | "F1" // FACTURA (ART. 6, 7.2 Y 7.3 DEL RD 1619/2012)
    | "F2" // FACTURA SIMPLIFICADA Y FACTURAS SIN IDENTIFICACIÓN DEL DESTINATARIO ART. 6.1.D) RD 1619/2012
    | "F3" // FACTURA EMITIDA EN SUSTITUCIÓN DE FACTURAS SIMPLIFICADAS FACTURADAS Y DECLARADAS
    | "R1" // FACTURA RECTIFICATIVA (Art 80.1 y 80.2 y error fundado en derecho)
    | "R2" // FACTURA RECTIFICATIVA (Art. 80.3)
    | "R3" // FACTURA RECTIFICATIVA (Art. 80.4)
    | "R4" // FACTURA RECTIFICATIVA (Resto)
    | "R5"; // FACTURA RECTIFICATIVA EN FACTURAS SIMPLIFICADAS

export interface CreditNoteType {
    style: // TipoRectificativa
    | "S" // Factura rectificativa por sustitución
        | "I"; // Factura rectificativa por diferencias
    ids: Array<InvoiceId>; // Facturas rectificadas
    // Solo obligatorios para el tipo "S"
    creditBase?: number; // Base rectificada
    creditVat?: number; // Cuota rectificada
    creditRecharge?: number; // Cuota recargo rectificada
}

export type IssuedType =
    | "T" // Tercero
    | "D"; // Destinatario

export interface IssuedBy {
    type: IssuedType; // Tipo
    issuer?: Partner; // Tercero
}

export interface InvoiceIdJson {
    number: string;
    issuedTime: Date | string;
}

export interface InvoiceId extends InvoiceIdJson {
    issuedTime: Date;
}

export interface PreviousInvoiceIdJson {
    issuerIrsId: string;
    number: string;
    issuedTime: Date | string;
    hash: string;
}

export interface PreviousInvoiceId extends PreviousInvoiceIdJson {
    issuedTime: Date;
}

export interface Invoice {
    issuer: Issuer; // IDEmisorFactura
    recipient?: Partner; // Destinatarios
    id: InvoiceId; // IDFactura
    type: InvoiceType; // TipoFactura
    replacesTicket?: boolean;
    replacedTicketIds?: Array<InvoiceId>; // FacturasSustituidas
    creditNote?: CreditNoteType; // FacturasRectificadas
    simple?: boolean; // FacturaSimplificadaArticulos7.2_7.3
    description?: InvoiceDescription; // DescripcionOperacion
    vatLines: Array<VatLine>; // Desglose
    amount: number; // CuotaTotal
    total: number; // ImporteTotal
    issuedBy?: IssuedBy; // EmitidaPorTercerosODestinatario
}

export interface CancelInvoice {
    id: InvoiceId; // IDFactura
    issuer: Issuer; // IDEmisorFacturaAnulada
    issuedBy?: IssuedBy; // GeneradoPor
}

export interface InvoiceVerifactuData {
    qrcode: string; // data url
    chainInfo: PreviousInvoiceId;
    verifactuXml: string; // xml codificado en base64
}
