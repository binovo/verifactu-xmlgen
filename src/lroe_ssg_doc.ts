import "regenerator-runtime/runtime";
import { querySelectorAll } from "./xmldom";
import { updateDocument, removeElement, toStr20 } from "./utils";
import { Invoice } from "./tbai_doc_types";
import { CancelInvoice } from "./lroe_doc_types";
export type { Invoice } from "./tbai_doc_types";
export type { CancelInvoice } from "./lroe_doc_types";
import { toXmlDocumentInner } from "./tbai_doc";
import { LroeModel } from "./lroe_doc";
import { FormatAndValidationFunction, SimpleType, toDateString } from "./to_string";

export interface ToXmlOptions {
    model: LroeModel;
    roundTaxGlobally?: boolean;
    g5015?: number;
    g5016?: boolean;
    g1177?: boolean;
}

const SOFTWARE = {
    license: "LICENSE",
    developerIrsId: "ESX0000000X",
    name: "TBAI",
    version: "0",
};

const LROE_XML_BASE = `
<FacturaEmitida>
    <Destinatarios/>
    <EmitidaPorTercerosODestinatario/>
    <CabeceraFactura>
        <SerieFactura>????</SerieFactura>
        <NumFactura>????</NumFactura>
        <FechaExpedicionFactura>????</FechaExpedicionFactura>
        <FacturaSimplificada>S</FacturaSimplificada>
        <FacturaEmitidaSustitucionSimplificada>S</FacturaEmitidaSustitucionSimplificada>
        <FacturaRectificativa/>
        <FacturasRectificadasSustituidas/>
    </CabeceraFactura>
    <DatosFactura>
        <FechaOperacion>????</FechaOperacion>
        <DescripcionFactura>????</DescripcionFactura>
        <ImporteTotalFactura>????</ImporteTotalFactura>
        <RetencionSoportada>????</RetencionSoportada>
        <Claves></Claves>
    </DatosFactura>
    <TipoDesglose/>
    <Software>
        <LicenciaTBAI>????</LicenciaTBAI>
        <EntidadDesarrolladora/>
        <Nombre>????</Nombre>
        <Version>????</Version>
    </Software>
</FacturaEmitida>`;

const LROE_CANCEL_XML_BASE = `
<FacturaEmitida>
    <IDFactura>
        <SerieFactura>????</SerieFactura>
        <NumFactura>????</NumFactura>
        <FechaExpedicionFactura>????</FechaExpedicionFactura>
    </IDFactura>
</FacturaEmitida>`;

export function toXmlDocument(invoice: Invoice, options: ToXmlOptions): XMLDocument {
    const xml = toXmlDocumentInner(invoice, null, SOFTWARE, 1, LROE_XML_BASE, options);
    querySelectorAll(xml, "Direccion").forEach(removeElement);
    querySelectorAll(xml, "Software").forEach(removeElement);
    querySelectorAll(xml, "DetalleNoSujeta>Causa").forEach((node) => {
        if (node.parentNode) {
            const reasonNode = xml.createElement("CausaNoSujecion");
            reasonNode.textContent = node.textContent;
            node.parentNode.replaceChild(reasonNode, node);
        }
    });
    return xml;
}

export function cancelInvoiceToXmlDocument(
    invoice: CancelInvoice,
    options: ToXmlOptions
): XMLDocument {
    const xml = new DOMParser().parseFromString(LROE_CANCEL_XML_BASE, "application/xml");
    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["SerieFactura"          , invoice.id.serie        , toStr20],
        ["NumFactura"            , invoice.id.number       , toStr20],
        ["FechaExpedicionFactura", invoice.id.issuedTime   , toDateString],
    ];
    if (!("serie" in invoice.id)) {
        querySelectorAll(xml, "SerieFactura").forEach(removeElement);
    }
    querySelectorAll(xml, "ApellidosNombreRazonSocial").forEach(removeElement);
    updateDocument(xml, selectorsToValues);
    return xml;
}

export function cancelInvoiceToXml(invoice: CancelInvoice, options: ToXmlOptions): string {
    const xml = cancelInvoiceToXmlDocument(invoice, options);
    return new XMLSerializer().serializeToString(xml);
}

export function toXml(invoice: Invoice, options: ToXmlOptions): string {
    const xml = toXmlDocument(invoice, options);
    return new XMLSerializer().serializeToString(xml);
}
