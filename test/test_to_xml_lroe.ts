import "regenerator-runtime/runtime";
import * as lroe from "../src/lroe_doc";
import * as lroeSsg from "../src/lroe_ssg_doc";
import { toDateString } from "../src/to_string";

function texts(xml: Document, query: string): Array<string | null> {
    return Array.from(xml.querySelectorAll(query)).map((e) => e.textContent);
}

function completeXml(xml: string, schema: string, model: string): string {
    let root: string;
    let subchapterNode: string;
    let vat: string;
    let name: string;
    let xmlns: string;
    let modelNode: string;
    let chapter: string;
    if (model == "140") {
        vat = "99980046N";
        name = "jM8GaHz7Qv NhfPp7dn8Q zJKHWtBMNE";
        root = "LROEPF140GastosConFacturaAltaModifPeticion";
        xmlns =
            "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PF_140_2_1_Gastos_Confactura_AltaModifPeticion_V1_0_2.xsd";
        chapter = "2";
        subchapterNode = "<Subcapitulo>2.1</Subcapitulo>";
        modelNode = "Gastos";
        if (schema == "AnulaLROEPurchase") {
            root = "LROEPF140GastosConFacturaAnulacionPeticion";
            xmlns =
                "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PF_140_2_1_Gastos_Confactura_AnulacionPeticion_V1_0_0.xsd";
        }
    } else {
        vat = "A99800476";
        name = "7nGgrGx5vQDCZt7XrGeAN8ANQSwipd";
        root = "LROEPJ240FacturasRecibidasAltaModifPeticion";
        xmlns =
            "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PJ_240_2_FacturasRecibidas_AltaModifPeticion_V1_0_1.xsd";
        chapter = "2";
        subchapterNode = "";
        modelNode = "FacturasRecibidas";
        if (schema == "AnulaLROEPurchase") {
            root = "LROEPJ240FacturasRecibidasAnulacionPeticion";
            xmlns =
                "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PJ_240_2_FacturasRecibidas_AnulacionPeticion_V1_0_0.xsd";
        } else if (schema == "LROESaleSsg") {
            root = "LROEPJ240FacturasEmitidasSinSGAltaModifPeticion";
            xmlns =
                "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PJ_240_1_2_FacturasEmitidas_SinSG_AltaModifPeticion_V1_0_1.xsd";
            modelNode = "FacturasEmitidas";
            chapter = "1";
            subchapterNode = "<Subcapitulo>1.2</Subcapitulo>";
        } else if (schema == "AnulaLROESaleSsg") {
            root = "LROEPJ240FacturasEmitidasSinSGAnulacionPeticion";
            xmlns =
                "https://www.batuz.eus/fitxategiak/batuz/LROE/esquemas/LROE_PJ_240_1_2_FacturasEmitidas_SinSG_AnulacionPeticion_V1_0_0.xsd";
            modelNode = "FacturasEmitidas";
            chapter = "1";
            subchapterNode = "<Subcapitulo>1.2</Subcapitulo>";
        }
    }

    return `
<lroe:${root} xmlns:lroe="${xmlns}">
    <Cabecera>
        <Modelo>${model}</Modelo>
        <Capitulo>${chapter}</Capitulo>
        ${subchapterNode}
        <Operacion>A00</Operacion>
        <Version>1.0</Version>
        <Ejercicio>2023</Ejercicio>
        <ObligadoTributario>
            <NIF>${vat}</NIF>
            <ApellidosNombreRazonSocial>${name}</ApellidosNombreRazonSocial>
        </ObligadoTributario>
    </Cabecera>
    <${modelNode}>${xml}</${modelNode}>
</lroe:${root}>`;
}

export function checkXml(xml: string, schema = "LROEPurchase", model = "240"): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        let url;
        switch (schema) {
            case "AnulaLROEPurchase":
                url = `lroeCheckCancelInvoice${model}Xml`;
                break;
            case "LROESaleSsg":
                url = `lroeCheckSsgInvoice${model}Xml`;
                break;
            case "AnulaLROESaleSsg":
                url = `lroeCheckCancelSsgInvoice${model}Xml`;
                break;
            default:
                url = `lroeCheckInvoice${model}Xml`;
                break;
        }
        xml = completeXml(xml, schema, model);

        req.responseType = "text";
        req.timeout = 1000;
        req.onreadystatechange = (): void => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject();
                }
            }
        };
        req.open("POST", url, true);
        req.send(xml);
    });
}

describe("LROE 240: We can create/cancel a SSG invoice ", () => {
    const model = "240";
    it("PJ240 SSG sale: common invoice", async () => {
        const invoice: lroeSsg.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "1001",
                serie: "PJ240/SSG/",
                issuedTime: new Date("2023-10-30"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2023-10-30"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const xml = lroeSsg.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROESaleSsg", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
    });

    it("PJ240 SSG sale: with VAT lines for national recipients and not subject to VAT", async () => {
        const invoice: lroeSsg.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 0,
                    notSubjectToVatReason: "OT",
                },
            ],
        };
        const xml = lroeSsg.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROESaleSsg", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>CausaNoSujecion")
        ).toEqual(["OT"]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Importe")).toEqual(
            ["1000.00"]
        );
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("PJ240 SSG sale: with VAT lines with notSubjectToVatReason and vatKey 08", async () => {
        const invoice: lroeSsg.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 0,
                    notSubjectToVatReason: "RL",
                },
            ],
            vatKeys: ["08"],
        };
        const xml = lroeSsg.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROESaleSsg", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>CausaNoSujecion")
        ).toEqual(["RL"]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Importe")).toEqual(
            ["1000.00"]
        );
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["08"]);
    });

    it("Cancelling an SSG sale invoice", async () => {
        const invoice: lroe.CancelInvoice = {
            issuer: {
                irsId: "S3091209A",
                name: "Acme Inc.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
        };
        const xml = lroeSsg.cancelInvoiceToXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "AnulaLROESaleSsg", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "NumFactura")).toEqual(["1001"]);
        expect(texts(xml, "SerieFactura")).toEqual(["BIN115/09/"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-09-2023"]);
    });
});

describe("LROE 240: We can create/cancel a purchase ", () => {
    const model = "240";
    it("PJ240 purchase invoice", async () => {
        const operationDate = new Date("2023-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Purchase description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
                {
                    base: 100,
                    rate: 10,
                    amount: 10,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 231,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "CabeceraFactura>FechaOperacion")).toEqual([toDateString(operationDate)]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["231.00"]);
    });

    it("PJ240 purchase invoice with rate 0", async () => {
        const operationDate = new Date("2023-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Purchase description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
                {
                    base: 100,
                    rate: 0,
                    amount: 0,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 221,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "CabeceraFactura>FechaOperacion")).toEqual([toDateString(operationDate)]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["221.00"]);
    });

    it("PJ240 purchase invoice with foreign issuer", async () => {
        const operationDate = new Date("2023-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                id: "PT641439644",
                idType: "02",
                name: "Binovo PT S.L.",
                country: "PT",
            },
            id: {
                number: "1002",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Purchase description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                    amount: 210,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 1210,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "EmisorFacturaRecibida>IDOtro>ID")).toEqual(["PT641439644"]);
        expect(texts(xml, "CabeceraFactura>FechaOperacion")).toEqual([toDateString(operationDate)]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
    });

    it("Purchase invoice with other info", async () => {
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1003",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Purchase description",
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            otherInfoTax: {
                date: new Date("2023-09-05"),
                regNum: "R1011",
                externalRef: "E1011",
                successedEntity: {
                    name: "Acme Inc.",
                    irsId: "P7945172J",
                },
            },
            vatKeys: ["01"],
            total: 121,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "OtraInformacionTrascendenciaTributaria>FechaRegistroContable")).toEqual([
            "05-09-2023",
        ]);
        expect(
            texts(xml, "OtraInformacionTrascendenciaTributaria>NumRegistroAcuerdoFacturacion")
        ).toEqual(["R1011"]);
        expect(texts(xml, "OtraInformacionTrascendenciaTributaria>ReferenciaExterna")).toEqual([
            "E1011",
        ]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["121.00"]);
    });

    it("Purchase invoice credit note by differences", async () => {
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1001",
                serie: "RBIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Credit note description",
            operationDate: new Date("2023-09-01"),
            receptionDate: new Date("2023-09-05"),
            creditNote: {
                reason: "R1",
                style: "I",
                ids: [
                    {
                        number: "1001",
                        serie: "BIN115/09/",
                        issuedTime: new Date("2023-08-30"),
                    },
                ],
            },
            vatLines: [
                {
                    base: -100,
                    rate: 21,
                    amount: -21,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: -121.0,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["-121.00"]);
    });

    it("Cancelling an purchase invoice", async () => {
        const invoice: lroe.CancelInvoice = {
            issuer: {
                irsId: "S3091209A",
                name: "Acme Inc.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
        };
        const xml = lroe.cancelInvoiceToXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "AnulaLROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "EmisorFacturaRecibida>NIF")).toEqual(["S3091209A"]);
        expect(texts(xml, "NumFactura")).toEqual(["1001"]);
        expect(texts(xml, "SerieFactura")).toEqual(["BIN115/09/"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-09-2023"]);
    });
});

describe("LROE 140: We can create/cancel an expense ", () => {
    const model = "140";
    it("Simple expense", async () => {
        const operationDate = new Date("2023-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Expense description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    epigraph: "165210",
                    base: 200,
                    rate: 21,
                    amount: 42,
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 242,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "RentaIVA>DetalleRentaIVA>Epigrafe")).toEqual(["165210"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["242.00"]);
    });
    it("Expense credit note by differences", async () => {
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1002",
                serie: "PF140/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Credit note description",
            operationDate: new Date("2023-09-01"),
            receptionDate: new Date("2023-09-05"),
            creditNote: {
                reason: "R1",
                style: "I",
                ids: [
                    {
                        number: "1001",
                        serie: "PF140/09/",
                        issuedTime: new Date("2023-08-30"),
                    },
                ],
            },
            vatLines: [
                {
                    epigraph: "165210",
                    base: -100,
                    rate: 21,
                    amount: -21,
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: -121.0,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["-121.00"]);
    });
    it("Equivalence recharge expense", async () => {
        const operationDate = new Date("2023-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                irsId: "R9479279C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Expense description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    epigraph: "165210",
                    base: 70,
                    rate: 21,
                    amount: 14.7,
                    rate2: 5.2,
                    amount2: 3.64,
                    isUsingSimplifiedRegime: "E",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 88.34,
        };
        const xml = lroe.toXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "LROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "RentaIVA>DetalleRentaIVA>Epigrafe")).toEqual(["165210"]);
        expect(texts(xml, "RentaIVA>DetalleRentaIVA>TipoRecargoEquivalencia")).toEqual(["5.20"]);
        expect(texts(xml, "RentaIVA>DetalleRentaIVA>CuotaRecargoEquivalencia")).toEqual(["3.64"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["88.34"]);
    });
    it("Cancelling an expense invoice", async () => {
        const invoice: lroe.CancelInvoice = {
            issuer: {
                irsId: "S3091209A",
                name: "Acme Inc.",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
        };
        const xml = lroe.cancelInvoiceToXmlDocument(invoice, { model: model });
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "AnulaLROEPurchase", model)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "EmisorFacturaRecibida>NIF")).toEqual(["S3091209A"]);
        expect(texts(xml, "NumFactura")).toEqual(["1001"]);
        expect(texts(xml, "SerieFactura")).toEqual(["BIN115/09/"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-09-2023"]);
    });
});

describe("LROE 240: Validation errors: ", () => {
    const model = "240";
    it("[B4_2000011 + B4_2000013] Purchase with incorrect issuer VAT", async () => {
        const operationDate = new Date("2099-09-01");
        const invoice: lroe.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
            },
            issuer: {
                id: "641439644",
                idType: "02",
                name: "Binovo PT S.L.",
                country: "PT",
            },
            id: {
                number: "1001",
                serie: "BIN115/09/",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: "Purchase description",
            operationDate: operationDate,
            receptionDate: new Date("2023-09-05"),
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                    purchaseExpenseType: "C",
                    investmentSubjectPassive: false,
                },
            ],
            vatKeys: ["01"],
            total: 121,
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = lroe.toXmlDocument(invoice, { model: model });
        }).toThrow(new Error("Incorrect VAT number."));
    });
});
