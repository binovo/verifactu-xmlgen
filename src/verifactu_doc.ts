import "regenerator-runtime/runtime";
import { querySelector, querySelectorAll } from "./xmldom";
import { isVatExemptReason } from "./verifactu_doc_types.guard";
import {
    updateDocument,
    removeElement,
    toStr2,
    toStr20,
    toStr30,
    toStr50,
    toStr60,
    toStr64,
    toStr100,
    toStr120,
    toStr500,
    toNifStr,
} from "./utils";
import {
    FormatAndValidationFunction,
    round2ToString,
    SimpleType,
    toDateString,
    toString,
    toBooleanString,
} from "./to_string";

import {
    CancelInvoice,
    CreditNoteType,
    CountryCode,
    Invoice,
    InvoiceDescription,
    InvoiceId,
    InvoiceType,
    IrsIdType,
    IssuedBy,
    Issuer,
    PreviousInvoiceId,
    Partner,
    PartnerIrs,
    PartnerOther,
    VatLine,
} from "./verifactu_doc_types";

export type {
    CancelInvoice,
    ChainedCancelInvoice,
    ChainedInvoice,
    CountryCode,
    CreditNoteType,
    Invoice,
    InvoiceDescription,
    InvoiceDescriptionJson,
    InvoiceId,
    IrsIdType,
    IssuedBy,
    PreviousInvoiceId,
    Partner,
    PartnerIrs,
    PartnerOther,
    VatLine,
} from "./verifactu_doc_types";

import * as verifactuValidations from "./verifactu_validations";
import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

export interface SoftwareIdInfo {
    idType: IrsIdType;
    country: CountryCode;
}

export interface Software {
    name: string; // NombreSistemaInformatico
    developerName: string; // NombreRazon
    developerIrsId: string; // NIF
    idInfo?: SoftwareIdInfo; // IDOtro
    id: string; // IdSistemaInformatico
    version: string; // Version
    number: string; // NumeroInstalacion
    useOnlyVerifactu: boolean; // TipoUsoPosibleSoloVerifactu
    useMulti: boolean; // TipoUsoPosibleMultiOT
    useCurrentMulti: boolean; // IndicadorMultiplesOT
}

const NIF_COUNTRY_CODE_LEN = 2;
// prune possible country code from NIF and validate.
function toShortNifStr(nif: string): string {
    if (nif.slice(0, NIF_COUNTRY_CODE_LEN) == "ES") {
        return toNifStr(nif.slice(NIF_COUNTRY_CODE_LEN));
    } else {
        return nif;
    }
}

export interface ToXmlOptions {
    deviceId?: string;
    disableRatesValidation?: boolean;
}

const NS1 = `xmlns:sum="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd"`;
const NS2 = `xmlns="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd"`;

const VERIFACTU_CANCEL_OUT_INVOICE_XML_BASE = `
<sum:RegistroFactura ${NS1} ${NS2}>
    <RegistroAnulacion>
        <IDVersion>1.0</IDVersion>
        <IDFactura>
            <IDEmisorFacturaAnulada>???</IDEmisorFacturaAnulada>
            <NumSerieFacturaAnulada>????</NumSerieFacturaAnulada>
            <FechaExpedicionFacturaAnulada>????</FechaExpedicionFacturaAnulada>
        </IDFactura>
        <Encadenamiento>
            <PrimerRegistro>S</PrimerRegistro>
            <RegistroAnterior>
                <IDEmisorFactura>????</IDEmisorFactura>
                <NumSerieFactura>????</NumSerieFactura>
                <FechaExpedicionFactura>????</FechaExpedicionFactura>
                <Huella>????</Huella>
            </RegistroAnterior>
        </Encadenamiento>
        <SistemaInformatico>
            <NombreRazon>????</NombreRazon>
            <NIF>????</NIF>
            <NombreSistemaInformatico>????</NombreSistemaInformatico>
            <IdSistemaInformatico>????</IdSistemaInformatico>
            <Version>????</Version>
            <NumeroInstalacion>????</NumeroInstalacion>
            <TipoUsoPosibleSoloVerifactu>????</TipoUsoPosibleSoloVerifactu>
            <TipoUsoPosibleMultiOT>????</TipoUsoPosibleMultiOT>
            <IndicadorMultiplesOT>????</IndicadorMultiplesOT>
        </SistemaInformatico>
        <FechaHoraHusoGenRegistro>????</FechaHoraHusoGenRegistro>
        <TipoHuella>01</TipoHuella>
        <Huella>????</Huella>
    </RegistroAnulacion>
</sum:RegistroFactura>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

const VERIFACTU_OUT_INVOICE_XML_BASE = `
<sum:RegistroFactura ${NS1} ${NS2}>
    <RegistroAlta>
        <IDVersion>1.0</IDVersion>
        <IDFactura>
            <IDEmisorFactura>????</IDEmisorFactura>
            <NumSerieFactura>????</NumSerieFactura>
            <FechaExpedicionFactura>????</FechaExpedicionFactura>
        </IDFactura>
        <NombreRazonEmisor>????</NombreRazonEmisor>
        <Subsanacion>S</Subsanacion>
        <RechazoPrevio>X</RechazoPrevio>
        <TipoFactura>F1</TipoFactura>
        <TipoRectificativa/>
        <FacturasRectificadas/>
        <FacturasSustituidas/>
        <ImporteRectificacion/>
        <FechaOperacion/>
        <DescripcionOperacion>????</DescripcionOperacion>
        <EmitidaPorTerceroODestinatario>????</EmitidaPorTerceroODestinatario>
        <Tercero>
            <NombreRazon>????</NombreRazon>
            <NIF>????</NIF>
        </Tercero>
        <Destinatarios/>
        <Desglose/>
        <CuotaTotal>????</CuotaTotal>
        <ImporteTotal>????</ImporteTotal>
        <Encadenamiento>
            <PrimerRegistro>S</PrimerRegistro>
            <RegistroAnterior>
                <IDEmisorFactura>????</IDEmisorFactura>
                <NumSerieFactura>????</NumSerieFactura>
                <FechaExpedicionFactura>????</FechaExpedicionFactura>
                <Huella>????</Huella>
            </RegistroAnterior>
        </Encadenamiento>
        <SistemaInformatico>
            <NombreRazon>????</NombreRazon>
            <NIF>????</NIF>
            <NombreSistemaInformatico>????</NombreSistemaInformatico>
            <IdSistemaInformatico>????</IdSistemaInformatico>
            <Version>????</Version>
            <NumeroInstalacion>????</NumeroInstalacion>
            <TipoUsoPosibleSoloVerifactu>????</TipoUsoPosibleSoloVerifactu>
            <TipoUsoPosibleMultiOT>????</TipoUsoPosibleMultiOT>
            <IndicadorMultiplesOT>????</IndicadorMultiplesOT>
        </SistemaInformatico>
        <FechaHoraHusoGenRegistro>????</FechaHoraHusoGenRegistro>
        <TipoHuella>01</TipoHuella>
        <Huella>????</Huella>
    </RegistroAlta>
</sum:RegistroFactura>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

function addRecipientIrs(xml: Document, recipient: PartnerIrs): void {
    const tpl = `
<IDDestinatario ${NS2}>
    <NombreRazon/>
    <NIF/>
</IDDestinatario>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // prettier-ignore
    updateDocument(newXml, [
        ['NombreRazon', recipient.name  , toStr120],
        ['NIF'        , recipient.irsId , toNifStr],
    ]);
    const parentNode = querySelector(xml, "Destinatarios");
    if (!parentNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_DESTINATARIOS,
            TbaiErrorCodes.ERR_MISSING_DESTINATARIOS
        );
    }
    parentNode.appendChild(newXml.documentElement);
}

function addRecipientOther(xml: Document, recipient: PartnerOther): void {
    const tpl = `
<IDDestinatario ${NS2}>
    <NombreRazon/>
    <IDOtro>
        <CodigoPais/>
        <IDType/>
        <ID/>
    </IDOtro>
</IDDestinatario>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    function _getCountry(): CountryCode | undefined {
        if (recipient.idType == "02") {
            return undefined;
        } else {
            return recipient.country;
        }
    }
    // prettier-ignore
    updateDocument(newXml, [
        ["NombreRazon"               , recipient.name   , toStr120],
        ["IDOtro>CodigoPais"         , _getCountry()    , toStr2],
        ["IDOtro>IDType"             , recipient.idType , toStr2],
        ["IDOtro>ID"                 , recipient.id     , toStr20],
    ]);
    const parentNode = querySelector(xml, "Destinatarios");
    if (!parentNode) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_MISSING_DESTINATARIOS,
            TbaiErrorCodes.ERR_MISSING_DESTINATARIOS
        );
    }
    parentNode.appendChild(newXml.documentElement);
}

function addRecipient(xml: Document, invoiceType: InvoiceType, recipient?: Partner): void {
    if (!recipient || ["F2", "R5"].includes(invoiceType)) {
        querySelectorAll(xml, "Destinatarios").forEach(removeElement);
        return;
    }
    if (recipient.idType) {
        addRecipientOther(xml, recipient as PartnerOther);
    } else {
        addRecipientIrs(xml, recipient as PartnerIrs);
    }
}

function addReplacedTickets(
    xml: Document,
    issuer: Issuer,
    replacedTicketIds?: Array<InvoiceId>
): void {
    if (!replacedTicketIds) {
        querySelectorAll(xml, "FacturasSustituidas").forEach(removeElement);
        return;
    }
    const invoicesNode = querySelector(xml, "FacturasSustituidas");
    const ctpl = `
        <IDFacturaSustituida ${NS2}>
            <IDEmisorFactura/>
            <NumSerieFactura/>
            <FechaExpedicionFactura/>
        </IDFacturaSustituida>
    `.replace(/>\s+</g, "><");
    for (const id of replacedTicketIds) {
        const childXml = new DOMParser().parseFromString(ctpl, "application/xml");
        // prettier-ignore
        updateDocument(childXml, [
                ['IDFacturaSustituida>IDEmisorFactura'       , issuer.irsId  , toNifStr],
                ['IDFacturaSustituida>NumSerieFactura'       , id.number     , toStr60],
                ['IDFacturaSustituida>FechaExpedicionFactura', id.issuedTime , toDateString],
            ]);
        invoicesNode.appendChild(childXml.documentElement);
    }
}

function addCreditNote(xml: Document, issuer: Issuer, creditNote?: CreditNoteType): void {
    if (!creditNote) {
        querySelectorAll(xml, "TipoRectificativa").forEach(removeElement);
        querySelectorAll(xml, "FacturasRectificadas").forEach(removeElement);
        querySelectorAll(xml, "ImporteRectificacion").forEach(removeElement);
        return;
    }

    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["TipoRectificativa", creditNote.style, toString],
    ];
    updateDocument(xml, selectorsToValues);

    if (creditNote.style == "I") {
        querySelectorAll(xml, "ImporteRectificacion").forEach(removeElement);
    } else {
        const tpl = `
            <ImporteRectificacion ${NS2}>
                <BaseRectificada>????</BaseRectificada>
                <CuotaRectificada>????</CuotaRectificada>
                <CuotaRecargoRectificado>????</CuotaRecargoRectificado>
            </ImporteRectificacion>
        `.replace(/>\s+</g, "><");
        const newXml = new DOMParser().parseFromString(tpl, "application/xml");
        // prettier-ignore
        updateDocument(newXml, [
            ['ImporteRectificacion>BaseRectificada'        , creditNote.creditBase     , round2ToString],
            ['ImporteRectificacion>CuotaRectificada'       , creditNote.creditVat      , round2ToString],
            ['ImporteRectificacion>CuotaRecargoRectificado', creditNote.creditRecharge , round2ToString],
        ]);
        const parentNode = querySelector(xml, "RegistroAlta");
        const oldChild = querySelector(xml, "ImporteRectificacion");
        parentNode.replaceChild(newXml.documentElement, oldChild);
    }

    const invoicesNode = querySelector(xml, "FacturasRectificadas");
    const ctpl = `
        <IDFacturaRectificada ${NS2}>
            <IDEmisorFactura/>
            <NumSerieFactura/>
            <FechaExpedicionFactura/>
        </IDFacturaRectificada>
    `.replace(/>\s+</g, "><");
    for (const id of creditNote.ids) {
        const childXml = new DOMParser().parseFromString(ctpl, "application/xml");
        // prettier-ignore
        updateDocument(childXml, [
                ['IDFacturaRectificada>IDEmisorFactura'       , issuer.irsId  , toNifStr],
                ['IDFacturaRectificada>NumSerieFactura'       , id.number     , toStr60],
                ['IDFacturaRectificada>FechaExpedicionFactura', id.issuedTime , toDateString],
            ]);
        invoicesNode.appendChild(childXml.documentElement);
    }
}

function addVatBreakdown(xml: Document, vatLines: Array<VatLine>): void {
    const parentNode = querySelector(xml, "Desglose");
    const tpl = `
<DetalleDesglose ${NS2}>
    <Impuesto/>
    <ClaveRegimen/>
    <CalificacionOperacion/>
    <OperacionExenta/>
    <TipoImpositivo/>
    <BaseImponibleOimporteNoSujeto/>
    <CuotaRepercutida/>
    <TipoRecargoEquivalencia/>
    <CuotaRecargoEquivalencia/>
</DetalleDesglose>
    `.replace(/>\s+</g, "><");

    for (const vatLine of vatLines) {
        const newXml = new DOMParser().parseFromString(tpl, "application/xml");
        let vatOp = undefined;
        let vatEx = undefined;
        if (isVatExemptReason(vatLine.vatOperation)) {
            vatEx = vatLine.vatOperation;
        } else {
            vatOp = vatLine.vatOperation;
        }
        // prettier-ignore
        updateDocument(newXml, [
            ['Impuesto'                     , vatLine.tax    , toStr2],
            ['ClaveRegimen'                 , vatLine.vatKey , toStr2],
            ['CalificacionOperacion'        , vatOp          , toStr2],
            ['OperacionExenta'              , vatEx          , toStr2],
            ['TipoImpositivo'               , vatLine.rate   , round2ToString],
            ['BaseImponibleOimporteNoSujeto', vatLine.base   , round2ToString],
            ['CuotaRepercutida'             , vatLine.amount , round2ToString],
            ['TipoRecargoEquivalencia'      , vatLine.rate2  , round2ToString],
            ['CuotaRecargoEquivalencia'     , vatLine.amount2, round2ToString],
        ]);
        if (
            isVatExemptReason(vatLine.vatOperation) ||
            ["N1", "N2"].includes(vatLine.vatOperation)
        ) {
            if (vatLine.vatKey != "17" && vatLine.tax != "03") {
                querySelectorAll(newXml, "TipoImpositivo").forEach(removeElement);
                querySelectorAll(newXml, "CuotaRepercutida").forEach(removeElement);
            }
            querySelectorAll(newXml, "TipoRecargoEquivalencia").forEach(removeElement);
            querySelectorAll(newXml, "CuotaRecargoEquivalencia").forEach(removeElement);
        }
        if (vatLine.tax && ["02", "05"].includes(vatLine.tax)) {
            querySelectorAll(newXml, "ClaveRegimen").forEach(removeElement);
        }
        parentNode.appendChild(newXml.documentElement);
    }
}

function addSoftwareInfo(xml: Document, software: Software): void {
    const developerNif = toShortNifStr(software.developerIrsId);
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["SistemaInformatico>NombreRazon"                , software.developerName   , toStr120],
        ["SistemaInformatico>NIF"                        , developerNif             , toStr20],
        ["SistemaInformatico>NombreSistemaInformatico"   , software.name            , toStr30],
        ["SistemaInformatico>IdSistemaInformatico"       , software.id              , toStr2],
        ["SistemaInformatico>Version"                    , software.version         , toStr50],
        ["SistemaInformatico>NumeroInstalacion"          , software.number          , toStr100],
        ["SistemaInformatico>TipoUsoPosibleSoloVerifactu", software.useOnlyVerifactu, toBooleanString],
        ["SistemaInformatico>TipoUsoPosibleMultiOT"      , software.useMulti        , toBooleanString],
        ["SistemaInformatico>IndicadorMultiplesOT"       , software.useCurrentMulti , toBooleanString],
    ];
    updateDocument(xml, selectorsToValues);

    const parentNode = querySelector(xml, "SistemaInformatico");
    if (software.idInfo) {
        const tpl = `
            <IDOtro>
                <CodigoPais/>
                <IDType/>
                <ID/>
            </IDOtro>
        `.replace(/>\s+</g, "><");
        const otherIdXml = new DOMParser().parseFromString(tpl, "application/xml");
        const idInfo = software.idInfo;
        const oldChild = querySelector(xml, "NIF");
        // prettier-ignore
        updateDocument(otherIdXml, [
            ["CodigoPais", idInfo.country        , toStr2],
            ["IDType"    , idInfo.idType         , toStr2],
            ["ID"        , software.developerIrsId, toStr20]
        ]);
        parentNode.replaceChild(otherIdXml.documentElement, oldChild);
    }
}

function addPreviousInvoiceInfo(xml: Document, previousId: PreviousInvoiceId | null): void {
    // prettier-ignore
    if (previousId) {
        querySelectorAll(xml, 'PrimerRegistro').forEach(removeElement);
        const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
            ["RegistroAnterior>IDEmisorFactura"       , previousId.issuerIrsId  , toNifStr],
            ["RegistroAnterior>NumSerieFactura"       , previousId.number       , toStr60],
            ["RegistroAnterior>FechaExpedicionFactura", previousId.issuedTime   , toDateString],
            ["RegistroAnterior>Huella"                , previousId.hash         , toStr64],
        ];
        updateDocument(xml, selectorsToValues);
    } else {
        querySelectorAll(xml, 'RegistroAnterior').forEach(removeElement);
    }
}

function addIssuedBy(xml: Document, issuedBy: IssuedBy | null): void {
    if (issuedBy) {
        // prettier-ignore
        const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
            ["EmitidaPorTerceroODestinatario", issuedBy.type        , toString],
        ];
        updateDocument(xml, selectorsToValues);
        if (issuedBy.type == "T" && issuedBy.issuer) {
            const selectorsToValues2: Array<[string, SimpleType, FormatAndValidationFunction]> = [
                ["Tercero>NombreRazon", issuedBy.issuer.name, toStr120],
            ];
            updateDocument(xml, selectorsToValues2);
            if (issuedBy.issuer.idType === undefined) {
                const issuer = issuedBy.issuer as PartnerIrs;
                // prettier-ignore
                const selectorsToValues3: Array<[string, SimpleType, FormatAndValidationFunction]> = [
                    ["Tercero>NIF", issuer.irsId, toNifStr],
                ];
                updateDocument(xml, selectorsToValues3);
            }
            const parentNode = querySelector(xml, "Tercero");
            if (issuedBy.issuer.idType) {
                const tpl = `
                    <IDOtro>
                        <CodigoPais/>
                        <IDType/>
                        <ID/>
                    </IDOtro>
                `.replace(/>\s+</g, "><");
                const otherIdXml = new DOMParser().parseFromString(tpl, "application/xml");
                const oldChild = querySelector(xml, "NIF");
                const issuer = issuedBy.issuer as PartnerOther;
                // prettier-ignore
                updateDocument(otherIdXml, [
                    ["CodigoPais", issuer.country, toStr2],
                    ["IDType"    , issuer.idType , toStr2],
                    ["ID"        , issuer.id     , toStr20]
                ]);
                parentNode.replaceChild(otherIdXml.documentElement, oldChild);
            }
        } else {
            querySelectorAll(xml, "Tercero").forEach(removeElement);
        }
    } else {
        querySelectorAll(xml, "EmitidaPorTerceroODestinatario").forEach(removeElement);
        querySelectorAll(xml, "Tercero").forEach(removeElement);
    }
}

async function toSHA256(data: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(data); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex.toUpperCase();
}

function buildInvoiceHash(invoice: Invoice, dateGenReg: string, previousHash: string): string {
    return [
        `IDEmisorFactura=${invoice.issuer.irsId}`,
        `NumSerieFactura=${invoice.id.number}`,
        `FechaExpedicionFactura=${toDateString(invoice.id.issuedTime)}`,
        `TipoFactura=${invoice.type}`,
        `CuotaTotal=${round2ToString(invoice.amount)}`,
        `ImporteTotal=${round2ToString(invoice.total)}`,
        `Huella=${previousHash}`,
        `FechaHoraHusoGenRegistro=${dateGenReg}`,
    ].join("&");
}

function buildCancelInvoiceHash(
    invoice: CancelInvoice,
    dateGenReg: string,
    previousHash: string
): string {
    return [
        `IDEmisorFacturaAnulada=${invoice.issuer.irsId}`,
        `NumSerieFacturaAnulada=${invoice.id.number}`,
        `FechaExpedicionFacturaAnulada=${toDateString(invoice.id.issuedTime)}`,
        `Huella=${previousHash}`,
        `FechaHoraHusoGenRegistro=${dateGenReg}`,
    ].join("&");
}

async function addHash(
    xml: Document,
    invoice: Invoice | CancelInvoice,
    dateGenReg: string,
    previousId: PreviousInvoiceId | null
): Promise<void> {
    const previousHash = previousId ? previousId.hash : "";
    const hashText =
        "type" in invoice
            ? buildInvoiceHash(invoice, dateGenReg, previousHash)
            : buildCancelInvoiceHash(invoice, dateGenReg, previousHash);
    const hash = await toSHA256(hashText);
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["Huella", hash, toString],
    ];
    updateDocument(xml, selectorsToValues);
}

export async function cancelInvoiceToXmlDocument(
    invoice: CancelInvoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<XMLDocument> {
    const xmlBase = VERIFACTU_CANCEL_OUT_INVOICE_XML_BASE;
    options = options || {};

    verifactuValidations.ensureCancelInvoiceValidations(invoice, software);

    const dateGenReg = new Date().toISOString();
    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["IDFactura>IDEmisorFacturaAnulada"       , invoice.issuer.irsId      , toNifStr],
        ["IDFactura>NumSerieFacturaAnulada"       , invoice.id.number         , toStr60],
        ["IDFactura>FechaExpedicionFacturaAnulada", invoice.id.issuedTime     , toDateString],
        ["FechaHoraHusoGenRegistro"               , dateGenReg, toStr30],
    ];
    updateDocument(xml, selectorsToValues);

    addIssuedBy(xml, invoice.issuedBy || null);
    addPreviousInvoiceInfo(xml, previousId);
    addSoftwareInfo(xml, software);
    await addHash(xml, invoice, dateGenReg, previousId);

    return xml;
}

export async function toXmlDocument(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<XMLDocument> {
    const xmlBase = VERIFACTU_OUT_INVOICE_XML_BASE;
    options = options || {};

    verifactuValidations.ensureCreateInvoiceValidations(invoice, software, options);

    const description: InvoiceDescription = invoice.description || {
        text: "/",
        operationDate: new Date(invoice.id.issuedTime),
    };

    const dateGenReg = new Date().toISOString();
    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["IDFactura>IDEmisorFactura"       , invoice.issuer.irsId      , toNifStr],
        ["IDFactura>NumSerieFactura"       , invoice.id.number         , toStr60],
        ["IDFactura>FechaExpedicionFactura", invoice.id.issuedTime     , toDateString],
        ["NombreRazonEmisor"               , invoice.issuer.name       , toStr120],
        ["TipoFactura"                     , invoice.type              , toStr2],
        ["FechaOperacion"                  , description.operationDate , toDateString],
        ["DescripcionOperacion"            , description.text          , toStr500],
        ["CuotaTotal"                      , invoice.amount            , round2ToString],
        ["ImporteTotal"                    , invoice.total             , round2ToString],
        ["FechaHoraHusoGenRegistro"        , dateGenReg                , toStr30],
    ];
    updateDocument(xml, selectorsToValues);

    if (!invoice.isFix) {
        querySelectorAll(xml, "Subsanacion").forEach(removeElement);
    }
    if (!invoice.previousRejection) {
        querySelectorAll(xml, "RechazoPrevio").forEach(removeElement);
    }

    addIssuedBy(xml, invoice.issuedBy || null);
    addRecipient(xml, invoice.type, invoice.recipient);
    addVatBreakdown(xml, invoice.vatLines);
    addCreditNote(xml, invoice.issuer, invoice.creditNote);
    addReplacedTickets(xml, invoice.issuer, invoice.replacedTicketIds);
    addPreviousInvoiceInfo(xml, previousId);
    addSoftwareInfo(xml, software);
    await addHash(xml, invoice, dateGenReg, previousId);

    return xml;
}

function getCleanedXml(xml: string) {
    const parts = xml.split(">");
    const header = parts[0];
    const body = parts.slice(1).join(">");
    const regex = /\sxmlns(?::\w+)?="[^"]*"/g;
    const cleanedBody = body.replace(regex, "");
    return `${header}>${cleanedBody}`;
}

export async function cancelInvoiceToXml(
    invoice: CancelInvoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<string> {
    const xml = await cancelInvoiceToXmlDocument(invoice, previousId, software, options);
    const xmlString = new XMLSerializer().serializeToString(xml);
    return getCleanedXml(xmlString);
}

export async function toXml(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<string> {
    const xml = await toXmlDocument(invoice, previousId, software, options);
    const xmlString = new XMLSerializer().serializeToString(xml);
    return getCleanedXml(xmlString);
}
