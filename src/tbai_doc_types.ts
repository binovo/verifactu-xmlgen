import { InvoiceId, PreviousInvoiceId } from "./invoice_id";
export { InvoiceId, PreviousInvoiceId };

import { CountryCode, IrsIdType } from "./common_doc_types";
export { CountryCode, IrsIdType };

export interface Issuer {
    irsId: string;
    name: string;
}

export interface RecipientIrs {
    irsId: string;
    idType?: undefined;
    name: string;
    country: CountryCode; // Para RecipientIrs el código de país se ignorará ya que siempre debe ser ES
    postal?: string;
    address?: string;
    vat2?: boolean;
    // default: {"21.00": 5.2, "10.00": 1.4, "4.00": 0.5} si vat2 es true
    vatToVat2?: { [vat: string]: number };
}

export interface RecipientOther {
    id: string;
    idType: IrsIdType;
    name: string;
    country: CountryCode;
    postal?: string;
    address?: string;
}

export type Recipient = RecipientIrs | RecipientOther;

export interface TaxType {
    id: string;
    name: string;
    tax: number;
}

export type VatExemptReason =
    /* Artículo 20. Exenciones en operaciones interiores. */
    | "E1"
    /* Artículo 21. Exenciones en las exportaciones de bienes.  */
    | "E2"
    /* Artículo 22. Exenciones en las operaciones asimiladas a las exportaciones. */
    | "E3"
    /* Artículo 23. Exenciones relativas a las zonas francas, depósitos francos y otros depósitos.
   Artículo 24. Exenciones relativas a regímenes aduaneros y fiscales. */
    | "E4"
    /* Artículo 25. Exenciones en las entregas de bienes destinados a otro Estado miembro. */
    | "E5"
    | "E6" /* Exenta por otras causas */;

/* S1: sin inversión del sujeto pasivo. */
/* S2: con inversión del sujeto pasivo. */
export type VatNotExemptType = "S1" | "S2";

export type NotSubjectToVatReason = "OT" | "RL" | "VT" | "IE";

export type MerchandiseOrService = "merchandise" | "service";

export interface InvoiceLine {
    description: string;
    quantity: number;
    price: number;
    discount?: number;
    amount?: number; // default: quantity * price * (1 - discount / 100)
    amountWithVat?: number; // default: quantity * price * (1 - discount / 100) * (1 + vat / 100)
    vat?: number;
    retention?: number;
    exemptionReason?: VatExemptReason; // si está presente se ignora vat.
    notExemptionType?: VatNotExemptType;
    notSubjectToVatReason?: NotSubjectToVatReason;
    merchandiseOrService?: MerchandiseOrService; // si el receptor es extranjero entonces este campo es obligatorio
    discountAmount?: number; // default: (quantity * price) * (discount / 100)
    isUsingSimplifiedRegime?: boolean; // false por defecto, true si se trata de una factura expedida por un contribuyente en régimen simpolificado o en régimen de recargo de equivalencia.
}

export interface VatLine {
    base: number;
    rate: number;
    amount?: number;
    rate2?: number; // TipoRecargoEquivalencia
    amount2?: number; // cuota recargo equivalencia
    exemptionReason?: VatExemptReason; // si está presente se ignora rate.
    notExemptionType?: VatNotExemptType;
    notSubjectToVatReason?: NotSubjectToVatReason; // si está presente se ignora rate.
    merchandiseOrService?: MerchandiseOrService; // si el receptor es extranjero entonces este campo es obligatorio
    isUsingSimplifiedRegime?: boolean; // false por defecto, true si se trata de una factura expedida por un contribuyente en régimen simpolificado o en régimen de recargo de equivalencia.
}

export interface RetentionLine {
    base: number;
    rate: number;
    amount?: number;
}

export interface InvoiceDescription {
    text: string;
    operationDate: Date;
}

export interface InvoiceDescriptionJson {
    text: string;
    operationDate: Date | string;
}

export type VatKey =
    | "01" // Operación de régimen general y cualquier otro supuesto que no esté recogido en los siguientes valores
    | "02" // Exportación
    | "03" // Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección
    | "04" // Régimen especial del oro de inversión
    | "05" // Régimen especial de las agencias de viajes
    | "06" // Régimen especial grupo de entidades en IVA (Nivel Avanzado)
    | "07" // Régimen especial del criterio de caja
    | "08" // Operaciones sujetas al IPSI/IGIC (Impuesto sobre la Producción, los Servicios y la Importación / Impuesto General Indirecto Canario)
    | "09" // Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (disposición adicional 3ª del Reglamento de Facturación)
    | "10" // Cobros por cuenta de terceros o terceras de honorarios profesionales o de derechos derivados de la propiedad industrial, de autor u otros por cuenta de sus socios, socias, asociados, asociadas, colegiados o colegiadas efectuados por sociedades, asociaciones, colegios profesionales u otras entidades que realicen estas funciones de cobro
    | "11" // Operaciones de arrendamiento de local de negocio sujetos a retención
    | "12" // Operaciones de arrendamiento de local de negocio no sujetos a retención
    | "13" // Operaciones de arrendamiento de local de negocio sujetas y no sujetas a retención
    | "14" // Factura con IVA pendiente de devengo en certificaciones de obra cuyo destinatario sea una Administración Pública
    | "15" // Factura con IVA pendiente de devengo en operaciones de tracto sucesivo
    | "17" // IX. tituluko XI. kapituluan aurreikusitako araubideren bati atxikitako eragiketa (OSS eta IOSS) - Operación acogida a alguno de los regímenes previstos en el Capítulo XI del Título IX (OSS e IOSS)
    | "19" // Nekazaritza, abeltzaintza eta arrantzaren araubide berezian dauden jardueren eragiketak (NAAAB) - Operaciones de actividades incluidas en el Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP)
    | "51" // Operaciones en recargo de equivalencia
    | "52" // Operaciones en régimen simplificado
    | "53" // Operaciones realizadas por personas o entidades que no tengan la consideración de empresarios, empresarias o profesionales a efectos del IVA
    | "54"; // Operaciones realizadas desde Establecimientos Permanentes situados en Canarias, Ceuta y Melilla
export interface CreditNoteType {
    reason: // Tipo factura rectificativa
    | "R1" // error fundado en derecho y Art. 80 Uno, Dos y Seis de la Norma Foral del IVA
        | "R2" // artículo 80 Tres de la Norma Foral del IVA
        | "R3" // Factura rectificativa: artículo 80 Cuatro de la Norma Foral del IVA
        | "R4" // Factura rectificativa: Resto
        | "R5";
    style:
        | "S" // Factura rectificativa por sustitución
        | "I"; // Factura rectificativa por diferencias
    ids: Array<InvoiceId>; // Facturas rectificadas
    // Solo obligatorios para el tipo "S"
    creditBase?: number; // Base rectificada
    creditVat?: number; // Cuota rectificada
    creditRecharge?: number; // Cuota recargo rectificada
}

export type IssuedBy =
    | "N" // Factura emitida por el propio emisor o emisora
    | "T" // Factura emitida por tercero o tercera
    | "D"; // Factura emitida por el destinatario o la destinataria de la operación

export type FixActionType =
    | "SUBSANAR" // Reenvío de una factura en estado de error, no ha sido recibida
    | "MODIFICAR"; // Actualizar datos de una factura en estado de aceptado con avisos, ha sido recibida

export interface Invoice {
    issuer: Issuer;
    recipient?: Recipient;
    id: InvoiceId;
    replacesTicket?: boolean;
    replacedTicketIds?: Array<InvoiceId>;
    creditNote?: CreditNoteType;
    simple?: boolean; // setting this to true is mandatory for simplified invoices.
    description?: InvoiceDescription; // default: generic description and invoice date
    vatLines?: Array<VatLine>; // if not present, calculated from lines
    retentionLines?: Array<RetentionLine>; // if not present, calculated from lines
    lines?: Array<InvoiceLine>; // either description and vatLines or lines must be included
    total?: number; // if not present, calculated from vatLines and retentionLines.
    retentionAmount?: number; // if not present, calculated from retentionLines.
    vat?: number; // default vat for lines that do not specify it
    retention?: number; // default retention for lines that do not specify it
    vatKeys?: Array<VatKey>; // default [01] "régimen general"
    issuedBy?: IssuedBy;
    isFix?: boolean; // setting this to true means that this is a fix invoice
    hashFix?: string; // hash of the fix invoice
    actionTypeFix?: FixActionType; // correct a non sent invoice or modify a sent one
}

export interface ChainedInvoice {
    invoice: Invoice;
    previousId: PreviousInvoiceId | null;
}

export interface CancelInvoice {
    id: InvoiceId;
    issuer: Issuer;
}

export interface InvoiceTbaiData {
    qrcode: string; // data url
    chainInfo: PreviousInvoiceId;
    tbaiXml: string; // xml codificado en base64
    tbaiId: string;
    queueId: number; // identificado de encolado. Entero > 0.
}

export interface CancelInvoiceTbaiData {
    tbaiXml: string; // xml codificado en base64
    tbaiId: string;
    queueId: number; // identificado de encolado. Entero > 0.
}

export type CancelInvoiceRef = CancelInvoice | number | string;

export type QueryInvoiceRef = CancelInvoiceRef;

export interface Message {
    message: string;
}

export interface QueueState {
    state: "draft" | "pending" | "sent" | "cancel" | "error";
}
