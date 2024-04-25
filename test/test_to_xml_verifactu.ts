import "regenerator-runtime/runtime";
import * as verifactu from "../src/verifactu_doc";
import { toDateString } from "../src/to_string";

function texts(xml: Document, query: string): Array<string | null> {
    return Array.from(xml.querySelectorAll(query)).map((e) => e.textContent);
}

function completeXml(xml: string): string {
    const vat = "99999972C";
    const name = "Binovo IT Humans Project S.L.";
    return `<sum:RegFactuSistemaFacturacion
        xmlns:sum="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd"
        xmlns="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd">
        <Cabecera>
            <ObligadoEmision>
                <NombreRazon>${name}</NombreRazon>
                <NIF>${vat}</NIF>
            </ObligadoEmision>
        </Cabecera>
        ${xml}
    </sum:RegFactuSistemaFacturacion>`
        .replace(/>\s+</g, "><")
        .replace(/\s*xmlns/g, " xmlns");
}

export function checkXml(xml: string, schema = "VerifactuInvoice"): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        let url;
        switch (schema) {
            case "AnulaVerifactuInvoice":
                url = `verifactuCheckCancelInvoiceXml`;
                break;
            default:
                url = `verifactuCheckInvoiceXml`;
                break;
        }
        xml = completeXml(xml);
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

function getPreviousInvoice(): verifactu.PreviousInvoiceId {
    return {
        number: "0",
        issuerIrsId: "99999972C",
        issuedTime: new Date(),
        hash: "xxx",
    };
}

function getSoftware(): verifactu.Software {
    return {
        id: "00",
        number: "123",
        developerName: "Software Description",
        developerIrsId: "X0000000X",
        name: "Acme VERIFACTU",
        version: "0.1",
        useOnlyVerifactu: true,
        useMulti: true,
        useCurrentMulti: false,
    };
}

describe("VERIFACTU: We can create invoices ", () => {
    it("Create simplified invoice", async () => {
        const operationDate = new Date("2024-03-18");
        const invoice: verifactu.Invoice = {
            issuer: {
                irsId: "99999972C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "BIN/1001",
                issuedTime: new Date("2024-03-20T11:30:00.000Z"),
            },
            simple: true,
            type: "F1",
            description: {
                text: "Invoice description",
                operationDate: operationDate,
            },
            vatLines: [
                {
                    vatOperation: "S1",
                    base: 100,
                    rate: 21,
                    amount: 21,
                    vatKey: "01",
                },
            ],
            total: 121,
            amount: 21,
        };

        const previousId = getPreviousInvoice();
        const software = getSoftware();
        const xml = await verifactu.toXmlDocument(invoice, previousId, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "VerifactuInvoice")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "FacturaSimplificadaArt7273")).toEqual(["S"]);
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "ImporteTotal")).toEqual(["121.00"]);
        expect(texts(xml, "CuotaTotal")).toEqual(["21.00"]);
        expect(texts(xml, "FechaHoraHusoGenRegistro")).toEqual(["2024-03-20T11:30:00.000Z"]);
        expect(texts(xml, "FechaOperacion")).toEqual([toDateString(operationDate)]);
        expect(texts(xml, "Desglose>DetalleDesglose>BaseImponibleOimporteNoSujeto")).toEqual([
            "100.00",
        ]);
        expect(texts(xml, "Desglose>DetalleDesglose>TipoImpositivo")).toEqual(["21.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>TipoImpositivo")).toEqual(["21.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>CuotaRepercutida")).toEqual(["21.00"]);
    });

    it("Create normal invoice", async () => {
        const operationDate = new Date("2024-03-18");
        const invoice: verifactu.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
                country: "ES",
            },
            issuer: {
                irsId: "99999972C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "BIN/OUT/1001",
                issuedTime: new Date("2024-03-18"),
            },
            type: "F1",
            description: {
                text: "Invoice description",
                operationDate: operationDate,
            },
            vatLines: [
                {
                    vatOperation: "S1",
                    base: 100,
                    rate: 21,
                    amount: 21,
                    vatKey: "01",
                },
            ],
            total: 121,
            amount: 21,
        };

        const previousId = getPreviousInvoice();
        const software = getSoftware();
        const xml = await verifactu.toXmlDocument(invoice, previousId, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "VerifactuInvoice")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "ImporteTotal")).toEqual(["121.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>BaseImponibleOimporteNoSujeto")).toEqual([
            "100.00",
        ]);
        expect(texts(xml, "Desglose>DetalleDesglose>TipoImpositivo")).toEqual(["21.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>CuotaRepercutida")).toEqual(["21.00"]);
    });

    it("Create export invoice", async () => {
        const operationDate = new Date("2024-03-18");
        const invoice: verifactu.Invoice = {
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Export Company S.L.",
            },
            issuer: {
                irsId: "99999972C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "BIN/OUT/1002",
                issuedTime: new Date("2023-09-01"),
            },
            type: "F1",
            description: {
                text: "Invoice description",
                operationDate: operationDate,
            },
            vatLines: [
                {
                    vatOperation: "E1",
                    base: 100,
                    rate: 0,
                    amount: 0,
                    vatKey: "02",
                },
            ],
            total: 100,
            amount: 0,
        };

        const previousId = getPreviousInvoice();
        const software = getSoftware();
        const xml = await verifactu.toXmlDocument(invoice, previousId, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "VerifactuInvoice")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["F1"]);
        expect(texts(xml, "ImporteTotal")).toEqual(["100.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>TipoImpositivo")).toEqual(["0.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>CuotaRepercutida")).toEqual(["0.00"]);
    });

    it("Create credit note invoice", async () => {
        const invoice: verifactu.Invoice = {
            recipient: {
                irsId: "A99800476",
                name: "My Company S.L.",
                country: "ES",
            },
            issuer: {
                irsId: "99999972C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "RBIN/OUT/1001",
                issuedTime: new Date("2024-03-19"),
            },
            type: "R1",
            description: {
                text: "Invoice description",
                operationDate: new Date("2024-03-19"),
            },
            creditNote: {
                style: "I",
                ids: [
                    {
                        number: "BIN/OUT/1001",
                        issuedTime: new Date("2024-03-18"),
                    },
                ],
            },
            vatLines: [
                {
                    vatOperation: "S1",
                    base: 200,
                    rate: 21,
                    amount: 42,
                    vatKey: "01",
                },
            ],
            total: 242,
            amount: 42,
        };

        const previousId = getPreviousInvoice();
        const software = getSoftware();
        const xml = await verifactu.toXmlDocument(invoice, previousId, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "VerifactuInvoice")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "TipoFactura")).toEqual(["R1"]);
        expect(texts(xml, "TipoRectificativa")).toEqual(["I"]);
        expect(texts(xml, "IDFacturaRectificada>IDEmisorFactura")).toEqual(["99999972C"]);
        expect(texts(xml, "IDFacturaRectificada>NumSerieFactura")).toEqual(["BIN/OUT/1001"]);
        expect(texts(xml, "IDFacturaRectificada>FechaExpedicionFactura")).toEqual(["18-03-2024"]);
        expect(texts(xml, "ImporteTotal")).toEqual(["242.00"]);
        expect(texts(xml, "Desglose>DetalleDesglose>TipoImpositivo")).toEqual(["21.00"]);
    });

    it("Cancelling Invoice", async () => {
        const invoice: verifactu.CancelInvoice = {
            issuer: {
                irsId: "99999972C",
                name: "Binovo IT Humans Project S.L.",
            },
            id: {
                number: "BIN/OUT/1001",
                issuedTime: new Date("2024-03-18T11:30:00.000Z"),
            },
        };
        const previousId = getPreviousInvoice();
        const software = getSoftware();
        const xml = await verifactu.cancelInvoiceToXmlDocument(invoice, previousId, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        expect(await checkXml(xmlString, "AnulaVerifactuInvoice")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "IDFactura>IDEmisorFacturaAnulada")).toEqual(["99999972C"]);
        expect(texts(xml, "IDFactura>NumSerieFacturaAnulada")).toEqual(["BIN/OUT/1001"]);
        expect(texts(xml, "IDFactura>FechaExpedicionFacturaAnulada")).toEqual(["18-03-2024"]);
    });
});
