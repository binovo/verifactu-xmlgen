import "regenerator-runtime/runtime";
import { querySelector, querySelectorAll } from "./xmldom";
import {
    updateDocument,
    removeElement,
    toStr2,
    toStr7,
    toStr10,
    toStr15,
    toStr20,
    toStr60,
    toStr120,
    toStr250,
    toNifStr,
} from "./utils";
import {
    FormatAndValidationFunction,
    round2ToString,
    SimpleType,
    toDateString,
    toString,
} from "./to_string";

import {
    CancelInvoice,
    CreditNoteType,
    CountryCode,
    Invoice,
    InvoiceId,
    Issuer,
    IssuerIrs,
    IssuerOther,
    VatKey,
    VatDetail,
    VatLine,
    ExpenseVatLine,
    InfoTax,
} from "./lroe_doc_types";

export type {
    CancelInvoice,
    CountryCode,
    CreditNoteType,
    Invoice,
    InvoiceId,
    Issuer,
    IssuerIrs,
    IssuerOther,
    VatKey,
    VatDetail,
    VatLine,
    ExpenseVatLine,
    InfoTax,
} from "./lroe_doc_types";

import * as lroeValidations from "./lroe_validations";
import { TbaiError, TbaiErrorCodes, TbaiErrorMessages } from "./tbai_error";

export type LroeModel =
    | "240" // Persona Jurídica
    | "140"; // Persona Física

export interface ToXmlOptions {
    model: LroeModel;
}

const LROE_PURCHASE_XML_BASE = `
<EmisorFacturaRecibida/>
<CabeceraFactura>
    <SerieFactura>????</SerieFactura>
    <NumFactura>????</NumFactura>
    <NumFacturaFin>????</NumFacturaFin>
    <FechaExpedicionFactura>????</FechaExpedicionFactura>
    <FechaOperacion>????</FechaOperacion>
    <FechaRecepcion>????</FechaRecepcion>
    <TipoFactura>????</TipoFactura>
    <FacturaRectificativa/>
    <FacturasRectificadasSustituidas/>
</CabeceraFactura>
<DatosFactura>
    <DescripcionOperacion>????</DescripcionOperacion>
    <Claves/>
    <ImporteTotalFactura>????</ImporteTotalFactura>
    <BaseImponibleACoste>????</BaseImponibleACoste>
</DatosFactura>
<IVA/>
<OtraInformacionTrascendenciaTributaria/>`;

const LROE_PURCHASE_CANCEL_XML_BASE = `
<SerieFactura>????</SerieFactura>
<NumFactura>????</NumFactura>
<FechaExpedicionFactura>????</FechaExpedicionFactura>
<EmisorFacturaRecibida/>`;

function addIssuerIrs(xml: Document, parentNode: Node, issuer: IssuerIrs): void {
    const tpl = `
    <NIF/>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // prettier-ignore
    updateDocument(newXml, [
        ['NIF'                       , issuer.irsId , toNifStr],
    ]);
    parentNode.appendChild(newXml.documentElement);
}

function addIssuerOther(xml: Document, parentNode: Node, issuer: IssuerOther): void {
    const tpl = `
    <IDOtro>
        <CodigoPais/>
        <IDType/>
        <ID/>
    </IDOtro>
`.replace(/>\s+</g, "><");
    const newXml = new DOMParser().parseFromString(tpl, "application/xml");
    // si idType es 02 ignoremos el país y no lo incluimos en el XML
    function _getCountry(): CountryCode | undefined {
        if (issuer.idType == "02") {
            return undefined;
        } else {
            return issuer.country;
        }
    }
    // prettier-ignore
    updateDocument(newXml, [
        ["IDOtro>CodigoPais"         , _getCountry()    , toStr2],
        ["IDOtro>IDType"             , issuer.idType    , toStr2],
        ["IDOtro>ID"                 , issuer.id        , toStr20],
    ]);
    parentNode.appendChild(newXml.documentElement);
}

function addIssuer(xml: Document, issuer: Issuer): void {
    const parentNode = querySelector(xml, "EmisorFacturaRecibida");
    const nameNode = xml.createElement("ApellidosNombreRazonSocial");
    nameNode.textContent = toStr120(issuer.name);
    if (issuer.idType) {
        addIssuerOther(xml, parentNode, issuer as IssuerOther);
    } else {
        addIssuerIrs(xml, parentNode, issuer as IssuerIrs);
    }
    parentNode.appendChild(nameNode);
}

function addVatKeyNode(xml: Document, vatKeysNode: Node, vatKey: VatKey): void {
    const vatKeyNode = xml.createElement("IDClave"),
        opNode = xml.createElement("ClaveRegimenIvaOpTrascendencia");
    opNode.textContent = vatKey;
    vatKeysNode.appendChild(vatKeyNode);
    vatKeyNode.appendChild(opNode);
}

function add240VatLines(xml: Document, vatLinesNode: Node, vatLines: Array<VatLine>): void {
    for (const vatLine of vatLines) {
        const vatNode = xml.createElement("DetalleIVA"),
            baseNode = xml.createElement("BaseImponible"),
            purchaseExpenseNode = xml.createElement("CompraBienesCorrientesGastosBienesInversion"),
            investmentSubjectPassiveNode = xml.createElement("InversionSujetoPasivo");
        purchaseExpenseNode.textContent = vatLine.purchaseExpenseType;
        investmentSubjectPassiveNode.textContent = vatLine.investmentSubjectPassive ? "S" : "N";
        baseNode.textContent = round2ToString(vatLine.base);
        vatNode.appendChild(purchaseExpenseNode);
        vatNode.appendChild(investmentSubjectPassiveNode);
        vatNode.appendChild(baseNode);
        if (vatLine.rate !== undefined) {
            const rateNode = xml.createElement("TipoImpositivo");
            rateNode.textContent = round2ToString(vatLine.rate);
            vatNode.appendChild(rateNode);
        }
        if (vatLine.amount !== undefined) {
            const amountNode = xml.createElement("CuotaIVASoportada");
            amountNode.textContent = round2ToString(vatLine.amount);
            vatNode.appendChild(amountNode);
        }
        if (vatLine.deductible !== undefined) {
            const deductibleNode = xml.createElement("CuotaIVADeducible");
            deductibleNode.textContent = round2ToString(vatLine.deductible);
            vatNode.appendChild(deductibleNode);
        }
        if (vatLine.compensationPercent) {
            const compensationPercentNode = xml.createElement("PorcentajeCompensacionREAGYP");
            compensationPercentNode.textContent = round2ToString(vatLine.compensationPercent);
            vatNode.appendChild(compensationPercentNode);
        }
        if (vatLine.compensationAmount) {
            const compensationAmountNode = xml.createElement("ImporteCompensacionREAGYP");
            compensationAmountNode.textContent = round2ToString(vatLine.compensationAmount);
            vatNode.appendChild(compensationAmountNode);
        }
        vatLinesNode.appendChild(vatNode);
    }
}

function add140VatLines(xml: Document, vatLinesNode: Node, vatLines: Array<ExpenseVatLine>): void {
    for (const vatLine of vatLines) {
        const vatNode = xml.createElement("DetalleRentaIVA");

        const epigraphNode = xml.createElement("Epigrafe");
        epigraphNode.textContent = toStr7(vatLine.epigraph);
        vatNode.appendChild(epigraphNode);
        if (vatLine.goodAffection) {
            const goodAffectionNode = xml.createElement("BienAfectoIRPFYOIVA");
            goodAffectionNode.textContent = vatLine.goodAffection;
            vatNode.appendChild(goodAffectionNode);
        }
        if (vatLine.concept) {
            const conceptNode = xml.createElement("Concepto");
            conceptNode.textContent = vatLine.concept;
            vatNode.appendChild(conceptNode);
        }
        if (vatLine.reference) {
            const referenceNode = xml.createElement("ReferenciaBien");
            referenceNode.textContent = toStr10(vatLine.reference);
            vatNode.appendChild(referenceNode);
        }
        const investmentSubjectPassiveNode = xml.createElement("InversionSujetoPasivo");
        investmentSubjectPassiveNode.textContent = vatLine.investmentSubjectPassive ? "S" : "N";
        vatNode.appendChild(investmentSubjectPassiveNode);

        if (vatLine.isUsingSimplifiedRegime) {
            const isUsingSimplifiedRegimeNode = xml.createElement(
                "OperacionEnRecargoDeEquivalenciaORegimenSimplificado"
            );
            isUsingSimplifiedRegimeNode.textContent = vatLine.isUsingSimplifiedRegime;
            vatNode.appendChild(isUsingSimplifiedRegimeNode);
        }

        const baseNode = xml.createElement("BaseImponible");
        baseNode.textContent = round2ToString(vatLine.base);
        vatNode.appendChild(baseNode);

        if (vatLine.rate !== undefined) {
            const rateNode = xml.createElement("TipoImpositivo");
            rateNode.textContent = round2ToString(vatLine.rate);
            vatNode.appendChild(rateNode);
        }

        if (vatLine.amount !== undefined) {
            const amountNode = xml.createElement("CuotaIVASoportada");
            amountNode.textContent = round2ToString(vatLine.amount);
            vatNode.appendChild(amountNode);
        }

        if (vatLine.deductible !== undefined) {
            const deductibleNode = xml.createElement("CuotaIVADeducible");
            deductibleNode.textContent = round2ToString(vatLine.deductible);
            vatNode.appendChild(deductibleNode);
        }

        if (vatLine.rate2) {
            const amount2Node = xml.createElement("TipoRecargoEquivalencia");
            amount2Node.textContent = round2ToString(vatLine.rate2);
            vatNode.appendChild(amount2Node);
        }

        if (vatLine.amount2) {
            const amount2Node = xml.createElement("CuotaRecargoEquivalencia");
            amount2Node.textContent = round2ToString(vatLine.amount2);
            vatNode.appendChild(amount2Node);
        }

        if (vatLine.compensationPercent) {
            const compensationPercentNode = xml.createElement("PorcentajeCompensacionREAGYP");
            compensationPercentNode.textContent = round2ToString(vatLine.compensationPercent);
            vatNode.appendChild(compensationPercentNode);
        }

        if (vatLine.compensationAmount) {
            const compensationAmountNode = xml.createElement("ImporteCompensacionREAGYP");
            compensationAmountNode.textContent = round2ToString(vatLine.compensationAmount);
            vatNode.appendChild(compensationAmountNode);
        }

        if (vatLine.expense) {
            const expenseNode = xml.createElement("ImporteGastoIRPF");
            expenseNode.textContent = round2ToString(vatLine.expense);
            vatNode.appendChild(expenseNode);
        }

        if (vatLine.criteria) {
            const criteriaNode = xml.createElement("CriterioCobrosYPagos");
            criteriaNode.textContent = vatLine.criteria ? "S" : "N";
            vatNode.appendChild(criteriaNode);
        }

        vatLinesNode.appendChild(vatNode);
    }
}

function addVatBreakdown(xml: Document, vatLines: Array<VatDetail>, model: LroeModel): void {
    let vatLinesNode = querySelector(xml, "IVA");
    if (model == "140") {
        const parentNode = querySelector(xml, "Gasto");
        const tpl = `<RentaIVA></RentaIVA>`.replace(/>\s+</g, "><");
        const newXml = new DOMParser().parseFromString(tpl, "application/xml");
        parentNode.replaceChild(newXml.documentElement, vatLinesNode);
        vatLinesNode = querySelector(xml, "RentaIVA");
        add140VatLines(xml, vatLinesNode, vatLines as Array<ExpenseVatLine>);
    } else {
        add240VatLines(xml, vatLinesNode, vatLines as Array<VatLine>);
    }
}

export function addOtherInfoTax(xml: Document, otherInfoTax?: InfoTax): void {
    if (!otherInfoTax) {
        querySelectorAll(xml, "OtraInformacionTrascendenciaTributaria").forEach(removeElement);
        return;
    }
    const parentNode = querySelector(xml, "OtraInformacionTrascendenciaTributaria");
    if (otherInfoTax.date) {
        const dateNode = xml.createElement("FechaRegistroContable");
        dateNode.textContent = toDateString(otherInfoTax.date);
        parentNode.appendChild(dateNode);
    }
    if (otherInfoTax.regNum) {
        const regNode = xml.createElement("NumRegistroAcuerdoFacturacion");
        regNode.textContent = toStr15(otherInfoTax.regNum);
        parentNode.appendChild(regNode);
    }
    if (otherInfoTax.externalRef) {
        const refNode = xml.createElement("ReferenciaExterna");
        refNode.textContent = toStr60(otherInfoTax.externalRef);
        parentNode.appendChild(refNode);
    }
    if (otherInfoTax.successedEntity) {
        const tpl = `
<EntidadSucedida>
    <NombreRazon/>
    <NIF/>
</EntidadSucedida>
        `.replace(/>\s+</g, "><");
        const newXml = new DOMParser().parseFromString(tpl, "application/xml");
        // prettier-ignore
        updateDocument(newXml, [
        ['NombreRazon'  , otherInfoTax.successedEntity.name      , toStr120],
        ['NIF'          , otherInfoTax.successedEntity.irsId     , toNifStr],
        ]);
        parentNode.appendChild(newXml.documentElement);
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

function getXmlBase(model: LroeModel): string {
    if (model == "140") {
        return `<Gasto>${LROE_PURCHASE_XML_BASE}</Gasto>`.replace(/>\s+</g, "><");
    }
    return `<FacturaRecibida>${LROE_PURCHASE_XML_BASE}</FacturaRecibida>`.replace(/>\s+</g, "><");
}

function getCancelXmlBase(model: LroeModel): string {
    if (model == "140") {
        return `<Gasto><IDGasto>${LROE_PURCHASE_CANCEL_XML_BASE}</IDGasto></Gasto>`.replace(
            />\s+</g,
            "><"
        );
    }
    return `<FacturaRecibida><IDRecibida>${LROE_PURCHASE_CANCEL_XML_BASE}</IDRecibida></FacturaRecibida>`.replace(
        />\s+</g,
        "><"
    );
}

export function toXmlDocument(invoice: Invoice, options: ToXmlOptions): XMLDocument {
    if (1 > invoice.vatLines.length) {
        throw new TbaiError(
            TbaiErrorMessages.ERR_LINES_OR_DESC_VAT_DETAILS,
            TbaiErrorCodes.ERR_LINES_OR_DESC_VAT_DETAILS
        );
    }

    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["CabeceraFactura>SerieFactura"             , invoice.id.serie      , toStr20],
        ["CabeceraFactura>NumFactura"               , invoice.id.number     , toStr20],
        ["CabeceraFactura>NumFacturaFin"            , invoice.endNumber     , toStr20],
        ["CabeceraFactura>FechaExpedicionFactura"   , invoice.id.issuedTime , toDateString],
        ["CabeceraFactura>TipoFactura"              , invoice.type          , toStr2],
        ["CabeceraFactura>FechaOperacion"           , invoice.operationDate , toDateString],
        ["CabeceraFactura>FechaRecepcion"           , invoice.receptionDate , toDateString],
        ["DatosFactura>DescripcionOperacion"        , invoice.description   , toStr250],
        ["DatosFactura>ImporteTotalFactura"         , invoice.total         , round2ToString],
        ["DatosFactura>BaseImponibleACoste"         , invoice.baseCost      , round2ToString],

    ];
    const xmlBase = getXmlBase(options.model);
    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");
    updateDocument(xml, selectorsToValues);

    // remove optional nodes
    if (!("operationDate" in invoice)) {
        querySelectorAll(xml, "FechaOperacion").forEach(removeElement);
    }
    if (!("serie" in invoice.id)) {
        querySelectorAll(xml, "SerieFactura").forEach(removeElement);
    }
    if (!("endNumber" in invoice)) {
        querySelectorAll(xml, "NumFacturaFin").forEach(removeElement);
    }
    if (!("baseCost" in invoice)) {
        querySelectorAll(xml, "BaseImponibleACoste").forEach(removeElement);
    }

    addIssuer(xml, invoice.issuer);

    addVatBreakdown(xml, invoice.vatLines, options.model);

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

    // vat keys
    const vatKeys: Array<VatKey> = invoice.vatKeys;
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

    addOtherInfoTax(xml, invoice.otherInfoTax);

    lroeValidations.ensureCreatePurchaseValidations(invoice, options.model);

    return xml;
}

export function cancelInvoiceToXmlDocument(
    invoice: CancelInvoice,
    options: ToXmlOptions
): XMLDocument {
    const xmlBase = getCancelXmlBase(options.model);
    const xml = new DOMParser().parseFromString(xmlBase, "application/xml");

    // prettier-ignore
    const selectorsToValues: Array<[string, SimpleType, FormatAndValidationFunction]> = [
        ["SerieFactura"          , invoice.id.serie        , toStr20],
        ["NumFactura"            , invoice.id.number       , toStr20],
        ["FechaExpedicionFactura", invoice.id.issuedTime   , toDateString],
    ];

    if (!("serie" in invoice.id)) {
        querySelectorAll(xml, "SerieFactura").forEach(removeElement);
    }

    // issuer
    addIssuer(xml, invoice.issuer);

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
