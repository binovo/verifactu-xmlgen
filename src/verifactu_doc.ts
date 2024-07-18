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
    toStrTruncate100,
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
    IrsIdType,
    IssuedBy,
    Issuer,
    PreviousInvoiceId,
    Partner,
    PartnerIrs,
    PartnerOther,
    VatLine,
    VatExemptReason,
    VatType,
} from "./verifactu_doc_types";

export type {
    CancelInvoice,
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

export interface ToXmlOptions {
    deviceId?: string;
}

const NS1 = `xmlns:sum="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd"`;
const NS2 = `xmlns="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd"`;

const VERIFACTU_CANCEL_OUT_INVOICE_XML_BASE = `
<sum:RegistroFactura ${NS1} ${NS2}>
    <sum:RegistroAnulacion>
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
    </sum:RegistroAnulacion>
</sum:RegistroFactura>`
    .replace(/>\s+</g, "><")
    .replace(/\s*xmlns/g, " xmlns");

const VERIFACTU_OUT_INVOICE_XML_BASE = `
<sum:RegistroFactura ${NS1} ${NS2}>
    <sum:RegistroAlta>
        <IDVersion>1.0</IDVersion>
        <IDFactura>
            <IDEmisorFactura>????</IDEmisorFactura>
            <NumSerieFactura>????</NumSerieFactura>
            <FechaExpedicionFactura>????</FechaExpedicionFactura>
        </IDFactura>
        <NombreRazonEmisor>????</NombreRazonEmisor>
        <TipoFactura>F1</TipoFactura>
        <TipoRectificativa/>
        <FacturasRectificadas/>
        <ImporteRectificacion/>
        <FechaOperacion/>
        <DescripcionOperacion>????</DescripcionOperacion>
        <FacturaSimplificadaArt7273>S</FacturaSimplificadaArt7273>
        <EmitidaPorTerceroODestinatario>????</EmitidaPorTerceroODestinatario>
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
    </sum:RegistroAlta>
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

function addRecipient(xml: Document, recipient?: Partner): void {
    if (!recipient) {
        querySelectorAll(xml, "Destinatarios").forEach(removeElement);
        return;
    }
    if (recipient.idType) {
        addRecipientOther(xml, recipient as PartnerOther);
    } else {
        addRecipientIrs(xml, recipient as PartnerIrs);
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
            <ImporteRectificacion>
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
        const parentNode = querySelector(xml, "sum:RegistroFacturacion");
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
            ['ClaveRegimen'                 , vatLine.vatKey , toStr2],
            ['CalificacionOperacion'        , vatOp          , toStr2],
            ['OperacionExenta'              , vatEx          , toStr2],
            ['TipoImpositivo'               , vatLine.rate   , round2ToString],
            ['BaseImponibleOimporteNoSujeto', vatLine.base   , round2ToString],
            ['CuotaRepercutida'             , vatLine.amount , round2ToString],
            ['TipoRecargoEquivalencia'      , vatLine.rate2  , round2ToString],
            ['CuotaRecargoEquivalencia'     , vatLine.amount2, round2ToString],
        ]);
        parentNode.appendChild(newXml.documentElement);
    }
}

function addSoftwareInfo(xml: Document, software: Software): void {
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["SistemaInformatico>NombreRazon"                , software.developerName   , toStr120],
        ["SistemaInformatico>NIF"                        , software.developerIrsId  , toNifStr],
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
    // prettier-ignore
    if (issuedBy) {
        const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
            ["EmitidaPorTerceroODestinatario", issuedBy.type, toString],
        ];
        updateDocument(xml, selectorsToValues);
    } else {
        querySelectorAll(xml, "EmitidaPorTerceroODestinatario").forEach(removeElement);
    }
}

async function toSHA256(data: string): Promise<string> {
    const message = toString(data);
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex.toUpperCase();
}

function buildInvoiceHash(invoice: Invoice, previousHash: string): string {
    return [
        `IDEmisorFactura=${invoice.issuer.irsId}`,
        `NumSerieFactura=${invoice.id.number}`,
        `FechaExpedicionFactura=${invoice.id.issuedTime}`,
        `TipoFactura=${invoice.type}`,
        `CuotaTotal=${invoice.amount}`,
        `ImporteTotal=${invoice.total}`,
        `Huella=${previousHash}`,
        `FechaHoraHusoGenRegistro=${invoice.id.issuedTime.toISOString()}`,
    ].join("&");
}

function buildCancelInvoiceHash(invoice: CancelInvoice, previousHash: string): string {
    return [
        `IDEmisorFacturaAnulada=${invoice.issuer.irsId}`,
        `NumSerieFacturaAnulada=${invoice.id.number}`,
        `FechaExpedicionFacturaAnulada=${invoice.id.issuedTime}`,
        `Huella=${previousHash}`,
        `FechaHoraHusoGenRegistro=${invoice.id.issuedTime.toISOString()}`,
    ].join("&");
}

async function addHash(
    xml: Document,
    invoice: Invoice | CancelInvoice,
    previousId: PreviousInvoiceId | null
): Promise<void> {
    const previousHash = previousId ? previousId.hash : "";
    const hashText =
        "type" in invoice
            ? buildInvoiceHash(invoice, previousHash)
            : buildCancelInvoiceHash(invoice, previousHash);
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

    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["IDFactura>IDEmisorFacturaAnulada"       , invoice.issuer.irsId      , toNifStr],
        ["IDFactura>NumSerieFacturaAnulada"       , invoice.id.number         , toStr60],
        ["IDFactura>FechaExpedicionFacturaAnulada", invoice.id.issuedTime     , toDateString],
        ["FechaHoraHusoGenRegistro"               , invoice.id.issuedTime.toISOString(), toStr30],
    ];
    updateDocument(xml, selectorsToValues);

    addIssuedBy(xml, invoice.issuedBy || null);
    addPreviousInvoiceInfo(xml, previousId);
    addSoftwareInfo(xml, software);
    await addHash(xml, invoice, previousId);

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

    verifactuValidations.ensureCreateInvoiceValidations(invoice, software);

    const description: InvoiceDescription = invoice.description || {
        text: "/",
        operationDate: new Date(invoice.id.issuedTime),
    };

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
        ["FechaHoraHusoGenRegistro"        , invoice.id.issuedTime.toISOString(), toStr30],
    ];
    updateDocument(xml, selectorsToValues);

    if (!invoice.simple) {
        querySelectorAll(xml, "FacturaSimplificadaArt7273").forEach(removeElement);
    }

    addIssuedBy(xml, invoice.issuedBy || null);
    addRecipient(xml, invoice.recipient);
    addVatBreakdown(xml, invoice.vatLines);
    addCreditNote(xml, invoice.issuer, invoice.creditNote);
    addPreviousInvoiceInfo(xml, previousId);
    addSoftwareInfo(xml, software);
    await addHash(xml, invoice, previousId);

    return xml;
}

export async function cancelInvoiceToXml(
    invoice: CancelInvoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<string> {
    const xml = await cancelInvoiceToXmlDocument(invoice, previousId, software, options);
    return new XMLSerializer().serializeToString(xml);
}

export async function toXml(
    invoice: Invoice,
    previousId: PreviousInvoiceId | null,
    software: Software,
    options?: ToXmlOptions
): Promise<string> {
    const xml = await toXmlDocument(invoice, previousId, software, options);
    return new XMLSerializer().serializeToString(xml);
}
