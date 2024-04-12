import { InvoiceId } from "./invoice_id";
export { InvoiceId };

import { CountryCode, IrsIdType } from "./common_doc_types";
export { CountryCode, IrsIdType };

export interface Recipient {
    irsId: string;
    name: string;
}

export interface IssuerIrs {
    irsId: string;
    idType?: undefined;
    name: string;
}

export interface IssuerOther {
    id: string;
    idType: IrsIdType;
    name: string;
    country: CountryCode;
}

export type Issuer = IssuerIrs | IssuerOther;

export type InvoiceType =
    | "F1" // Factura con identificación del destinatario o de la destinataria
    | "F2" // Factura sin identificación del destinatario o de la destinataria
    | "F3" // Factura emitida en sustitución de facturas simplificadas y declaradas con anterioridad
    | "F4" // Asiento resumen de facturas
    | "F5" // Importaciones con DUA
    | "F6" // Otros justificantes
    | "LC"; // Aduanas-Liquidación complementaria

export type PurchaseExpenseType =
    | "C" // Compra de bienes corrientes
    | "G" // Gastos
    | "I"; // Adquisición de bienes de inversión

export type GoodAffectionType =
    | "I" // Adquisición de un bien de inversión a efectos del IVA y afecto a la actividad en el IRPF
    | "R" // Adquisición de un bien afecto a la actividad en el IRPF, pero que no es bien de inversión a efectos del IVA
    | "N"; // Adquisición de un bien que no se considera ni bien de inversión a efectos del IVA ni bien afecto a la actividad en el IRPF

export type SimplifiedRegimeType =
    | "E" // Operación en recargo de equivalencia
    | "S" // Operación en régimen simplificado
    | "N"; // Operación que no está ni en recargo de equivalencia ni en régimen simplificado

export type ConceptType =
    | "600" // Compras de mercaderías
    | "601" // Compras de materias primas
    | "602" // Compras de otros aprovisionamientos
    | "606" // Descuentos sobre compras por pronto pago
    | "607" // Trabajos realizados por otras empresas
    | "608" // Devoluciones de compras y operaciones similares
    | "609" // Rappels por compras
    | "620" // Gastos en investigación y desarrollo del ejercicio
    | "621" // Arrendamientos y cánones
    | "622" // Reparaciones y conservación
    | "623" // Servicios de profesionales independientes
    | "624" // Transportes
    | "625" // Primas de seguros
    | "626" // Servicios bancarios y similares
    | "627" // Publicidad, propaganda y relaciones públicas
    | "628" // Suministros
    | "629" // Otros servicios
    | "631" // Otros servicios
    | "634" // Ajustes negativos en la imposición indirecta
    | "639" // Ajustes positivos en la imposición indirecta
    | "640" // Sueldos y salarios
    | "641" // Indemnizaciones
    | "64201" // Seguridad social a cargo de la empresa: autónomos
    | "64202" // Seguridad social a cargo de la empresa: empleados
    | "643" // Retribuciones a largo plazo mediante sistemas de aportación definida
    | "644" // Retribuciones a largo plazo mediante sistemas de prestación definida
    | "649" // Otros gastos sociales
    | "65" // Otros gastos de gestión
    | "66" // Gastos financieros
    | "67" // Gastos excepcionales
    | "680" // Amortización del inmovilizado intangible
    | "681" // Amortización del inmovilizado material
    | "682" // Amortización de las inversiones inmobiliarias
    | "69"; // Pérdidas por deterioro y otras dotaciones

export interface VatLine {
    base: number; // BaseImponible
    rate?: number; // TipoImpositivo
    amount?: number; // CuotaIVASoportada
    purchaseExpenseType: PurchaseExpenseType; // CompraBienesCorrientesGastosBienesInversion
    investmentSubjectPassive: boolean; // InversionSujetoPasivo
    deductible?: number; // CuotaIVADeducible
    compensationAmount?: number; // ImporteCompensacionREAGYP
    compensationPercent?: number; // PorcentajeCompensacionREAGYP
}

export interface ExpenseVatLine {
    epigraph: string; // Epigrafe
    goodAffection?: GoodAffectionType; // BienAfectoIRPFYOIVAEnum
    concept?: ConceptType; // Concepto
    reference?: string; // ReferenciaBien
    investmentSubjectPassive: boolean; // InversionSujetoPasivo
    isUsingSimplifiedRegime?: SimplifiedRegimeType; // OperacionEnRecargoDeEquivalenciaORegimenSimplificado
    base: number; // BaseImponible
    rate?: number; // TipoImpositivo
    amount?: number; // CuotaIVASoportada
    deductible?: number; // CuotaIVADeducible
    rate2?: number; // TipoRecargoEquivalencia
    amount2?: number; // CuotaRecargoEquivalencia
    compensationPercent?: number; // PorcentajeCompensacionREAGYP
    compensationAmount?: number; // ImporteCompensacionREAGYP
    expense?: number; // ImporteGastoIRPF
    criteria?: boolean; // CriterioCobrosYPagos
}

export type VatDetail = VatLine | ExpenseVatLine;

export type VatKey =
    | "01" // Operación de régimen general y cualquier otro supuesto que no esté recogido en los siguientes valores
    | "02" // Operaciones por las que los empresarios o las empresarias satisfacen compensaciones en las adquisiciones a personas acogidas al Régimen especial de la agricultura, ganadería y pesca
    | "03" // Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección
    | "04" // Régimen especial del oro de inversión
    | "05" // Régimen especial de las agencias de viajes
    | "06" // Régimen especial grupo de entidades en IVA (Nivel Avanzado)
    | "07" // Régimen especial del criterio de caja
    | "08" // Operaciones sujetas al IPSI/IGIC (Impuesto sobre la Producción, los Servicios y la Importación/Impuesto General Indirecto Canario)
    | "09" // Adquisiciones intracomunitarias de bienes y prestaciones de servicios
    | "12" // Operaciones de arrendamiento de local de negocio
    | "13"; // Factura correspondiente a una importación (informada sin asociar a un DUA)

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

export interface Entity {
    name: string;
    irsId: string;
}

export interface InfoTax {
    date?: Date;
    regNum?: string;
    externalRef?: string;
    successedEntity?: Entity;
}

export interface Invoice {
    recipient: Recipient;
    issuer: Issuer;
    id: InvoiceId;
    endNumber?: string;
    type: InvoiceType;
    description: string;
    operationDate?: Date;
    receptionDate: Date;
    vatLines: Array<VatDetail>;
    total: number;
    baseCost?: number;
    vatKeys: Array<VatKey>;
    replacesTicket?: boolean;
    replacedTicketIds?: Array<InvoiceId>;
    creditNote?: CreditNoteType;
    otherInfoTax?: InfoTax;
}

export interface CancelInvoice {
    id: InvoiceId;
    issuer: Issuer;
}

export interface InvoiceResponseData {
    lroeXml: string; // xml codificado en base64
    queueId: number; // identificado de encolado. Entero > 0.
}
