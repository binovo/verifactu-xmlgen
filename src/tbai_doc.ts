import "regenerator-runtime/runtime";
import { querySelector, querySelectorAll } from "./xmldom";
import {
    updateDocument,
    removeElement,
    toStr2,
    toStr20,
    toStr30,
    toStr120,
    toStr250,
    toStrTruncate100,
    toNifStr,
    toEsPostal,
} from "./utils";
import {
    FormatAndValidationFunction,
    round2,
    round8,
    round2ToString,
    round8ToString,
    SimpleType,
    toDateString,
    toTimeString,
    toString,
} from "./to_string";

import {
    CancelInvoice,
    CreditNoteType,
    CountryCode,
    Invoice,
    InvoiceDescription,
    InvoiceId,
    InvoiceLine,
    IrsIdType,
    MerchandiseOrService,
    NotSubjectToVatReason,
    PreviousInvoiceId,
    Recipient,
    RecipientIrs,
    RecipientOther,
    VatExemptReason,
    VatKey,
    VatNotExemptType,
    VatLine,
    RetentionLine,
} from "./tbai_doc_types";
export type {
    CancelInvoice,
    ChainedInvoice,
    CountryCode,
    CreditNoteType,
    Invoice,
    InvoiceDescription,
    InvoiceDescriptionJson,
    InvoiceId,
    InvoiceLine,
    IrsIdType,
    Issuer,
    MerchandiseOrService,
    NotSubjectToVatReason,
    PreviousInvoiceId,
    Recipient,
    RecipientIrs,
    RecipientOther,
    TaxType,
    VatExemptReason,
    VatKey,
    VatNotExemptType,
    VatLine,
    RetentionLine,
} from "./tbai_doc_types";

import * as tbaiValidations from "./tbai_validations";
import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

export enum TaxAgency {
    Araba = 0,
    Bizkaia = 1,
    Gipuzkoa = 2,
}

const INVOICE_LINES_MAX = 1000;
const VAT_TO_VAT2_MAP = {
    "21.00": 5.2,
    "10.00": 1.4,
    "5.00": 0.62,
    "4.00": 0.5,
    "0.00": 0,
};
const taxAgencyValidations: { [K: number]: Function } = {
    0: tbaiValidations.ensureCreateInvoiceArabaValidations,
    1: tbaiValidations.ensureCreateInvoiceBizkaiaValidations,
    2: tbaiValidations.ensureCreateInvoiceGipuzkoaValidations,
};

const NIF_COUNTRY_CODE_LEN = 2;
// prune possible country code from NIF and validate.
function toShortNifStr(nif: string): string {
    if (nif.slice(0, NIF_COUNTRY_CODE_LEN) == "ES") {
        return toNifStr(nif.slice(NIF_COUNTRY_CODE_LEN));
    } else {
        return toNifStr(nif);
    }
}

export interface InvoiceLineFull {
    // not exported, implementation detail
    description: string;
    quantity: number;
    price: number;
    discount: number;
    amount: number; // default: quantity * price * (1 - discount / 100)
    amountWithVat: number; // default: (amount * (1 + vat / 100) * (1 + vat2 / 100)) - (amount * retention / 100)
    discountAmount: number; // default: (quantity * price) * (discount / 100)
    vat: number;
    vat2: number; // recargo de equivalencia
    retention: number;
    notSubjectToVatReason: NotSubjectToVatReason | undefined; // si está presente se ignora vat.
    exemptionReason: VatExemptReason | undefined; // si está presente se ignora vat.
    notExemptionType: VatNotExemptType | undefined;
    merchandiseOrService: MerchandiseOrService | undefined; // si el receptor es extranjero entonces este campo es obligatorio
    isUsingSimplifiedRegime: boolean;
    raw: {
        price: number;
        discount: number;
        amount: number;
    };
}

export interface VatLineFull {
    // not exported, implementation detail
    base: number;
    rate: number;
    amount: number;
    rate2: number; // TipoRecargoEquivalencia
    amount2: number; // cuota recargo equivalencia
    exemptionReason: VatExemptReason | undefined;
    notExemptionType: VatNotExemptType | undefined;
    notSubjectToVatReason: NotSubjectToVatReason | undefined;
    merchandiseOrService: MerchandiseOrService | undefined; // si el receptor es extranjero entonces este campo es obligatorio
    isUsingSimplifiedRegime: boolean; // false por defecto
}

export interface RetentionLineFull {
    // not exported, implementation detail
    base: number;
    rate: number;
    amount: number;
}

export interface InvoiceFull extends Invoice {
    // not exported, implementation detail
    replacesTicket: boolean;
    simple: boolean;
    vatLines: Array<VatLineFull>;
    retentionLines: Array<RetentionLineFull>;
    lines: Array<InvoiceLineFull>;
    total: number;
    retentionAmount: number;
    vatKeys: Array<VatKey>;
}

export interface SoftwareIdInfo {
    idType: IrsIdType;
    country: CountryCode;
}

export interface Software {
    license: string;
    developerIrsId: string; // IRS ID, only developers registered in Spain supported at this moment
    idInfo?: SoftwareIdInfo;
    name: string;
    version: string;
}

export interface ToXmlOptions {
    deviceId?: string;
    roundTaxGlobally?: boolean;
    g5015?: number;
    g5016?: boolean;
    g1177?: boolean;
}

const TBAI_CANCEL_XML_BASE = `
<tbai:AnulaTicketBai xmlns:tbai="urn:ticketbai:anulacion">
    <Cabecera>
        <IDVersionTBAI>1.2</IDVersionTBAI>
    </Cabecera>
    <IDFactura>
        <Emisor>
            <NIF>????</NIF>
            <ApellidosNombreRazonSocial>????</ApellidosNombreRazonSocial>
        </Emisor>
        <CabeceraFactura>
            <SerieFactura>????</SerieFactura>
            <NumFactura>????</NumFactura>
            <FechaExpedicionFactura>????</FechaExpedicionFactura>
        </CabeceraFactura>
    </IDFactura>
    <HuellaTBAI>
        <Software>
            <LicenciaTBAI>????</LicenciaTBAI>
            <EntidadDesarrolladora/>
            <Nombre>????</Nombre>
            <Version>????</Version>
        </Software>
        <NumSerieDispositivo>????</NumSerieDispositivo>
    </HuellaTBAI>
</tbai:AnulaTicketBai>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

const TBAI_XML_BASE = `
<tbai:TicketBai xmlns:tbai="urn:ticketbai:emision">
    <Cabecera>
        <IDVersionTBAI>1.2</IDVersionTBAI>
    </Cabecera>
    <Sujetos>
        <Emisor>
            <NIF>????</NIF>
            <ApellidosNombreRazonSocial>????</ApellidosNombreRazonSocial>
        </Emisor>
        <Destinatarios/>
        <EmitidaPorTercerosODestinatario/>
    </Sujetos>
    <Factura>
        <CabeceraFactura>
            <SerieFactura>????</SerieFactura>
            <NumFactura>????</NumFactura>
            <FechaExpedicionFactura>????</FechaExpedicionFactura>
            <HoraExpedicionFactura>????</HoraExpedicionFactura>
            <FacturaSimplificada>S</FacturaSimplificada>
            <FacturaEmitidaSustitucionSimplificada>S</FacturaEmitidaSustitucionSimplificada>
            <FacturaRectificativa/>
            <FacturasRectificadasSustituidas/>
        </CabeceraFactura>
        <DatosFactura>
            <FechaOperacion>????</FechaOperacion>
            <DescripcionFactura>????</DescripcionFactura>
            <DetallesFactura></DetallesFactura>
            <ImporteTotalFactura>????</ImporteTotalFactura>
            <RetencionSoportada>????</RetencionSoportada>
            <Claves></Claves>
        </DatosFactura>
        <TipoDesglose/>
    </Factura>
    <HuellaTBAI>
        <EncadenamientoFacturaAnterior>
            <SerieFacturaAnterior>????</SerieFacturaAnterior>
            <NumFacturaAnterior>????</NumFacturaAnterior>
            <FechaExpedicionFacturaAnterior>????</FechaExpedicionFacturaAnterior>
            <SignatureValueFirmaFacturaAnterior>????</SignatureValueFirmaFacturaAnterior>
        </EncadenamientoFacturaAnterior>
        <Software>
            <LicenciaTBAI>????</LicenciaTBAI>
            <EntidadDesarrolladora/>
            <Nombre>????</Nombre>
            <Version>????</Version>
        </Software>
        <NumSerieDispositivo>????</NumSerieDispositivo>
    </HuellaTBAI>
</tbai:TicketBai>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

const FIX_TBAI_XML_BASE = `
<tbai:SubsanacionModificacionTicketBAI xmlns:tbai="urn:ticketbai:zuzendu-alta">
    <Cabecera>
        <IDVersion>1.0</IDVersion>
        <Accion>????</Accion>
    </Cabecera>
    <Sujetos>
        <Emisor>
            <NIF>????</NIF>
            <ApellidosNombreRazonSocial>????</ApellidosNombreRazonSocial>
        </Emisor>
        <Destinatarios/>
        <EmitidaPorTercerosODestinatario/>
    </Sujetos>
    <Factura>
        <CabeceraFactura>
            <SerieFactura>????</SerieFactura>
            <NumFactura>????</NumFactura>
            <FechaExpedicionFactura>????</FechaExpedicionFactura>
            <HoraExpedicionFactura>????</HoraExpedicionFactura>
            <FacturaSimplificada>S</FacturaSimplificada>
            <FacturaEmitidaSustitucionSimplificada>S</FacturaEmitidaSustitucionSimplificada>
            <FacturaRectificativa/>
            <FacturasRectificadasSustituidas/>
        </CabeceraFactura>
        <DatosFactura>
            <FechaOperacion>????</FechaOperacion>
            <DescripcionFactura>????</DescripcionFactura>
            <DetallesFactura></DetallesFactura>
            <ImporteTotalFactura>????</ImporteTotalFactura>
            <RetencionSoportada>????</RetencionSoportada>
            <Claves></Claves>
        </DatosFactura>
        <TipoDesglose/>
    </Factura>
    <HuellaTBAI>
        <EncadenamientoFacturaAnterior>
            <SerieFacturaAnterior>????</SerieFacturaAnterior>
            <NumFacturaAnterior>????</NumFacturaAnterior>
            <FechaExpedicionFacturaAnterior>????</FechaExpedicionFacturaAnterior>
            <SignatureValueFirmaFacturaAnterior>????</SignatureValueFirmaFacturaAnterior>
        </EncadenamientoFacturaAnterior>
        <Software>
            <LicenciaTBAI>????</LicenciaTBAI>
            <EntidadDesarrolladora/>
            <Nombre>????</Nombre>
            <Version>????</Version>
        </Software>
        <NumSerieDispositivo>????</NumSerieDispositivo>
    </HuellaTBAI>
    <SignatureValueFirmaFactura>????</SignatureValueFirmaFactura>
</tbai:SubsanacionModificacionTicketBAI>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

function completeInvoiceLines(
    lines: Array<InvoiceLine>,
    defaultVat?: number,
    defaultRetention?: number,
    vatToVat2Param?: { [vat: string]: number },
    fixLinePrice?: boolean
): Array<InvoiceLineFull> {
    let _mapVat: (vat: string, vatToVat2: { [vat: string]: number }) => number;
    function _computeVat(l: InvoiceLine): number | undefined {
        if (l.exemptionReason) {
            return 0;
        } else if (l.vat !== undefined) {
            return l.vat;
        } else {
            return defaultVat;
        }
    }
    function _fixLinePrice(
        quantity: number,
        discountAmount: number,
        vat: number,
        vat2: number,
        amountWithVat?: number
    ): number {
        if (amountWithVat === undefined) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_LINE_WITHOUT_AMOUNT_VAT,
                TbaiErrorCodes.ERR_LINE_WITHOUT_AMOUNT_VAT
            );
        } else {
            let linePrice = amountWithVat / (quantity * (1 + (vat + vat2) / 100));
            if (discountAmount !== undefined) {
                const lineDto = discountAmount / quantity;
                linePrice = linePrice + lineDto;
            }
            return linePrice;
        }
    }
    if (vatToVat2Param) {
        _mapVat = (vat: string, vatToVat2: { [vat: string]: number }): number => {
            if (vat in vatToVat2) {
                return vatToVat2[vat];
            } else {
                throw new TbaiError(
                    "VAT " + vat + " not found in " + JSON.stringify(vatToVat2),
                    TbaiErrorCodes.ERR_VAT_NOT_FOUND
                );
            }
        };
    } else {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        _mapVat = (vat: string, vatToVat2: { [vat: string]: number }): number => {
            return 0;
        };
    }
    const vatToVat2 = vatToVat2Param || {};
    return lines.map((l) => {
        const vat = _computeVat(l);
        const retention = l.retention || defaultRetention || 0;
        if (vat === undefined) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_LINE_WITHOUT_VAT,
                TbaiErrorCodes.ERR_LINE_WITHOUT_VAT
            );
        }
        const vat2 = _mapVat(round2ToString(vat), vatToVat2);
        let price = l.price;
        const quantity = round8(l.quantity),
            discount = l.discount || 0,
            discountAmount =
                l.discountAmount || quantity * round8(price) * (round2(discount) / 100.0),
            amount = l.amount || quantity * round8(price) - round8(discountAmount);
        let amountWithVat;
        if (l.amountWithVat === undefined) {
            amountWithVat =
                round8(amount) +
                round8(amount) * (round8(vat) / 100.0) +
                round8(amount) * (round8(vat2) / 100.0);
        } else {
            amountWithVat = l.amountWithVat;
        }
        // Si está activa la opción g5016, ajustamos el precio unitario de las líneas
        // para pasar validación 5016
        if (fixLinePrice) {
            price = _fixLinePrice(quantity, discountAmount, vat, vat2, l.amountWithVat);
        }
        return {
            description: l.description,
            quantity: quantity,
            price: round8(price),
            discount: round2(discount),
            amount: round8(amount),
            amountWithVat: round8(amountWithVat),
            discountAmount: round8(discountAmount),
            vat: vat,
            vat2: vat2,
            retention: round2(retention),
            exemptionReason: l.exemptionReason,
            notSubjectToVatReason: l.notSubjectToVatReason,
            notExemptionType: l.notExemptionType,
            merchandiseOrService: l.merchandiseOrService,
            isUsingSimplifiedRegime: l.isUsingSimplifiedRegime || false,
            raw: {
                price: price,
                discount: discount,
                amount: amount,
            },
        };
    });
}

function completeVatLines(lines: Array<VatLine>): Array<VatLineFull> {
    return lines.map((vl) => {
        let amount;
        let amount2;
        if (vl.amount === undefined) {
            amount = (round2(vl.base) * vl.rate) / 100.0;
        } else {
            amount = vl.amount;
        }
        if (vl.amount2 === undefined) {
            if (typeof vl.rate2 === "number") {
                amount2 = (round2(vl.base) * vl.rate2) / 100.0;
            }
        } else {
            amount2 = vl.amount2;
        }
        if (!vl.notSubjectToVatReason) {
            if (!vl.exemptionReason && !vl.notExemptionType) {
                vl.notExemptionType = "S1";
            }
        }
        return {
            base: round2(vl.base),
            rate: vl.rate,
            amount: round2(amount),
            rate2: vl.rate2 || 0,
            amount2: round2(amount2 || 0),
            exemptionReason: vl.exemptionReason,
            notExemptionType: vl.notExemptionType,
            notSubjectToVatReason: vl.notSubjectToVatReason,
            merchandiseOrService: vl.merchandiseOrService,
            isUsingSimplifiedRegime: vl.isUsingSimplifiedRegime || false,
        };
    });
}

function completeRetentionLines(lines: Array<RetentionLine>): Array<RetentionLineFull> {
    return lines.map((il) => {
        let amount;
        if (il.amount === undefined) {
            amount = (round2(il.base) * round2(il.rate)) / 100.0;
        } else {
            amount = il.amount;
        }
        return {
            base: round2(il.base),
            rate: round2(il.rate),
            amount: round2(amount),
        };
    });
}

export function completeInvoice(
    invoice: Invoice,
    linesFull: Array<InvoiceLineFull>,
    vatLinesFull: Array<VatLineFull>,
    retentionLinesFull: Array<RetentionLineFull>
): InvoiceFull {
    let total: number;
    if (invoice.total !== undefined) {
        total = invoice.total;
    } else {
        total = tbaiValidations.computeTotal(vatLinesFull);
    }
    const retentionAmount =
        invoice.retentionAmount || tbaiValidations.computeRetentionTotal(retentionLinesFull);
    return {
        issuer: invoice.issuer,
        recipient: invoice.recipient,
        id: invoice.id,
        replacesTicket: invoice.replacesTicket || false,
        replacedTicketIds: invoice.replacedTicketIds,
        creditNote: invoice.creditNote,
        simple: invoice.simple || false,
        description: invoice.description,
        vatLines: vatLinesFull,
        retentionLines: retentionLinesFull,
        lines: linesFull,
        total: round2(total),
        retentionAmount: round2(retentionAmount),
        vat: invoice.vat || 0.0,
        retention: invoice.retention || 0.0,
        vatKeys: invoice.vatKeys || ["01"],
    };
}

function computeVatLines(lines: Array<InvoiceLineFull>): Array<VatLineFull> {
    // agrupar/desglosar también los exentos
    type AccType = { [index: string]: VatLineFull };
    return Object.values(
        lines.reduce((acc: AccType, l: InvoiceLineFull): AccType => {
            const base = round2(l.amount);
            const rate = l.vat;
            const rateKey = rate + "-" + l.isUsingSimplifiedRegime;
            const amount = round2((base * rate) / 100.0);
            const rate2 = l.vat2 || 0.0;
            const amount2 = round2((base * rate2) / 100.0);
            if (!acc[rateKey]) {
                acc[rateKey] = {
                    base: base,
                    rate: rate,
                    rate2: rate2,
                    amount: amount,
                    amount2: amount2,
                    exemptionReason: l.exemptionReason,
                    notExemptionType: l.notExemptionType,
                    notSubjectToVatReason: l.notSubjectToVatReason,
                    merchandiseOrService: l.merchandiseOrService,
                    isUsingSimplifiedRegime: l.isUsingSimplifiedRegime,
                };
            } else {
                acc[rateKey].base += base;
                acc[rateKey].amount += amount;
                acc[rateKey].amount2 += amount2;
            }
            return acc;
        }, {})
    );
}

function computeRetentionLines(lines: Array<InvoiceLineFull>): Array<RetentionLineFull> {
    type AccType = { [index: number]: RetentionLineFull };
    return Object.values(
        lines.reduce((acc: AccType, l: InvoiceLineFull): AccType => {
            const base = round2(l.amount);
            const rate = round2(l.retention);
            const amount = round2((base * rate) / 100.0);
            if (!acc[rate]) {
                acc[rate] = {
                    base: base,
                    rate: rate,
                    amount: amount,
                };
            } else {
                acc[rate].base += base;
                acc[rate].amount += amount;
            }
            return acc;
        }, {})
    );
}

function computeVatLinesRoundGlobal(lines: Array<InvoiceLineFull>): Array<VatLineFull> {
    type AccType = { [index: string]: VatLineFull };
    return Object.values(
        lines.reduce((acc: AccType, l: InvoiceLineFull): AccType => {
            const base = l.raw.amount;
            const rate = l.vat;
            const rateKey = rate + "-" + l.isUsingSimplifiedRegime;
            const amount = (base * rate) / 100.0;
            const rate2 = l.vat2 || 0;
            const amount2 = (base * rate2) / 100.0;
            if (!acc[rateKey]) {
                acc[rateKey] = {
                    base: base,
                    rate: l.vat,
                    rate2: rate2,
                    amount: amount,
                    amount2: amount2,
                    exemptionReason: l.exemptionReason,
                    notExemptionType: l.notExemptionType,
                    notSubjectToVatReason: l.notSubjectToVatReason,
                    merchandiseOrService: l.merchandiseOrService,
                    isUsingSimplifiedRegime: l.isUsingSimplifiedRegime,
                };
            } else {
                acc[rateKey].base += base;
                acc[rateKey].amount += amount;
                acc[rateKey].amount2 += amount2;
            }
            return acc;
        }, {})
    );
}

function computeRetentionLinesRoundGlobal(lines: Array<InvoiceLineFull>): Array<RetentionLineFull> {
    type AccType = { [index: number]: RetentionLineFull };
    return Object.values(
        lines.reduce((acc: AccType, l: InvoiceLineFull): AccType => {
            const base = l.raw.amount;
            const rate = l.retention;
            const amount = (base * rate) / 100.0;
            if (!acc[rate]) {
                acc[rate] = {
                    base: base,
                    rate: l.retention,
                    amount: amount,
                };
            } else {
                acc[rate].base += base;
                acc[rate].amount += amount;
            }
            return acc;
        }, {})
    );
}

function addLineNode(xml: Document, linesNode: Node, line: InvoiceLineFull): void {
    const lineNode = xml.createElement("IDDetalleFactura"),
        descriptionNode = xml.createElement("DescripcionDetalle"),
        quantityNode = xml.createElement("Cantidad"),
        priceNode = xml.createElement("ImporteUnitario"),
        discountNode = xml.createElement("Descuento"),
        amountNode = xml.createElement("ImporteTotal");
    descriptionNode.textContent = toStr250(line.description);
    quantityNode.textContent = round8ToString(line.quantity);
    priceNode.textContent = round8ToString(line.price);
    discountNode.textContent = round8ToString(line.discountAmount);
    amountNode.textContent = round8ToString(line.amountWithVat);
    linesNode.appendChild(lineNode);
    lineNode.appendChild(descriptionNode);
    lineNode.appendChild(quantityNode);
    lineNode.appendChild(priceNode);
    lineNode.appendChild(discountNode);
    lineNode.appendChild(amountNode);
}

function addRecipientIrs(xml: Document, recipient: RecipientIrs): void {
    const tpl = `
<IDDestinatario>
    <NIF/>
    <ApellidosNombreRazonSocial/>
    <CodigoPostal/>
    <Direccion/>
</IDDestinatario>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // prettier-ignore
    updateDocument(newXml, [
        ['NIF'                       , recipient.irsId , toNifStr],
        ['ApellidosNombreRazonSocial', recipient.name  , toStr120],
        ['Direccion'                 , recipient.address,toStr250]
    ]);
    if (recipient.postal) {
        updateDocument(newXml, [["CodigoPostal", recipient.postal, toEsPostal]]);
    } else {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        querySelectorAll(newXml, "CodigoPostal").forEach(removeElement);
    }
    if (!recipient.address) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        querySelectorAll(newXml, "Direccion").forEach(removeElement);
    }
    const parentNode = querySelector(xml, "Destinatarios");
    if (!parentNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_DESTINATARIOS,
            TbaiErrorCodes.ERR_MISSING_DESTINATARIOS
        );
    }
    parentNode.appendChild(newXml.documentElement);
}

function addRecipientOther(xml: Document, recipient: RecipientOther): void {
    const tpl = `
<IDDestinatario>
    <IDOtro>
        <CodigoPais/>
        <IDType/>
        <ID/>
    </IDOtro>
    <ApellidosNombreRazonSocial/>
    <CodigoPostal/>
    <Direccion/>
</IDDestinatario>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // si idType es 02 ignoremos el país y no lo incluimos en el XML
    // porque es opcional así evitamos tropezar con la validación
    // g1146.
    function _getCountry(): CountryCode | undefined {
        if (recipient.idType == "02") {
            return undefined;
        } else {
            return recipient.country;
        }
    }
    // prettier-ignore
    updateDocument(newXml, [
        ["IDOtro>CodigoPais"         , _getCountry()    , toStr2],
        ["IDOtro>IDType"             , recipient.idType , toStr2],
        ["IDOtro>ID"                 , recipient.id     , toStr20],
        ["ApellidosNombreRazonSocial", recipient.name   , toStr120],
        ["CodigoPostal"              , recipient.postal , toStr20],
        ["Direccion"                 , recipient.address, toStr250],
    ]);
    if (!recipient.postal) {
        querySelectorAll(newXml, "CodigoPostal").forEach(removeElement);
    }
    if (!recipient.address) {
        querySelectorAll(newXml, "Direccion").forEach(removeElement);
    }
    const parentNode = querySelector(xml, "Destinatarios");
    if (!parentNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_DESTINATARIOS,
            TbaiErrorCodes.ERR_MISSING_DESTINATARIOS
        );
    }
    parentNode.appendChild(newXml.documentElement);
}

function addRecipient(xml: Document, recipient?: Recipient): void {
    if (!recipient) {
        querySelectorAll(xml, "Destinatarios").forEach(removeElement);
        return;
    }
    if (recipient.idType) {
        addRecipientOther(xml, recipient as RecipientOther);
    } else {
        addRecipientIrs(xml, recipient as RecipientIrs);
    }
}

function addRectifiedReplacedInvoices(xml: Document, invoicesNode: Node, id: InvoiceId): void {
    const tpl = `
<IDFacturaRectificadaSustituida>
    <SerieFactura/>
    <NumFactura/>
    <FechaExpedicionFactura/>
</IDFacturaRectificadaSustituida>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // prettier-ignore
    updateDocument(newXml, [
        ['SerieFactura'           , id.serie      , toStr20],
        ['NumFactura'             , id.number     , toStr20],
        ['FechaExpedicionFactura' , id.issuedTime , toDateString],
    ]);
    if (!id.serie || id.serie == "") {
        querySelectorAll(newXml, "SerieFactura").forEach(removeElement);
    }
    invoicesNode.appendChild(newXml.documentElement);
}

function addCreditNote(xml: Document, creditNote?: CreditNoteType): void {
    if (!creditNote) {
        querySelectorAll(xml, "FacturaRectificativa").forEach(removeElement);
        return;
    }
    const tpl = `
<FacturaRectificativa>
    <Codigo/>
    <Tipo/>
    <ImporteRectificacionSustitutiva>
        <BaseRectificada/>
        <CuotaRectificada/>
        <CuotaRecargoRectificada/>
    </ImporteRectificacionSustitutiva>
</FacturaRectificativa>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // prettier-ignore
    updateDocument(newXml, [
        ['Codigo'                                                   , creditNote.reason         , toString],
        ['Tipo'                                                     , creditNote.style          , toString],
        ['ImporteRectificacionSustitutiva>BaseRectificada'          , creditNote.creditBase     , round2ToString],
        ['ImporteRectificacionSustitutiva>CuotaRectificada'         , creditNote.creditVat      , round2ToString],
        ['ImporteRectificacionSustitutiva>CuotaRecargoRectificada'  , creditNote.creditRecharge , round2ToString],

    ]);
    if (!creditNote.creditRecharge) {
        querySelectorAll(newXml, "CuotaRecargoRectificada").forEach(removeElement);
    }
    if (creditNote.style == "I") {
        querySelectorAll(newXml, "ImporteRectificacionSustitutiva").forEach(removeElement);
    }
    const parentNode = querySelector(xml, "CabeceraFactura");
    if (!parentNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_CABECERA_FACTURA,
            TbaiErrorCodes.ERR_MISSING_CABECERA_FACTURA
        );
    }
    const oldChild = querySelector(xml, "FacturaRectificativa");
    if (!oldChild) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_FACTURA_RECTIFICATIVA,
            TbaiErrorCodes.ERR_MISSING_FACTURA_RECTIFICATIVA
        );
    }
    parentNode.replaceChild(newXml.documentElement, oldChild);
    const invoicesNode = querySelector(xml, "FacturasRectificadasSustituidas");
    for (const id of creditNote.ids) {
        addRectifiedReplacedInvoices(xml, invoicesNode, id);
    }
}

function addVatKeyNode(xml: Document, vatKeysNode: Node, vatKey: VatKey): void {
    const vatKeyNode = xml.createElement("IDClave"),
        opNode = xml.createElement("ClaveRegimenIvaOpTrascendencia");
    opNode.textContent = vatKey;
    vatKeysNode.appendChild(vatKeyNode);
    vatKeyNode.appendChild(opNode);
}

function addNotSubjectToVatLineNode(
    xml: Document,
    vatLinesNode: Element,
    vatLine: VatLineFull
): void {
    const vatNode = xml.createElement("DetalleNoSujeta"),
        reasonNode = xml.createElement("Causa"),
        baseNode = xml.createElement("Importe");

    if (vatLine.notSubjectToVatReason) {
        reasonNode.textContent = vatLine.notSubjectToVatReason;
    } else {
        throw new TbaiError(
            TbaiErrorMessages.ERR_NOT_SUBJECT_TO_VAT_REQUIRED,
            TbaiErrorCodes.ERR_NOT_SUBJECT_TO_VAT_REQUIRED
        );
    }
    baseNode.textContent = round2ToString(vatLine.base);

    vatLinesNode.appendChild(vatNode);
    vatNode.appendChild(reasonNode);
    vatNode.appendChild(baseNode);
}

function addExemptedVatLineNode(xml: Document, vatLinesNode: Element, vatLine: VatLineFull): void {
    const vatNode = xml.createElement("DetalleExenta"),
        reasonNode = xml.createElement("CausaExencion"),
        baseNode = xml.createElement("BaseImponible");

    if (vatLine.exemptionReason) {
        reasonNode.textContent = vatLine.exemptionReason;
    } else {
        throw new TbaiError(
            TbaiErrorMessages.ERR_EXEMPTION_REASON_REQUIRED,
            TbaiErrorCodes.ERR_EXEMPTION_REASON_REQUIRED
        );
    }
    baseNode.textContent = round2ToString(vatLine.base);

    vatLinesNode.appendChild(vatNode);
    vatNode.appendChild(reasonNode);
    vatNode.appendChild(baseNode);
}

function addNotExemptedVatLineNode(
    xml: Document,
    vatLinesNode: Element,
    vatLine: VatLineFull
): void {
    const vatNode = xml.createElement("DetalleIVA"),
        baseNode = xml.createElement("BaseImponible"),
        rateNode = xml.createElement("TipoImpositivo"),
        amountNode = xml.createElement("CuotaImpuesto");

    baseNode.textContent = round2ToString(vatLine.base);
    rateNode.textContent = round2ToString(vatLine.rate);
    amountNode.textContent = round2ToString(vatLine.amount);

    vatLinesNode.appendChild(vatNode);
    vatNode.appendChild(baseNode);
    vatNode.appendChild(rateNode);
    vatNode.appendChild(amountNode);
    if (vatLine.rate2) {
        const reRateNode = xml.createElement("TipoRecargoEquivalencia");
        reRateNode.textContent = round2ToString(vatLine.rate2);
        vatNode.appendChild(reRateNode);
        const reAmountNode = xml.createElement("CuotaRecargoEquivalencia");
        reAmountNode.textContent = round2ToString(vatLine.amount2);
        vatNode.appendChild(reAmountNode);
    }
    if (vatLine.isUsingSimplifiedRegime) {
        const sNode = xml.createElement("OperacionEnRecargoDeEquivalenciaORegimenSimplificado");
        sNode.textContent = "S";
        vatNode.appendChild(sNode);
    }
}

function isSpanishVatBreakdown(recipient?: Recipient): boolean {
    return (recipient &&
        !recipient.idType &&
        recipient.country == "ES" &&
        "irsId" in recipient &&
        !recipient.irsId.startsWith("N")) ||
        !recipient
        ? true
        : false;
}

function addVatBreakdown(
    xml: Document,
    vatBreakdownNode: Element,
    vatLinesFull: Array<VatLineFull>
): void {
    const exemptedMaxCount = 7,
        notExemptedMaxCount = 12,
        notSubjectToVatMaxCount = 4,
        subjectToVatNode = xml.createElement("Sujeta"),
        exemptedNode = xml.createElement("Exenta"),
        notExemptedNode = xml.createElement("NoExenta"),
        notExemptedS1DetailsNode = xml.createElement("DetalleNoExenta"),
        notExemptedS1TypeNode = xml.createElement("TipoNoExenta"),
        notExemptedS1BreakdownNode = xml.createElement("DesgloseIVA"),
        notExemptedS2DetailsNode = xml.createElement("DetalleNoExenta"),
        notExemptedS2TypeNode = xml.createElement("TipoNoExenta"),
        notExemptedS2BreakdownNode = xml.createElement("DesgloseIVA"),
        notSubjectToVatNode = xml.createElement("NoSujeta");

    const vatLinesByType = tbaiValidations.computeVatLinesByType(vatLinesFull);
    const exemptedVatLines = vatLinesByType.exemptedVatLines,
        notExemptedVatS1Lines = vatLinesByType.notExemptedVatS1Lines,
        notExemptedVatS2Lines = vatLinesByType.notExemptedVatS2Lines,
        notSubjectToVatLines = vatLinesByType.notSubjectToVatLines;

    tbaiValidations.ensureUniqueVatLines(exemptedVatLines);
    tbaiValidations.ensureUniqueVatLines(notExemptedVatS1Lines);
    tbaiValidations.ensureUniqueVatLines(notExemptedVatS2Lines);
    tbaiValidations.ensureUniqueVatLines(notSubjectToVatLines);

    const notExemptedVatLinesCount = notExemptedVatS1Lines.length + notExemptedVatS2Lines.length;
    if (exemptedMaxCount < exemptedVatLines.length) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_EXEMPTED_VAT_MAX,
            TbaiErrorCodes.ERR_EXEMPTED_VAT_MAX
        );
    }
    if (notExemptedMaxCount < notExemptedVatLinesCount) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_NOT_EXEMPTED_VAT_MAX,
            TbaiErrorCodes.ERR_NOT_EXEMPTED_VAT_MAX
        );
    }
    if (notSubjectToVatMaxCount < notSubjectToVatLines.length) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_NOT_SUBJECT_TO_VAT_MAX,
            TbaiErrorCodes.ERR_NOT_SUBJECT_TO_VAT_MAX
        );
    }
    if (0 < exemptedVatLines.length || 0 < notExemptedVatLinesCount) {
        vatBreakdownNode.appendChild(subjectToVatNode);
        if (0 < exemptedVatLines.length) {
            subjectToVatNode.appendChild(exemptedNode);
            for (const vatLine of exemptedVatLines) {
                addExemptedVatLineNode(xml, exemptedNode, vatLine);
            }
        }
        if (0 < notExemptedVatLinesCount) {
            subjectToVatNode.appendChild(notExemptedNode);
            if (0 < notExemptedVatS1Lines.length) {
                notExemptedNode.appendChild(notExemptedS1DetailsNode);
                notExemptedS1TypeNode.textContent = "S1";
                notExemptedS1DetailsNode.appendChild(notExemptedS1TypeNode);
                notExemptedS1DetailsNode.appendChild(notExemptedS1BreakdownNode);
                for (const vatLine of notExemptedVatS1Lines) {
                    addNotExemptedVatLineNode(xml, notExemptedS1BreakdownNode, vatLine);
                }
            }
            if (0 < notExemptedVatS2Lines.length) {
                notExemptedNode.appendChild(notExemptedS2DetailsNode);
                notExemptedS2TypeNode.textContent = "S2";
                notExemptedS2DetailsNode.appendChild(notExemptedS2TypeNode);
                notExemptedS2DetailsNode.appendChild(notExemptedS2BreakdownNode);
                for (const vatLine of notExemptedVatS2Lines) {
                    addNotExemptedVatLineNode(xml, notExemptedS2BreakdownNode, vatLine);
                }
            }
        }
    }
    if (0 < notSubjectToVatLines.length) {
        vatBreakdownNode.appendChild(notSubjectToVatNode);
        for (const vatLine of notSubjectToVatLines) {
            addNotSubjectToVatLineNode(xml, notSubjectToVatNode, vatLine);
        }
    }
}

function addSpanishVatBreakdown(
    xml: Document,
    vatBreakdownNode: Node,
    vatLinesFull: Array<VatLineFull>
): void {
    const spanishVatBreakdownNode = xml.createElement("DesgloseFactura");
    vatBreakdownNode.appendChild(spanishVatBreakdownNode);
    addVatBreakdown(xml, spanishVatBreakdownNode, vatLinesFull);
}

function addNonSpanishVatBreakdown(
    xml: Document,
    vatBreakdownNode: Node,
    vatLinesFull: Array<VatLineFull>
): void {
    const serviceVatLines: Array<VatLineFull> = [],
        merchandiseVatLines: Array<VatLineFull> = [];

    const nonSpanishVatBreakdownNode = xml.createElement("DesgloseTipoOperacion"),
        servicesNode = xml.createElement("PrestacionServicios"),
        merchandiseNode = xml.createElement("Entrega");
    vatBreakdownNode.appendChild(nonSpanishVatBreakdownNode);

    for (const vatLine of vatLinesFull) {
        if ("merchandise" === vatLine.merchandiseOrService) {
            merchandiseVatLines.push(vatLine);
        } else if ("service" === vatLine.merchandiseOrService) {
            serviceVatLines.push(vatLine);
        } else {
            // validationError g1148 + a10-62 + B4_2000038
            throw new TbaiError(
                TbaiErrorMessages.ERR_MERCH_SERVICE_VAT_LINES,
                TbaiErrorCodes.ERR_MERCH_SERVICE_VAT_LINES
            );
        }
    }
    if (0 < serviceVatLines.length) {
        nonSpanishVatBreakdownNode.appendChild(servicesNode);
        addVatBreakdown(xml, servicesNode, serviceVatLines);
    }
    if (0 < merchandiseVatLines.length) {
        nonSpanishVatBreakdownNode.appendChild(merchandiseNode);
        addVatBreakdown(xml, merchandiseNode, merchandiseVatLines);
    }
}

function addSoftwareInfo(xml: Document, software: Software): void {
    const developer = querySelector(xml, "EntidadDesarrolladora");
    if (!software.idInfo) {
        const irsId = xml.createElement("NIF");
        irsId.textContent = toShortNifStr(software.developerIrsId);
        developer.appendChild(irsId);
    } else {
        const tpl = `
<IDOtro>
    <CodigoPais/>
    <IDType/>
    <ID/>
</IDOtro>
`.replace(/>\s+</g, "><");
        const otherIdXml = new DOMParser().parseFromString(tpl, "application/xml");
        const idInfo = software.idInfo;
        // prettier-ignore
        updateDocument(otherIdXml, [
            ["CodigoPais", idInfo.country        , toStr2],
            ["IDType"    , idInfo.idType         , toStr2],
            ["ID"        , software.developerIrsId, toStr20]
        ]);
        developer.appendChild(otherIdXml.documentElement);
    }
}

export function cancelInvoiceToXmlDocument(
    invoice: CancelInvoice,
    software: Software,
    options?: ToXmlOptions
): XMLDocument {
    options = options || {};
    const xml = new DOMParser().parseFromString(TBAI_CANCEL_XML_BASE, "application/xml");
    if (!invoice.issuer || !invoice.issuer.irsId || !invoice.issuer.name) {
        throw new TbaiError(TbaiErrorMessages.ERR_ISSUER, TbaiErrorCodes.ERR_ISSUER);
    }
    ("");
    if (!invoice.id || !invoice.id.number || !invoice.id.issuedTime) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_HEADER_NUMBER_EXP_DATE,
            TbaiErrorCodes.ERR_HEADER_NUMBER_EXP_DATE
        );
    }

    tbaiValidations.ensureSoftwareValidations(software);

    // prettier-ignore
    let selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["Emisor>NIF"                            , invoice.issuer.irsId    , toNifStr],
        ["ApellidosNombreRazonSocial"            , invoice.issuer.name     , toStr120],
        ["CabeceraFactura>SerieFactura"          , invoice.id.serie        , toStr20],
        ["CabeceraFactura>NumFactura"            , invoice.id.number       , toStr20],
        ["CabeceraFactura>FechaExpedicionFactura", invoice.id.issuedTime   , toDateString],
        ["Software>LicenciaTBAI"                 , software.license        , toStr20],
        ["Software>Nombre"                       , software.name           , toStr120],
        ["Software>Version"                      , software.version        , toStr20]
    ];
    addSoftwareInfo(xml, software);
    // prettier-ignore
    if (options.deviceId) {
        selectorsToValues = selectorsToValues.concat([
            ["NumSerieDispositivo", options.deviceId, toStr30],
        ]);
    } else {
        querySelectorAll(xml, 'NumSerieDispositivo').forEach(removeElement);
    }
    updateDocument(xml, selectorsToValues);
    return xml;
}

export function toXmlDocumentInner(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    taxAgency: TaxAgency,
    xmlBase: string,
    options?: ToXmlOptions
): XMLDocument {
    let description: InvoiceDescription;
    let vatLinesFull: Array<VatLineFull>;
    let retentionLinesFull: Array<RetentionLineFull>;
    function _computeVatToVat2(invoice: Invoice): { [vat: string]: number } | undefined {
        if (invoice.recipient && "irsId" in invoice.recipient) {
            if (invoice.recipient.vat2) {
                if (invoice.recipient.vatToVat2) {
                    return invoice.recipient.vatToVat2;
                } else {
                    return VAT_TO_VAT2_MAP;
                }
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    options = options || {};

    let linesFull = completeInvoiceLines(
        invoice.lines || [],
        invoice.vat,
        invoice.retention,
        _computeVatToVat2(invoice),
        options.g5016 || false
    );
    tbaiValidations.ensureSoftwareValidations(software);

    /**
     * Case análisis:
     *  - lines present       iff L = 1
     *  - vat lines present   iff V = 1
     *  - description present iff D = 1
     * L = 1            L = 0
     * | V | D |    |   | V | D |    |
     * |---+---+----|   |---+---+----|
     * | 0 | 0 | ok |   | 0 | 0 |    |
     * | 0 | 1 | ok |   | 0 | 1 |    |
     * | 1 | 0 | ok |   | 1 | 0 |    |
     * | 1 | 1 | ok |   | 1 | 1 | ok |
     */
    if (invoice.lines) {
        description = invoice.description || {
            text: "/",
            // this "new" is required to prevent issuedTime from being
            // modified when computing operationDate date.
            operationDate: new Date(invoice.id.issuedTime),
        };
        if (invoice.vatLines && invoice.vatLines.length > 0) {
            vatLinesFull = completeVatLines(invoice.vatLines);
        } else {
            if (options.roundTaxGlobally) {
                vatLinesFull = completeVatLines(computeVatLinesRoundGlobal(linesFull));
            } else {
                vatLinesFull = completeVatLines(computeVatLines(linesFull));
            }
        }
        if (invoice.retentionLines) {
            retentionLinesFull = completeRetentionLines(invoice.retentionLines);
        } else {
            if (options.roundTaxGlobally) {
                retentionLinesFull = completeRetentionLines(
                    computeRetentionLinesRoundGlobal(linesFull)
                );
            } else {
                retentionLinesFull = completeRetentionLines(computeRetentionLines(linesFull));
            }
        }
    } else if (invoice.vatLines && invoice.vatLines.length > 0 && invoice.description) {
        vatLinesFull = completeVatLines(invoice.vatLines);
        description = invoice.description;
        if (invoice.retentionLines) {
            retentionLinesFull = completeRetentionLines(invoice.retentionLines);
        } else {
            retentionLinesFull = [];
        }
    } else {
        throw new TbaiError(
            TbaiErrorMessages.ERR_LINES_OR_DESC_VAT_DETAILS,
            TbaiErrorCodes.ERR_LINES_OR_DESC_VAT_DETAILS
        );
    }

    if (invoice.retentionAmount !== undefined && 0 < retentionLinesFull.length) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_RETENTION_AMOUNT_RATES,
            TbaiErrorCodes.ERR_RETENTION_AMOUNT_RATES
        );
    }
    // Si es la hacienda de Bizkaia nisiquiera tenemos en cuenta la líneas de factura
    if (taxAgency == 1) {
        linesFull = [];
    }
    const invoiceFull = completeInvoice(invoice, linesFull, vatLinesFull, retentionLinesFull);
    tbaiValidations.ensureCreateInvoiceValidations(
        invoiceFull,
        description,
        options.g5015 || 0,
        options.g5016 || false,
        options.g1177 || false
    );
    taxAgencyValidations[taxAgency](invoiceFull);
    // prettier-ignore
    let selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["Emisor>NIF"                            , invoice.issuer.irsId      , toNifStr],
        ["Emisor>ApellidosNombreRazonSocial"     , invoice.issuer.name       , toStr120],
        ["CabeceraFactura>SerieFactura"          , invoice.id.serie          , toStr20],
        ["CabeceraFactura>NumFactura"            , invoice.id.number         , toStr20],
        ["CabeceraFactura>FechaExpedicionFactura", invoice.id.issuedTime     , toDateString],
        ["CabeceraFactura>HoraExpedicionFactura" , invoice.id.issuedTime     , toTimeString],
        ["FechaOperacion"                        , description.operationDate , toDateString],
        ["DescripcionFactura"                    , description.text          , toStr250],
        ["ImporteTotalFactura"                   , invoiceFull.total                     , round2ToString],
        ["RetencionSoportada"                    , invoiceFull.retentionAmount           , round2ToString],
        ["Software>LicenciaTBAI"                 , software.license          , toStr20],
        ["Software>Nombre"                       , software.name             , toStr120],
        ["Software>Version"                      , software.version          , toStr20],
    ];
    if (invoice.isFix) {
        // prettier-ignore
        selectorsToValues = selectorsToValues.concat([
            ["Accion"                    , invoice.actionTypeFix, toString],
            ["SignatureValueFirmaFactura", invoice.hashFix      , toStrTruncate100],
        ]);
    }
    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");
    addSoftwareInfo(xml, software);
    if (!("serie" in invoice.id)) {
        querySelectorAll(xml, "SerieFactura").forEach(removeElement);
    }

    if (invoice.issuedBy) {
        selectorsToValues = selectorsToValues.concat([
            ["EmitidaPorTercerosODestinatario", invoice.issuedBy, toString],
        ]);
    } else {
        querySelectorAll(xml, "EmitidaPorTercerosODestinatario").forEach(removeElement);
    }

    // prettier-ignore
    if (previousId) {
        selectorsToValues = selectorsToValues.concat([
        ["SerieFacturaAnterior"                  , previousId.serie        , toStr20],
        ["NumFacturaAnterior"                    , previousId.number       , toStr20],
        ["FechaExpedicionFacturaAnterior"        , previousId.issuedTime   , toDateString],
        ["SignatureValueFirmaFacturaAnterior"    , previousId.hash         , toStrTruncate100],
        ]);
    } else {
        querySelectorAll(xml, 'EncadenamientoFacturaAnterior').forEach(removeElement);
    }

    // Check merchandiseOrService when recipient is foreigner, RecipientOther
    const invoiceLines: Array<InvoiceLine> = invoice.lines || [];
    const vatLines: Array<VatLine> = invoice.vatLines || [];
    if (invoice.recipient && invoice.recipient.country != "ES") {
        for (const invoiceLine of invoiceLines) {
            if (!invoiceLine.merchandiseOrService) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_MERCH_SERVICE_FOREIGNERS,
                    TbaiErrorCodes.ERR_MERCH_SERVICE_FOREIGNERS
                );
            }
        }
        for (const vatLine of vatLines) {
            if (!vatLine.merchandiseOrService) {
                throw new TbaiError(
                    TbaiErrorMessages.ERR_MERCH_SERVICE_FOREIGNERS,
                    TbaiErrorCodes.ERR_MERCH_SERVICE_FOREIGNERS
                );
            }
        }
    }
    addRecipient(xml, invoice.recipient);
    if (!invoice.simple) {
        querySelectorAll(xml, "FacturaSimplificada").forEach(removeElement);
    }
    // prettier-ignore
    if (options.deviceId) {
        selectorsToValues = selectorsToValues.concat([
        ["NumSerieDispositivo"                   , options.deviceId        , toStr30],
        ]);
    } else {
        querySelectorAll(xml, 'NumSerieDispositivo').forEach(removeElement);
    }
    updateDocument(xml, selectorsToValues);
    // vat lines
    const vatBreakdownNode = querySelector(xml, "TipoDesglose");
    if (vatBreakdownNode && isSpanishVatBreakdown(invoice.recipient)) {
        addSpanishVatBreakdown(xml, vatBreakdownNode, vatLinesFull);
    } else if (vatBreakdownNode) {
        addNonSpanishVatBreakdown(xml, vatBreakdownNode, vatLinesFull);
    } else {
        throw new TbaiError(
            TbaiErrorMessages.ERR_TIPO_DESGLOSE_REQUIRED,
            TbaiErrorCodes.ERR_TIPO_DESGLOSE_REQUIRED
        );
    }
    if (!(invoice.replacesTicket || invoice.creditNote)) {
        querySelectorAll(xml, "FacturasRectificadasSustituidas").forEach(removeElement);
    }
    if (!invoice.replacesTicket) {
        querySelectorAll(xml, "FacturaEmitidaSustitucionSimplificada").forEach(removeElement);
    } else {
        if (invoice.replacedTicketIds) {
            const invoicesNode = querySelector(xml, "FacturasRectificadasSustituidas");
            for (const id of invoice.replacedTicketIds) {
                addRectifiedReplacedInvoices(xml, invoicesNode, id);
            }
        }
    }
    addCreditNote(xml, invoice.creditNote);

    // detail lines
    if (linesFull.length > INVOICE_LINES_MAX) {
        throw new TbaiError(TbaiErrorMessages.ERR_1000_LINE_MAX, TbaiErrorCodes.ERR_1000_LINE_MAX);
    }
    if (linesFull.length > 0) {
        const linesNode = querySelector(xml, "DetallesFactura");
        if (!linesNode) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_MISSING_DETALLES_FACTURA,
                TbaiErrorCodes.ERR_MISSING_DETALLES_FACTURA
            );
        }
        for (const line of linesFull) {
            addLineNode(xml, linesNode, line);
        }
    } else {
        querySelectorAll(xml, "DetallesFactura").forEach(removeElement);
    }
    // vat keys
    const vatKeys: Array<VatKey> = invoiceFull.vatKeys;
    const vatKeysNode = querySelector(xml, "Claves");
    if (!vatKeysNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_CLAVES,
            TbaiErrorCodes.ERR_MISSING_CLAVES
        );
    }
    for (const vatKey of vatKeys) {
        addVatKeyNode(xml, vatKeysNode, vatKey);
    }

    return xml;
}

export function toXmlDocument(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    taxAgency: TaxAgency,
    options?: ToXmlOptions
): XMLDocument {
    let xmlBase;
    if (invoice.isFix) {
        xmlBase = FIX_TBAI_XML_BASE;
        if (taxAgency == 1) {
            throw new TbaiError(
                TbaiErrorMessages.ERR_IS_FIX_BIZKAIA,
                TbaiErrorCodes.ERR_IS_FIX_BIZKAIA
            );
        }
    } else {
        xmlBase = TBAI_XML_BASE;
    }
    return toXmlDocumentInner(invoice, previousId, software, taxAgency, xmlBase, options);
}

export function cancelInvoiceToXml(
    invoice: CancelInvoice,
    software: Software,
    options?: ToXmlOptions
): string {
    const xml = cancelInvoiceToXmlDocument(invoice, software, options);
    return new XMLSerializer().serializeToString(xml);
}

export function toXml(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    taxAgency: TaxAgency,
    options?: ToXmlOptions
): string {
    const xml = toXmlDocument(invoice, previousId, software, taxAgency, options);
    return new XMLSerializer().serializeToString(xml);
}
