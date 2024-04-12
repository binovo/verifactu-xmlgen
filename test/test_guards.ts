import "regenerator-runtime/runtime";
import * as tbai from "../src/tbai";
import * as tbaiguard from "../src/tbaiguard";

describe("We can validate JSON objects of type ", () => {
    it(" invoice", () => {
        const invoice: tbai.Invoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            recipient: {
                irsId: "B0000000B",
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
                operationDate: new Date(),
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
            vatLines: [
                {
                    base: 1000,
                    rate: 21,
                },
            ],
            vatKeys: ["01", "02", "03", "04"],
        };
        const invoiceAny = JSON.parse(JSON.stringify(invoice));
        expect(tbaiguard.isInvoice(invoiceAny)).toBeTrue();
        invoiceAny.bogus = "bogus";
        expect(tbaiguard.isInvoice(invoiceAny)).toBeTrue();
        invoiceAny.creditNote.style = "S";
        expect(tbaiguard.isInvoice(invoiceAny)).toBeFalse();
        invoiceAny.creditNote.creditBase = 1000;
        invoiceAny.creditNote.creditVat = 21;
        invoiceAny.creditNote.creditRecharge = 10;
        expect(tbaiguard.isInvoice(invoiceAny)).toBeTrue();
        invoiceAny.id = "invalid id";
        expect(tbaiguard.isInvoice(invoiceAny)).toBeFalse();
        invoiceAny.id = {
            number: "1",
            issuedTime: new Date("2020-02-01"),
        };
        invoiceAny.replacesTicket = true;
        expect(tbaiguard.isInvoice(invoiceAny)).toBeFalse();
        invoiceAny.replacedTicketIds = [
            {
                number: "2",
                issuedTime: new Date("2020-02-01"),
            },
        ];
        expect(tbaiguard.isInvoice(invoiceAny)).toBeFalse();
        delete invoiceAny.creditNote;
        expect(tbaiguard.isInvoice(invoiceAny)).toBeTrue();
        invoiceAny.simple = true;
        expect(tbaiguard.isInvoice(invoiceAny)).toBeFalse();
    });

    it(" invoice with chaining", () => {
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
            lines: [
                {
                    description: "Text",
                    quantity: 10,
                    price: 100,
                },
            ],
            vat: 21,
        };
        const previousId: tbai.PreviousInvoiceId = {
            number: "0",
            issuedTime: new Date(),
            hash: "xxx",
        };
        const invoiceAny = JSON.parse(
            JSON.stringify({
                invoice: invoice,
                previousId: previousId,
            })
        );
        expect(tbaiguard.isChainedInvoice(invoiceAny)).toBeTrue();
        // check basic properties.
        expect(tbaiguard.isChainedInvoice(null)).toBeFalse();
        expect(tbaiguard.isChainedInvoice(42)).toBeFalse();
        expect(tbaiguard.isChainedInvoice({})).toBeFalse();
        expect(
            tbaiguard.isChainedInvoice({
                invoice: false,
            })
        ).toBeFalse();
        expect(
            tbaiguard.isChainedInvoice({
                previousId: false,
            })
        ).toBeFalse();
        expect(
            tbaiguard.isChainedInvoice({
                invoice: {},
                previousId: {},
            })
        ).toBeFalse();
    });

    it(" cancelation message", () => {
        const cancelInvoice: tbai.CancelInvoice = {
            issuer: {
                irsId: "X0000000X",
                name: "Binovo IT",
            },
            id: {
                number: "1",
                issuedTime: new Date(),
            },
        };
        const cancelInvoiceAny = JSON.parse(JSON.stringify(cancelInvoice));
        expect(tbaiguard.isCancelInvoice(cancelInvoiceAny)).toBeTrue();
        expect(
            tbaiguard.isCancelInvoice({ issuer: cancelInvoiceAny.issuer, id: null })
        ).toBeFalse();
        expect(tbaiguard.isCancelInvoice({ issuer: null, id: cancelInvoiceAny.id })).toBeFalse();
        expect(tbaiguard.isCancelInvoice({ issuer: cancelInvoiceAny.issuer, id: {} })).toBeFalse();
        expect(tbaiguard.isCancelInvoice({ issuer: {}, id: cancelInvoiceAny.id })).toBeFalse();
    });
});
