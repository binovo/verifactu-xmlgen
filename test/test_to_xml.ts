import "regenerator-runtime/runtime";
import { P12_FILE, P12_PASSWORD, P12_ALIAS, loadBinaryFile } from "./common";
import * as tbai from "../src/tbai";
import * as lroeSsg from "../src/lroe_ssg_doc";
import { toDateString } from "../src/to_string";
import { checkXml as checkXmlSsg } from "./test_to_xml_lroe";

function texts(xml: Document, query: string): Array<string | null> {
    return Array.from(xml.querySelectorAll(query)).map((e) => e.textContent);
}

function checkXml(xml: string, schema = "TicketBai"): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        let url = "tbaiCheckInvoiceXml";
        if (schema === "AnulaTicketBai") {
            url = "tbaiCheckCancelInvoiceXml";
        }
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

async function checkTbaiLroeXmls(
    invoice: tbai.Invoice,
    previousId: tbai.PreviousInvoiceId,
    software: tbai.Software,
    taxAgency: tbai.TaxAgency,
    signer: tbai.TbaiSigner
): Promise<Array<Document>> {
    const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
    const xmlString = new XMLSerializer().serializeToString(xml);
    const signedXml = await signer.sign(xmlString);
    expect(await checkXml(signedXml)).toBe("ok");
    expect(xml).toBeTruthy();

    const xmlSsg = lroeSsg.toXmlDocument(invoice, { model: "240" });
    const xmlStringSsg = new XMLSerializer().serializeToString(xmlSsg);
    expect(await checkXmlSsg(xmlStringSsg, "LROESaleSsg", "240")).toBe("ok");
    expect(xmlSsg).toBeTruthy();

    return [xml, xmlSsg];
}

describe("This are the input validations: ", () => {
    it("OperationDate cannot be a future date", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "001",
                issuedTime: new Date("2021-10-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: futureDate,
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
            simple: true,
            vatKeys: ["01", "03"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("operationDate is not a valid date, it cannot be a future date."));
    });

    it("operationDate is not a valid date, it cannot be less than 20 years ago date.", () => {
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 21);
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "001",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: pastDate,
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
            simple: true,
            vatKeys: ["01", "03"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(
            new Error(
                "operationDate is not a valid date, it cannot be less than 20 years ago date."
            )
        );
    });

    it("OperationDate cannot be after the date of issue", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "001",
                issuedTime: new Date("2021-10-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2021-10-05"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
            simple: true,
            vatKeys: ["01", "03"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Operation date cannot be after the date of issue."));
    });

    it(" Invoice without recipients and without simplified invoice check.", () => {
        const rectifiedIds: Array<tbai.InvoiceId> = [];
        for (let i = 0; i < 101; i++) {
            rectifiedIds.push({ number: i.toString(), issuedTime: new Date() });
        }
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                serie: "F",
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            creditNote: {
                reason: "R5",
                style: "I",
                ids: rectifiedIds,
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Invoice without recipients and without simplified invoice check."));
    });

    it(" invalid VAT for spanish recipient", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "09479279C",
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
                    rate: 21,
                },
            ],
            vatKeys: ["01"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Incorrect VAT number, irsId has to be a Spanish VAT number."));
    });

    it(" country is isgnored if ifType == 02", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "EL125267200",
                idType: "02",
                name: "Acme Inc.",
                postal: "08080",
                country: "FR",
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
                    rate: 21,
                    merchandiseOrService: "service",
                },
            ],
            vatKeys: ["01"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        expect(texts(xml, "IDOtro>IDType")).toEqual(["02"]);
        expect(texts(xml, "IDOtro>CodigoPais")).toEqual([]);
    });

    it(" invalid VAT for non spanish recipient", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT0000000X",
                idType: "02",
                name: "Acme Inc.",
                postal: "08080",
                country: "PT",
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
                    rate: 21,
                },
            ],
            vatKeys: ["01"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Incorrect VAT number."));
    });

    it(" only up 1000 lines allowed", () => {
        const invoiceLines: Array<tbai.InvoiceLine> = [];
        for (let i = 0; i < 1001; i++) {
            invoiceLines.push({ description: "Line 0" + i, quantity: 1, price: 2 });
        }
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date(),
            },
            lines: invoiceLines,
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        }).toThrow(new Error("Only up to 1000 invoice lines allowed"));
    });

    it(" for foreign receivers merchandiseOrService is required ", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    exemptionReason: "E5",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("merchandiseOrService is required for foreign receivers"));
    });

    it("But 5% is allowed too", async () => {
        const invoice: tbai.Invoice = {
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
            lines: [
                {
                    description: "Line 01",
                    quantity: 2,
                    price: 500,
                    vat: 5,
                },
            ],
            total: 1050,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        expect(xml).toBeTruthy();
        expect(texts(xml, "DetalleIVA>TipoImpositivo")).toEqual(["5.00"]);
    });

    it(" retention amount and retention rates (IRPF) are mutually exclusive ", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
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
                    rate: 21,
                },
            ],
            retentionAmount: 150,
            retentionLines: [
                {
                    base: 1000,
                    rate: 15,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(
            new Error(
                "You cannot set Retention Amount and Retention rates (IRPF) at the same time!"
            )
        );
    });

    it(" (invoice with lines and global retention) retention amount and retention rates (IRPF) are mutually exclusive ", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                },
            ],
            vat: 21,
            retentionAmount: 150,
            retention: 15,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        }).toThrow(
            new Error(
                "You cannot set Retention Amount and Retention rates (IRPF) at the same time!"
            )
        );
    });

    it(" (invoice with lines) retention amount and retention rates (IRPF) are mutually exclusive ", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    retention: 15,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                    retention: 15,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                    retention: 15,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                    retention: 15,
                },
            ],
            vat: 21,
            retentionAmount: 150,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        }).toThrow(
            new Error(
                "You cannot set Retention Amount and Retention rates (IRPF) at the same time!"
            )
        );
    });

    it("not exempted duplicate VAT lines for Spanish recipient", async () => {
        const invoice: tbai.Invoice = {
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
                    base: 100,
                    rate: 21,
                    merchandiseOrService: "merchandise",
                },
                {
                    base: 10,
                    rate: 21,
                    merchandiseOrService: "service",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Repeated vatLines."));
    });

    it("not exempted duplicate VAT lines for non Spanish recipient", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    base: 100,
                    rate: 21,
                    merchandiseOrService: "merchandise",
                },
                {
                    base: 150,
                    rate: 21,
                    merchandiseOrService: "merchandise",
                },
                {
                    base: 10,
                    rate: 21,
                    merchandiseOrService: "service",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        }).toThrow(new Error("Repeated vatLines."));
    });

    it("isFix not supported for Bizkaia agency.", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
            isFix: true,
            hashFix: "xxx",
            actionTypeFix: "MODIFICAR",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "ESX0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        expect(() => {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const xml = tbai.toXmlDocument(invoice, null, software, 1);
        }).toThrow(new Error("isFix not supported for Bizkaia agency."));
    });
});

describe("We can create an invoice ", () => {
    let signer: tbai.TbaiSigner;

    beforeEach(async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        signer = await tbai.TbaiSigner.fromBuffer(p12, P12_ALIAS, P12_PASSWORD);
    });

    it("with a developerIrsId that has the ES prefix and we remove the prefix", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "ESX0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(tbai.getTbaiChainInfo(signedXml).serie).toBe(undefined);
            expect(texts(xml, "HuellaTBAI>Software>LicenciaTBAI")).toEqual(["LICENSE CODE"]);
            expect(texts(xml, "HuellaTBAI>Software>EntidadDesarrolladora>NIF")).toEqual([
                "X0000000X",
            ]);
            expect(texts(xml, "HuellaTBAI>Software>Nombre")).toEqual(["Acme TBAI"]);
            expect(texts(xml, "HuellaTBAI>Software>Version")).toEqual(["0.1"]);
        }
    });

    it("without serie", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(texts(xml, "SerieFactura")).toEqual([]);
            expect(tbai.getTbaiChainInfo(signedXml).serie).toBe(undefined);
            expect(texts(xml, "HuellaTBAI>Software>LicenciaTBAI")).toEqual(["LICENSE CODE"]);
            expect(texts(xml, "HuellaTBAI>Software>EntidadDesarrolladora>NIF")).toEqual([
                "X0000000X",
            ]);
            expect(texts(xml, "HuellaTBAI>Software>Nombre")).toEqual(["Acme TBAI"]);
            expect(texts(xml, "HuellaTBAI>Software>Version")).toEqual(["0.1"]);
        }
        {
            invoice.id.serie = "";
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(texts(xml, "SerieFactura")).toEqual([""]);
            expect(tbai.getTbaiChainInfo(signedXml).serie).toBe("");
            expect(texts(xml, "HuellaTBAI>Software>LicenciaTBAI")).toEqual(["LICENSE CODE"]);
            expect(texts(xml, "HuellaTBAI>Software>EntidadDesarrolladora>NIF")).toEqual([
                "X0000000X",
            ]);
            expect(texts(xml, "HuellaTBAI>Software>Nombre")).toEqual(["Acme TBAI"]);
            expect(texts(xml, "HuellaTBAI>Software>Version")).toEqual(["0.1"]);
        }
    });

    it("for a non spanish software developer", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "IT56817700364",
            idInfo: {
                idType: "02",
                country: "IT",
            },
            name: "Acme TBAI",
            version: "0.1",
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(texts(xml, "LicenciaTBAI")).toEqual(["LICENSE CODE"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>CodigoPais")).toEqual(["IT"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>IDType")).toEqual(["02"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>ID")).toEqual(["IT56817700364"]);
        expect(texts(xml, "Nombre")).toEqual(["Acme TBAI"]);
        expect(texts(xml, "Version")).toEqual(["0.1"]);
        expect(await checkXml(signedXml)).toBe("ok");
    });

    it("cancelling an Invoice", async () => {
        const invoice: tbai.CancelInvoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                serie: "2020",
                issuedTime: new Date("2020-02-01"),
            },
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.cancelInvoiceToXmlDocument(invoice, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml, "AnulaTicketBai")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "NumFactura")).toEqual(["1"]);
        expect(texts(xml, "SerieFactura")).toEqual(["2020"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
    });

    it("cancelling an Invoice for a non spanish software developer", async () => {
        const invoice: tbai.CancelInvoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                serie: "2020",
                issuedTime: new Date("2020-02-01"),
            },
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "IT56817700364",
            idInfo: {
                idType: "02",
                country: "IT",
            },
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.cancelInvoiceToXmlDocument(invoice, software);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml, "AnulaTicketBai")).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "NumFactura")).toEqual(["1"]);
        expect(texts(xml, "SerieFactura")).toEqual(["2020"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual(["LICENSE CODE"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>CodigoPais")).toEqual(["IT"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>IDType")).toEqual(["02"]);
        expect(texts(xml, "EntidadDesarrolladora>IDOtro>ID")).toEqual(["IT56817700364"]);
        expect(texts(xml, "Software>Nombre")).toEqual(["Acme TBAI"]);
        expect(texts(xml, "Software>Version")).toEqual(["0.1"]);
    });

    it("recipient without postal", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01 12:00:00Z"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [],
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                },
            ],
            total: 121,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["121.00"]);
        });
    });

    it("from invoice lines and recipient with vatToVat2 (DEFAULTS) equivalence surcharge", async () => {
        const invoice: tbai.Invoice = {
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
                vat2: true,
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01 12:00:00Z"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 1000,
                    vat: 21,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 1000,
                    vat: 10,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    vat: 4,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "HoraExpedicionFactura")).toEqual(["13:00:00"]);
        expect(texts(xml, "DetalleIVA>TipoRecargoEquivalencia").sort()).toEqual(
            ["5.20", "1.40", "0.50"].sort()
        );
        expect(texts(xml, "DetalleIVA>CuotaRecargoEquivalencia").sort()).toEqual(
            ["52.00", "14.00", "5.00"].sort()
        );
        expect(texts(xml, "IDDetalleFactura>ImporteTotal").sort()).toEqual(
            ["1262.00000000", "1114.00000000", "1045.00000000"].sort()
        );
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["3421.00"]);
    });

    it("from invoice lines and recipient with vatToVat2 (in recipient) equivalence surcharge", async () => {
        const invoice: tbai.Invoice = {
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
                vat2: true,
                vatToVat2: { "21.00": 5.2, "10.00": 1.4, "4.00": 0.5 },
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 1000,
                    vat: 21,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 1000,
                    vat: 10,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    vat: 4,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "DetalleIVA>TipoRecargoEquivalencia").sort()).toEqual(
            ["5.20", "1.40", "0.50"].sort()
        );
        expect(texts(xml, "DetalleIVA>CuotaRecargoEquivalencia").sort()).toEqual(
            ["52.00", "14.00", "5.00"].sort()
        );
        expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual([
            "1262.00000000",
            "1114.00000000",
            "1045.00000000",
        ]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["3421.00"]);
    });

    it("from description and VAT lines", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("from description and VAT lines for TicketBai and LROE", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("from without VAT lines (for Bizkaia)", async () => {
        const invoice: tbai.Invoice = {
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
            lines: [
                {
                    description: "Line 01",
                    quantity: 2,
                    price: 500,
                    vat: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
        });
    });

    it("from description and VAT lines with simplified regime", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                    isUsingSimplifiedRegime: true,
                },
                {
                    base: 1000,
                    rate: 21,
                    isUsingSimplifiedRegime: false,
                },
            ],
            vatKeys: ["51"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["2420.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["51"]);
        expect(texts(xml, "OperacionEnRecargoDeEquivalenciaORegimenSimplificado")).toEqual(["S"]);
    });

    it("from description and VAT lines with retention amount", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                },
            ],
            retentionAmount: 150, // IRPF 15%
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(texts(xml, "RetencionSoportada")).toEqual(["150.00"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("from description and VAT lines with equivalence surcharge", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                    rate2: 5.2,
                },
                {
                    base: 1000,
                    rate: 10,
                },
                {
                    base: 1000,
                    rate: 4,
                    rate2: 0.5,
                    amount2: 5,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "DetalleIVA>TipoRecargoEquivalencia").sort()).toEqual(
                ["5.20", "0.50"].sort()
            );
            expect(texts(xml, "DetalleIVA>CuotaRecargoEquivalencia").sort()).toEqual(
                ["52.00", "5.00"].sort()
            );
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["3407.00"]);
        });
    });

    it("from description and VAT lines with very low surcharge, surcharge amount included even if 0", async () => {
        const invoice: tbai.Invoice = {
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
                vat2: true,
            },
            id: {
                serie: "XXXX",
                number: "1001",
                issuedTime: new Date("2023-05-22 12:00:00"),
            },
            simple: false,
            description: {
                text: "Invoice",
                operationDate: new Date("2023-05-22 12:00:00"),
            },
            vatLines: [
                {
                    base: 0.19,
                    rate: 10,
                    amount: 0.02,
                    rate2: 1.4,
                    amount2: 0,
                },
            ],
            lines: [
                {
                    description: "Product",
                    quantity: 1,
                    price: 0.19,
                    amount: 0.19,
                    amountWithVat: 0.21,
                    vat: 10,
                    merchandiseOrService: "merchandise",
                },
            ],
            total: 0.21,
        };

        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "DetalleIVA>TipoRecargoEquivalencia")).toEqual(["1.40"]);
            expect(texts(xml, "DetalleIVA>CuotaRecargoEquivalencia")).toEqual(["0.00"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["0.21"]);
        });
    });

    it("from description and VAT lines with IRPF Retention lines", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                },
            ],
            retentionLines: [
                {
                    base: 1000,
                    rate: 15,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(texts(xml, "RetencionSoportada")).toEqual(["150.00"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("from description and VAT lines with IRPF Retention lines and line detail", async () => {
        const invoice: tbai.Invoice = {
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
            lines: [
                {
                    description: "Line 01",
                    quantity: 2,
                    price: 500,
                    vat: 21,
                },
            ],
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
            retentionLines: [
                {
                    base: 1000,
                    rate: 15,
                    amount: 42,
                },
            ],
            total: 1210,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(texts(xml, "RetencionSoportada")).toEqual(["42.00"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1210.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("from description and VAT lines with operation type breakdown non Spanish recipient", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    base: 100,
                    rate: 21,
                    merchandiseOrService: "merchandise",
                },
                {
                    base: 10,
                    rate: 21,
                    merchandiseOrService: "service",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["PT646699407"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
                )
            ).toEqual(["100.00"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseTipoOperacion>PrestacionServicios>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
                )
            ).toEqual(["10.00"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["133.10"]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("from description and VAT lines for any country", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    exemptionReason: "E1",
                    merchandiseOrService: "merchandise",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>IDOtro>IDType")).toEqual(["02"]);
        expect(texts(xml, "IDDestinatario>IDOtro>CodigoPais")).toEqual([]);
        expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["PT646699407"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>Exenta>DetalleExenta>CausaExencion"
            )
        ).toEqual(["E1"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>Exenta>DetalleExenta>BaseImponible"
            )
        ).toEqual(["1000.00"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("from description and VAT lines for national recipients and not subject to VAT", async () => {
        const invoice: tbai.Invoice = {
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
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Causa")).toEqual([
            "OT",
        ]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Importe")).toEqual(
            ["1000.00"]
        );
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("from description and VAT lines for other recipients and not subject to VAT", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    merchandiseOrService: "service",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>IDOtro>IDType")).toEqual(["02"]);
        expect(texts(xml, "IDDestinatario>IDOtro>CodigoPais")).toEqual([]);
        expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["PT646699407"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>PrestacionServicios>NoSujeta>DetalleNoSujeta>Causa"
            )
        ).toEqual(["OT"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>PrestacionServicios>NoSujeta>DetalleNoSujeta>Importe"
            )
        ).toEqual(["1000.00"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("idType 03 for Spanish recipient", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            recipient: {
                id: "R9479279C",
                idType: "03",
                name: "Acme Inc.",
                country: "ES",
                postal: "0808",
                address: "Acme address",
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    merchandiseOrService: "merchandise",
                },
            ],
            vat: 21,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>IDOtro>IDType")).toEqual(["03"]);
        expect(texts(xml, "IDDestinatario>IDOtro>CodigoPais")).toEqual(["ES"]);
        expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["250.00"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["302.50"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("VAT start with 'N' for Spanish recipient", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            recipient: {
                irsId: "N2589717D",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    merchandiseOrService: "merchandise",
                },
            ],
            vat: 21,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["N2589717D"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["250.00"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["302.50"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("from description and VAT lines with specific VAT keys", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 21,
                },
            ],
            vatKeys: ["07", "01", "12"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["07", "01", "12"]);
        });
    });

    it("from line details", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                },
            ],
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
            expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1292.50"]);
            expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(
                ["21.00", "10.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>BaseImponible").sort()).toEqual(
                ["1000.00", "75.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>CuotaImpuesto").sort()).toEqual(
                ["210.00", "7.50"].sort()
            );
            expect(texts(xml, "IDDetalleFactura>Cantidad")).toEqual([
                "1.00000000",
                "1.00000000",
                "2.00000000",
                "1.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteUnitario")).toEqual([
                "250.00000000",
                "250.00000000",
                "500.00000000",
                "100.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>Descuento")).toEqual([
                "0.00000000",
                "0.00000000",
                "500.00000000",
                "25.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual([
                "302.50000000",
                "302.50000000",
                "605.00000000",
                "82.50000000",
            ]);
            expect(texts(xml, "FacturaSimplificada")).toEqual(["S"]);
        }
    });

    it("from line details mixing simplified regime lines", async () => {
        /*
         * QTY	PRICE	DISCOUNT	VAT	S/N	IMPORTE	CUOTA	TOTAL
         *   1    250          0     21  S      250  52,5   302,5
         *   1    250          0     21  N      250  52,5   302,5
         *   2    500         50     21  N      500 105     605
         *   1    100         25     10  N       75   7,5    82,5
         *
         * The first line not to be grouped with the second and third
         * becaus os S/N value.
         */
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    isUsingSimplifiedRegime: true,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                },
            ],
            vatKeys: ["51"],
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
            expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1292.50"]);
            expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(
                ["21.00", "21.00", "10.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>BaseImponible").sort()).toEqual(
                ["750.00", "250.00", "75.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>CuotaImpuesto").sort()).toEqual(
                ["157.50", "52.50", "7.50"].sort()
            );
            expect(texts(xml, "IDDetalleFactura>Cantidad")).toEqual([
                "1.00000000",
                "1.00000000",
                "2.00000000",
                "1.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteUnitario")).toEqual([
                "250.00000000",
                "250.00000000",
                "500.00000000",
                "100.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>Descuento")).toEqual([
                "0.00000000",
                "0.00000000",
                "500.00000000",
                "25.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual([
                "302.50000000",
                "302.50000000",
                "605.00000000",
                "82.50000000",
            ]);
            expect(texts(xml, "FacturaSimplificada")).toEqual(["S"]);
        }
    });

    it("from line details with IRPF Retention rate (global)", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                },
            ],
            vat: 21,
            retention: 15,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
            expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1292.50"]);
            expect(texts(xml, "RetencionSoportada")).toEqual(["161.25"]);
            expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(
                ["21.00", "10.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>BaseImponible").sort()).toEqual(
                ["1000.00", "75.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>CuotaImpuesto").sort()).toEqual(
                ["210.00", "7.50"].sort()
            );
            expect(texts(xml, "IDDetalleFactura>Cantidad")).toEqual([
                "1.00000000",
                "1.00000000",
                "2.00000000",
                "1.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteUnitario")).toEqual([
                "250.00000000",
                "250.00000000",
                "500.00000000",
                "100.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>Descuento")).toEqual([
                "0.00000000",
                "0.00000000",
                "500.00000000",
                "25.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual([
                "302.50000000",
                "302.50000000",
                "605.00000000",
                "82.50000000",
            ]);
            expect(texts(xml, "FacturaSimplificada")).toEqual(["S"]);
        }
    });

    it("from line details with IRPF Retention rate", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    retention: 15,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                    retention: 15,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                    retention: 15,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                    retention: 15,
                },
            ],
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
            expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1292.50"]);
            expect(texts(xml, "RetencionSoportada")).toEqual(["161.25"]);
            expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(
                ["21.00", "10.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>BaseImponible").sort()).toEqual(
                ["1000.00", "75.00"].sort()
            );
            expect(texts(xml, "DetalleIVA>CuotaImpuesto").sort()).toEqual(
                ["210.00", "7.50"].sort()
            );
            expect(texts(xml, "IDDetalleFactura>Cantidad")).toEqual([
                "1.00000000",
                "1.00000000",
                "2.00000000",
                "1.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteUnitario")).toEqual([
                "250.00000000",
                "250.00000000",
                "500.00000000",
                "100.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>Descuento")).toEqual([
                "0.00000000",
                "0.00000000",
                "500.00000000",
                "25.00000000",
            ]);
            expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual([
                "302.50000000",
                "302.50000000",
                "605.00000000",
                "82.50000000",
            ]);
            expect(texts(xml, "FacturaSimplificada")).toEqual(["S"]);
        }
    });

    it("rectifying other Invoices (S)", async () => {
        const invoice: tbai.Invoice = {
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
                serie: "F",
                number: "1",
                issuedTime: new Date("2020-02-02"),
            },
            creditNote: {
                reason: "R1",
                style: "S",
                ids: [
                    {
                        number: "0",
                        issuedTime: new Date("2020-02-01"),
                    },
                ],
                creditBase: 1000,
                creditVat: 21,
                creditRecharge: 10,
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "FacturaRectificativa>Codigo")).toEqual(["R1"]);
        expect(texts(xml, "FacturaRectificativa>Tipo")).toEqual(["S"]);
        expect(
            texts(xml, "FacturaRectificativa>ImporteRectificacionSustitutiva>BaseRectificada")
        ).toEqual(["1000.00"]);
        expect(
            texts(xml, "FacturaRectificativa>ImporteRectificacionSustitutiva>CuotaRectificada")
        ).toEqual(["21.00"]);
        expect(
            texts(
                xml,
                "FacturaRectificativa>ImporteRectificacionSustitutiva>CuotaRecargoRectificada"
            )
        ).toEqual(["10.00"]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["0"]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
            "01-02-2020",
        ]);

        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        const tbaiUrl = tbai.getTbaiUrl(signedXml, tbai.Irs.GIPUZKOA);
        expect(tbaiUrl.indexOf("020220") != -1).toBeTruthy();
    });

    it("rectifying other Invoices (S) without creditVat", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                name: "Acme Inc.",
                postal: "08080",
                country: "PT",
                address: "Acme address",
            },
            id: {
                serie: "F",
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            creditNote: {
                reason: "R1",
                style: "S",
                ids: [
                    {
                        number: "0",
                        issuedTime: new Date("2020-02-01"),
                    },
                ],
                creditBase: 1000,
                creditVat: 0,
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 0,
                    amount: 0,
                    notSubjectToVatReason: "RL",
                    merchandiseOrService: "service",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FacturaRectificativa>Codigo")).toEqual(["R1"]);
            expect(texts(xml, "FacturaRectificativa>Tipo")).toEqual(["S"]);
            expect(
                texts(xml, "FacturaRectificativa>ImporteRectificacionSustitutiva>BaseRectificada")
            ).toEqual(["1000.00"]);
            expect(
                texts(xml, "FacturaRectificativa>ImporteRectificacionSustitutiva>CuotaRectificada")
            ).toEqual(["0.00"]);
            expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["0"]);
            expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
                "01-02-2020",
            ]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("rectifying other Invoices (I)", async () => {
        const invoice: tbai.Invoice = {
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
                serie: "F",
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            creditNote: {
                reason: "R1",
                style: "I",
                ids: [
                    {
                        number: "0",
                        issuedTime: new Date("2020-02-01"),
                    },
                ],
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "FacturaRectificativa>Codigo")).toEqual(["R1"]);
        expect(texts(xml, "FacturaRectificativa>Tipo")).toEqual(["I"]);
        expect(xml.querySelector("FacturaRectificativa>ImporteRectificacionSustitutiva")).toEqual(
            null
        );
        expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["0"]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
            "01-02-2020",
        ]);

        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("rectifying other Invoices (I 2)", async () => {
        const invoice: tbai.Invoice = {
            id: {
                number: "8",
                serie: "F",
                issuedTime: new Date("2021-05-20 12:00:00Z"),
            },
            issuer: {
                irsId: "99999972C",
                name: "Empresa de pruebas",
            },
            creditNote: {
                reason: "R5",
                style: "I",
                ids: [
                    {
                        number: "5",
                        serie: "F",
                        issuedTime: new Date("2021-05-10 12:00:00Z"),
                    },
                ],
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2021-05-20 12:00:00Z"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
            ],
            vatLines: [
                {
                    base: 250,
                    rate: 21,
                    amount: 52.5,
                },
            ],
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "FacturaRectificativa>Codigo")).toEqual(["R5"]);
        expect(texts(xml, "FacturaRectificativa>Tipo")).toEqual(["I"]);
        expect(xml.querySelector("FacturaRectificativa>ImporteRectificacionSustitutiva")).toEqual(
            null
        );
        expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["5"]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
            "10-05-2021",
        ]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>SerieFactura")).toEqual(["F"]);

        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("rectifying other Invoices (I 3)", async () => {
        const invoice: tbai.Invoice = {
            creditNote: {
                ids: [
                    {
                        issuedTime: new Date("2021-11-30 17:06:24Z"),
                        number: "083",
                        serie: "RFA",
                    },
                ],
                reason: "R1",
                style: "I",
            },
            description: {
                operationDate: new Date("2021-11-30 17:06:24Z"),
                text: "Invoice description",
            },
            id: {
                issuedTime: new Date("2021-11-30 17:06:24Z"),
                number: "083",
                serie: "FA",
            },
            issuer: {
                irsId: "99999972C",
                name: "Empresa pruebas",
            },
            lines: [
                {
                    amount: -2.12,
                    amountWithVat: -2.565,
                    description: "Product 001",
                    discount: 0,
                    discountAmount: 0,
                    merchandiseOrService: "merchandise",
                    price: 2.12,
                    quantity: -1,
                    vat: 21,
                },
            ],
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
                address: "Acme address",
            },
            retentionLines: [
                {
                    amount: -0.45,
                    base: -2.12,
                    rate: 21,
                },
            ],
            simple: false,
            vat: 21,
            vatKeys: ["01"],
            vatLines: [
                {
                    amount: -0.45,
                    base: -2.12,
                    merchandiseOrService: "merchandise",
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "FacturaRectificativa>Codigo")).toEqual(["R1"]);
        expect(texts(xml, "FacturaRectificativa>Tipo")).toEqual(["I"]);
        expect(xml.querySelector("FacturaRectificativa>ImporteRectificacionSustitutiva")).toEqual(
            null
        );
        expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["083"]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
            "30-11-2021",
        ]);
        expect(texts(xml, "IDFacturaRectificadaSustituida>SerieFactura")).toEqual(["RFA"]);

        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
    });

    it("invoice without description", async () => {
        const invoice: tbai.Invoice = {
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
                serie: "",
                issuedTime: new Date("2020-02-02"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        expect(xml).toBeTruthy();
        expect(texts(xml, "FechaOperacion")).toEqual(["02-02-2020"]);
        expect(texts(xml, "DescripcionFactura")).toEqual(["/"]);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(tbai.getTbaiChainInfo(signedXml).serie).toBe("");
    });

    it("invoice with blank series", async () => {
        const invoice: tbai.Invoice = {
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
                serie: "",
                issuedTime: new Date("2020-02-02"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        expect(xml).toBeTruthy();
        expect(texts(xml, "SerieFactura")).toEqual([""]);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(tbai.getTbaiChainInfo(signedXml).serie).toBe("");
    });

    it("replacing a simplified invoice with blank series", async () => {
        const invoice: tbai.Invoice = {
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
                serie: "",
                issuedTime: new Date("2020-02-02"),
            },
            replacesTicket: true,
            replacedTicketIds: [
                {
                    number: "0",
                    issuedTime: new Date("2020-02-01"),
                },
            ],
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        expect(xml).toBeTruthy();
        expect(texts(xml, "SerieFactura")).toEqual([""]);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(tbai.getTbaiChainInfo(signedXml).serie).toBe("");
    });

    it("replacing a simplified Invoice", async () => {
        const invoice: tbai.Invoice = {
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
                issuedTime: new Date("2020-02-02"),
            },
            replacesTicket: true,
            replacedTicketIds: [
                {
                    number: "0",
                    issuedTime: new Date("2020-02-01"),
                },
            ],
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FacturaEmitidaSustitucionSimplificada")).toEqual(["S"]);
            expect(texts(xml, "IDFacturaRectificadaSustituida>NumFactura")).toEqual(["0"]);
            expect(texts(xml, "IDFacturaRectificadaSustituida>FechaExpedicionFactura")).toEqual([
                "01-02-2020",
            ]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["01"]);
        });
    });

    it("for foreign receivers", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            recipient: {
                id: "GB521313401",
                idType: "06",
                name: "Samah A Abdulla",
                country: "GB",
                postal: "IG1 4LX",
                address: "170 Cranbrook Road. Ilford. Essex",
            },
            lines: [
                {
                    description: "V-2019_16994 20191228192336646.pdf",
                    merchandiseOrService: "service",
                    quantity: 1.0,
                    price: 55.0,
                    amount: 55.0,
                },
            ],
            vat: 21,
            vatLines: [
                {
                    exemptionReason: "E4",
                    base: 55.0,
                    rate: 21, // requerido aunque se ignore
                    merchandiseOrService: "service",
                },
            ],
            total: 66.55,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "CodigoPais")).toEqual(["GB"]);
        expect(texts(xml, "IDOtro>ID")).toEqual(["GB521313401"]);
        expect(texts(xml, "CodigoPostal")).toEqual(["IG1 4LX"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>PrestacionServicios>Sujeta>Exenta>DetalleExenta>CausaExencion"
            )
        ).toEqual(["E4"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseTipoOperacion>PrestacionServicios>Sujeta>Exenta>DetalleExenta>BaseImponible"
            )
        ).toEqual(["55.00"]);
    });

    it("with some lines subject to VAT and some not", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "99999990S",
                name: "Binovo IT",
            },
            simple: true,
            id: {
                number: "100",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    exemptionReason: "E1",
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 100,
                },
            ],
            vat: 21,
            vatLines: [
                {
                    base: 250,
                    rate: 0,
                    exemptionReason: "E1",
                },
                {
                    base: 100,
                    rate: 21,
                    amount: 21.0, // simulate custom rounding
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(
                texts(xml, "TipoDesglose>DesgloseFactura>Sujeta>Exenta>DetalleExenta>CausaExencion")
            ).toEqual(["E1"]);
            expect(
                texts(xml, "TipoDesglose>DesgloseFactura>Sujeta>Exenta>DetalleExenta>BaseImponible")
            ).toEqual(["250.00"]);

            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>TipoNoExenta"
                )
            ).toEqual(["S1"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
                )
            ).toEqual(["100.00"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
                )
            ).toEqual(["21.00"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
                )
            ).toEqual(["21.00"]);
        });
    });

    it("with some lines subject to VAT and some not without vatLines", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "99999990S",
                name: "Binovo IT",
            },
            simple: true,
            id: {
                number: "100",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                    exemptionReason: "E1",
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 100,
                    vat: 21,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(
            texts(xml, "TipoDesglose>DesgloseFactura>Sujeta>Exenta>DetalleExenta>CausaExencion")
        ).toEqual(["E1"]);
        expect(
            texts(xml, "TipoDesglose>DesgloseFactura>Sujeta>Exenta>DetalleExenta>BaseImponible")
        ).toEqual(["250.00"]);

        expect(
            texts(xml, "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>TipoNoExenta")
        ).toEqual(["S1"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["100.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
            )
        ).toEqual(["21.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
            )
        ).toEqual(["21.00"]);
    });

    it("with discount amounts and letting the library compute the rest", async () => {
        const invoice: tbai.Invoice = {
            issuer: { irsId: "B00000000", name: "Ciudadano prueba" },
            id: {
                number: "00000001",
                serie: "FS9FriI2021",
                issuedTime: new Date("2021-09-20T14:24:32.433Z"),
            },
            lines: [
                {
                    description: "Tomate",
                    quantity: 2,
                    price: 13.21487603,
                    vat: 21,
                    discountAmount: 6.21, // quantity * price * (1-(1-0.10)*(1-0.15)) 10% and 15% cascade discount
                },
            ],
            simple: true,
            description: {
                text: "Invoice description",
                operationDate: new Date("2021-09-20T14:24:32.447Z"),
            },
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };

        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();

        expect(texts(xml, "ImporteUnitario")).toEqual(["13.21487603"]);
        expect(texts(xml, "IDDetalleFactura>ImporteTotal")).toEqual(["24.46589999"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["24.47"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["20.22"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
            )
        ).toEqual(["21.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
            )
        ).toEqual(["4.25"]);
    });

    it("from line details without invoice description", async () => {
        const invoiceIssuedTime = new Date();
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: invoiceIssuedTime,
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 250,
                    vat: 21,
                },
                {
                    description: "Line 03",
                    quantity: 2,
                    price: 500,
                    discount: 50,
                },
                {
                    description: "Line 04",
                    quantity: 1,
                    price: 100,
                    discount: 25,
                    vat: 10,
                },
            ],
            vat: 21,
            simple: true,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "DatosFactura>DescripcionFactura")).toEqual(["/"]);
            expect(texts(xml, "DatosFactura>FechaOperacion")).toEqual([
                toDateString(invoiceIssuedTime),
            ]);
        }
    });

    it("operationDate with future date", async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "S8686809H",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: futureDate,
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
            ],
            vat: 21,
            simple: true,
            vatKeys: ["14"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: Array<tbai.ToXmlOptions> = [
            {},
            { deviceId: "DEVICE_ID_001", roundTaxGlobally: true },
        ];
        for (const optObj of options) {
            const xml = tbai.toXmlDocument(invoice, previousId, software, 2, optObj);
            const xmlString = new XMLSerializer().serializeToString(xml);
            const signedXml = await signer.sign(xmlString);
            expect(await checkXml(signedXml)).toBe("ok");
            expect(xml).toBeTruthy();
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["14"]);
            expect(texts(xml, "DatosFactura>FechaOperacion")).toEqual([toDateString(futureDate)]);
        }
    });

    it(" and vatLines rounding is taken into account", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2021-10-27T06:21:03.894Z"),
            },
            lines: [
                {
                    description: "Text",
                    quantity: 1.0,
                    price: 1.37,
                    amount: 1.37,
                    amountWithVat: 1.66,
                    vat: 21.0,
                },
            ],
            vatLines: [
                {
                    base: 1.37,
                    rate: 21,
                    amount: 0.29,
                },
            ],
            simple: true,
            total: 1.66,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1.66"]);
        // if operationDate is missing compute it via issuedTime but
        // keep issuedTime unchanged!
        expect(texts(xml, "FechaOperacion")).toEqual(["27-10-2021"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["27-10-2021"]);
        expect(texts(xml, "HoraExpedicionFactura")).toEqual(["08:21:03"]);
    });

    it(" lines and vatLines rounding with many decimals", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2021-10-27T06:21:03.894Z"),
            },
            lines: [
                {
                    description: "Text",
                    quantity: 1.245,
                    price: 1.375,
                    amount: 1.711875,
                    amountWithVat: 2.07136875,
                    vat: 21.0,
                },
                {
                    description: "Text",
                    quantity: 0.355,
                    price: 2.558,
                    amount: 0.90809,
                    amountWithVat: 1.0987889,
                    vat: 21.0,
                },
            ],
            vatLines: [
                {
                    // 2.619965
                    base: 2.62,
                    rate: 21,
                    amount: 0.55,
                },
            ],
            simple: true,
            //3.17015765
            total: 3.17,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteUnitario")).toEqual(["1.37500000", "2.55800000"]);
        expect(texts(xml, "ImporteTotal")).toEqual(["2.07136875", "1.09878890"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["3.17"]);
        // if operationDate is missing compute it via issuedTime but
        // keep issuedTime unchanged!
        expect(texts(xml, "FechaOperacion")).toEqual(["27-10-2021"]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["27-10-2021"]);
        expect(texts(xml, "HoraExpedicionFactura")).toEqual(["08:21:03"]);
    });

    it("vatLines with notExemptionType S2", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "99999990S",
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
                number: "100",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date(),
            },
            vatLines: [
                {
                    base: 900,
                    rate: 0,
                    rate2: 0,
                    notExemptionType: "S2",
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>TipoNoExenta"
                )
            ).toEqual(["S2"]);
            expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(["0.00"].sort());
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["900.00"]);
        });
    });

    it("from description and VAT lines for other recipients and vatKey 02", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    exemptionReason: "E1",
                    merchandiseOrService: "merchandise",
                },
            ],
            vatKeys: ["02"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>IDOtro>IDType")).toEqual(["02"]);
            expect(texts(xml, "IDDestinatario>IDOtro>CodigoPais")).toEqual([]);
            expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["PT646699407"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["02"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>Exenta>DetalleExenta>CausaExencion"
                )
            ).toEqual(["E1"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>Exenta>DetalleExenta>BaseImponible"
                )
            ).toEqual(["1000.00"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        });
    });

    it("from description and many VAT lines for other recipients and vatKey 02", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                id: "PT646699407",
                idType: "02",
                country: "PT",
                name: "Acme Inc.",
                postal: "08080",
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
                    exemptionReason: "E1",
                    merchandiseOrService: "merchandise",
                },
                {
                    base: 1000,
                    rate: 0,
                    exemptionReason: "E2",
                    merchandiseOrService: "merchandise",
                },
            ],
            vatKeys: ["02"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xmls = await checkTbaiLroeXmls(invoice, previousId, software, 1, signer);
        xmls.forEach((xml) => {
            expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
            expect(texts(xml, "IDDestinatario>IDOtro>IDType")).toEqual(["02"]);
            expect(texts(xml, "IDDestinatario>IDOtro>CodigoPais")).toEqual([]);
            expect(texts(xml, "IDDestinatario>IDOtro>ID")).toEqual(["PT646699407"]);
            expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
            expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["02"]);
            expect(
                texts(
                    xml,
                    "TipoDesglose>DesgloseTipoOperacion>Entrega>Sujeta>Exenta>DetalleExenta>CausaExencion"
                )
            ).toEqual(["E1", "E2"]);
            expect(texts(xml, "ImporteTotalFactura")).toEqual(["2000.00"]);
        });
    });

    it("from description and VAT lines with notSubjectToVatReason and vatKey 08", async () => {
        const invoice: tbai.Invoice = {
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
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "FechaExpedicionFactura")).toEqual(["01-02-2020"]);
        expect(texts(xml, "IDDestinatario>NIF")).toEqual(["R9479279C"]);
        expect(texts(xml, "IDDestinatario>ApellidosNombreRazonSocial")).toEqual(["Acme Inc."]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Causa")).toEqual([
            "RL",
        ]);
        expect(texts(xml, "TipoDesglose>DesgloseFactura>NoSujeta>DetalleNoSujeta>Importe")).toEqual(
            ["1000.00"]
        );
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1000.00"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["08"]);
    });

    it("from description and vatKey 11 ", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "99999990S",
                name: "Binovo IT",
            },
            simple: true,
            id: {
                number: "100",
                issuedTime: new Date(),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date(),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
            ],
            vat: 21,
            vatKeys: ["11"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["250.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
            )
        ).toEqual(["21.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
            )
        ).toEqual(["52.50"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["302.50"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["11"]);
    });

    it("from description and vatKey 14 ", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "99999990S",
                name: "Binovo IT",
            },
            simple: true,
            recipient: {
                irsId: "S8686809H",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
            },
            id: {
                number: "100",
                issuedTime: new Date("2021-11-01"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date(),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 250,
                },
            ],
            vat: 21,
            vatKeys: ["14"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["250.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
            )
        ).toEqual(["21.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
            )
        ).toEqual(["52.50"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["302.50"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["14"]);
    });

    it("from description and vatKey 51 ", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 4,
                    isUsingSimplifiedRegime: true,
                },
            ],
            vatKeys: ["51"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["1040.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>BaseImponible"
            )
        ).toEqual(["1000.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>TipoImpositivo"
            )
        ).toEqual(["4.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>CuotaImpuesto"
            )
        ).toEqual(["40.00"]);
        expect(
            texts(
                xml,
                "TipoDesglose>DesgloseFactura>Sujeta>NoExenta>DetalleNoExenta>DesgloseIVA>DetalleIVA>OperacionEnRecargoDeEquivalenciaORegimenSimplificado"
            )
        ).toEqual(["S"]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["51"]);
    });

    it("from description and vatKey 51 and exempt invoice", async () => {
        const invoice: tbai.Invoice = {
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
                    rate: 0,
                    amount: 0,
                    rate2: 0,
                    amount2: 0,
                    base: 80,
                    exemptionReason: "E1",
                    isUsingSimplifiedRegime: true,
                },
            ],
            vatKeys: ["51"],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 1);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "Emisor>NIF")).toEqual([invoice.issuer.irsId]);
        expect(texts(xml, "Emisor>ApellidosNombreRazonSocial")).toEqual([invoice.issuer.name]);
        expect(texts(xml, "LicenciaTBAI")).toEqual([software.license]);
        expect(texts(xml, "EntidadDesarrolladora>NIF")).toEqual([software.developerIrsId]);
        expect(texts(xml, "Software>Nombre")).toEqual([software.name]);
        expect(texts(xml, "Software>Version")).toEqual([software.version]);
        expect(texts(xml, "ClaveRegimenIvaOpTrascendencia")).toEqual(["51"]);
    });

    it("when the rounding of vat lines does not match with invoice total", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            simple: true,
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Producto 001",
                    quantity: 1,
                    price: 55,
                    discount: 40.5,
                    amount: 32.73,
                    vat: 21,
                    amountWithVat: 39.6,
                },
                {
                    description: "Producto 002",
                    quantity: 5,
                    price: 0.06,
                    discount: 0,
                    amount: 0.3,
                    vat: 21,
                    amountWithVat: 0.36,
                },
            ],
            vatLines: [
                {
                    base: 33.03,
                    rate: 21,
                    amount: 6.94,
                },
            ],
            total: 39.97,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: tbai.ToXmlOptions = {
            g5015: 2,
            g5016: true,
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2, options);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
    });

    it("when the rounding of vat lines does not match with sum of each lines rounded", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            simple: true,
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            total: 1999.4,
            lines: [
                {
                    description: "Alimento 1",
                    quantity: 1,
                    price: 8.26446281,
                    amountWithVat: 10,
                    vat: 21,
                },
                {
                    description: "Alimento 2",
                    quantity: 1,
                    price: 413.2231405,
                    amountWithVat: 500,
                    vat: 21,
                },
                {
                    description: "Alimento 3",
                    quantity: 1,
                    price: 190.08264463,
                    amountWithVat: 230,
                    vat: 21,
                },
                {
                    description: "Alimento 4",
                    quantity: 1,
                    price: 896.19834711,
                    amountWithVat: 1084.4,
                    vat: 21,
                },
                {
                    description: "Alimento 5",
                    quantity: 5,
                    price: 28.92561983,
                    amountWithVat: 175,
                    vat: 21,
                },
            ],
            vatLines: [
                {
                    base: 1652.3900000000003,
                    rate: 21,
                    amount: 347.01,
                },
            ],
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: tbai.ToXmlOptions = {
            g5015: 1,
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2, options);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
    });

    it("from invoice lines with amountWithVat = 0", async () => {
        const invoice: tbai.Invoice = {
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
                issuedTime: new Date("2020-02-01 12:00:00Z"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 70.04702557734302,
                    price: 10.245201830476061,
                    amountWithVat: 0,
                    discountAmount: 717.65,
                    vat: 21,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 100,
                    amountWithVat: 121,
                    vat: 21,
                },
            ],
            total: 121,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["121.00"]);
    });

    it("Check new vats and surchages (RD 1/2023)", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            simple: true,
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            recipient: {
                irsId: "R9479279C",
                name: "Acme Inc.",
                postal: "08080",
                country: "ES",
                address: "Acme address",
                vat2: true,
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 100,
                    amountWithVat: 105.62,
                    discountAmount: 0,
                    vat: 21,
                },
            ],
            vatLines: [
                {
                    base: 100,
                    rate: 5,
                    amount: 5,
                    rate2: 0.62,
                    amount2: 0.62,
                },
            ],
            total: 105.62,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: tbai.ToXmlOptions = {
            g1177: true,
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2, options);
        expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(["5.00"].sort());
        expect(texts(xml, "DetalleIVA>TipoRecargoEquivalencia").sort()).toEqual(["0.62"].sort());
    });

    it("from invoice lines with vat 0 and not exempted", async () => {
        const invoice: tbai.Invoice = {
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
                issuedTime: new Date("2020-02-01 12:00:00Z"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 10,
                    vat: 0,
                    amountWithVat: 10,
                },
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 100,
                    vat: 21,
                    amountWithVat: 121,
                },
            ],
            vatLines: [
                {
                    base: 10,
                    rate: 0,
                    amount: 0,
                },
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                },
            ],
            total: 131,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: tbai.ToXmlOptions = {
            g1177: true,
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2, options);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["131.00"]);
        expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(["0.00", "21.00"].sort());
    });

    it("from invoice with issued by third parties", async () => {
        const invoice: tbai.Invoice = {
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
            issuedBy: "D",
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01 12:00:00Z"),
            },
            description: {
                text: "Invoice description",
                operationDate: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 02",
                    quantity: 1,
                    price: 100,
                    vat: 21,
                    amountWithVat: 121,
                },
            ],
            vatLines: [
                {
                    base: 100,
                    rate: 21,
                    amount: 21,
                },
            ],
            total: 121,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "X0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        const options: tbai.ToXmlOptions = {
            g1177: true,
        };
        const xml = tbai.toXmlDocument(invoice, previousId, software, 2, options);
        const xmlString = new XMLSerializer().serializeToString(xml);
        const signedXml = await signer.sign(xmlString);
        expect(await checkXml(signedXml)).toBe("ok");
        expect(xml).toBeTruthy();
        expect(texts(xml, "EmitidaPorTercerosODestinatario")).toEqual(["D"]);
        expect(texts(xml, "ImporteTotalFactura")).toEqual(["121.00"]);
        expect(texts(xml, "DetalleIVA>TipoImpositivo").sort()).toEqual(["21.00"].sort());
    });

    it("fixing a invoice, action type SUBSANAR", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
            isFix: true,
            hashFix: "xxx",
            actionTypeFix: "SUBSANAR",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "ESX0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        {
            const xml = tbai.toXmlDocument(invoice, null, software, 2);
            expect(texts(xml, "Cabecera>IDVersion")).toEqual(["1.0"]);
            expect(texts(xml, "Cabecera>Accion")).toEqual(["SUBSANAR"]);
            expect(texts(xml, "HuellaTBAI>Software>LicenciaTBAI")).toEqual(["LICENSE CODE"]);
            expect(texts(xml, "HuellaTBAI>Software>EntidadDesarrolladora>NIF")).toEqual([
                "X0000000X",
            ]);
            expect(texts(xml, "HuellaTBAI>Software>Nombre")).toEqual(["Acme TBAI"]);
            expect(texts(xml, "HuellaTBAI>Software>Version")).toEqual(["0.1"]);
            expect(texts(xml, "SignatureValueFirmaFactura")).toEqual(["xxx"]);
        }
    });

    it("fixing a invoice, action type MODIFICAR", async () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date("2020-02-01"),
            },
            lines: [
                {
                    description: "Line 01",
                    quantity: 1,
                    price: 150,
                },
            ],
            vat: 21,
            simple: true,
            isFix: true,
            hashFix: "xxx",
            actionTypeFix: "MODIFICAR",
        };
        const software: tbai.Software = {
            license: "LICENSE CODE",
            developerIrsId: "ESX0000000X",
            name: "Acme TBAI",
            version: "0.1",
        };
        {
            const xml = tbai.toXmlDocument(invoice, null, software, 2);
            expect(texts(xml, "Cabecera>IDVersion")).toEqual(["1.0"]);
            expect(texts(xml, "Cabecera>Accion")).toEqual(["MODIFICAR"]);
            expect(texts(xml, "HuellaTBAI>Software>LicenciaTBAI")).toEqual(["LICENSE CODE"]);
            expect(texts(xml, "HuellaTBAI>Software>EntidadDesarrolladora>NIF")).toEqual([
                "X0000000X",
            ]);
            expect(texts(xml, "HuellaTBAI>Software>Nombre")).toEqual(["Acme TBAI"]);
            expect(texts(xml, "HuellaTBAI>Software>Version")).toEqual(["0.1"]);
            expect(texts(xml, "SignatureValueFirmaFactura")).toEqual(["xxx"]);
        }
    });
});
