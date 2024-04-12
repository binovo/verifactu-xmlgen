import * as xades from "xadesjs";
import * as fs from "fs";
import { Command, OptionValues } from "commander";
import getStdin from "get-stdin";
import * as qrcode from "qrcode";

const crypto = require("crypto").webcrypto;
global.crypto = crypto;
xades.Application.setEngine("NodeJS", crypto);

import { VERSION } from "./version";
import { BUILD_DATE } from "./build_date";
import * as tbai from "./tbai";
import { TbaiSigner, tbaiguard, verifactuguard, lroeguard, TbaiError } from "./tbai";

const SOFTWARE_DEVELOPER_ID_TYPE_ID_IRS_ID = "02";
const OPERATION_CREATE = "create";
const OPERATION_CANCEL = "cancel";
const OPERATION_LROE_CREATE = "purchase_create";
const OPERATION_LROE_CANCEL = "purchase_cancel";
const OPERATION_LROE_SSG_CREATE = "ssg_create";
const OPERATION_LROE_SSG_CANCEL = "ssg_cancel";
export const OPERATION_VERIFACTU_CREATE = "verifactu_create";
export const OPERATION_VERIFACTU_CANCEL = "verifactu_cancel";

const EXPECTED_POLICY_URI = [
    "https://ticketbai.araba.eus/tbai/sinadura/",
    "https://www.batuz.eus/fitxategiak/batuz/ticketbai/sinadura_elektronikoaren_zehaztapenak_especificaciones_de_la_firma_electronica_v1_0.pdf",
    "https://www.gipuzkoa.eus/ticketbai/sinadura",
];
const EXPECTED_POLICY_HASH = [
    "iOgvkX7/yHIDRRiPy/LYQ0UUn7QV8/11D1BFbs8yMuQ=",
    "Quzn98x3PMbSHwbUzaj5f5KOpiH0u8bvmwbbbNkO9Es=",
    "vSe1CH7eAFVkGN0X2Y7Nl9XGUoBnziDA5BGUSsyt8mg=",
];
export enum TbaiSignerErrorCodes {
    ERR_BAD_DATA = 2003,
    ERR_UNSUPPORTED_OPERATION = 2004,
    ERR_BAD_DEVELOPER_INFO = 2005,
}

export enum TbaiSignerErrorMessages {
    ERR_BAD_DATA = "Bad data",
    ERR_BAD_DEVELOPER_INFO = "Invalid developer data.",
}

interface InvoiceAndOptions {
    invoice: tbai.Invoice;
    previousId: tbai.PreviousInvoiceId;
    options: tbai.ToXmlOptions;
}

interface InvoiceVerifactuAndOptions {
    invoice: tbai.verifactu.Invoice;
    previousId: tbai.verifactu.PreviousInvoiceId;
    options: tbai.verifactu.ToXmlOptions;
}

interface CancelInvoiceVerifactuAndOptions {
    invoice: tbai.verifactu.CancelInvoice;
    previousId: tbai.verifactu.PreviousInvoiceId;
    options: tbai.verifactu.ToXmlOptions;
}

interface InvoiceSsgAndOptions {
    invoice: tbai.Invoice;
    options: tbai.lroeSsg.ToXmlOptions;
}

interface InvoicePurchaseAndOptions {
    invoice: tbai.lroe.Invoice;
    options: tbai.lroe.ToXmlOptions;
}

export function parseTaxAgency(value: string): number {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    return parsedValue;
}

async function createSignedInvoice(
    p12File: string,
    p12Alias: string,
    p12Pass: string,
    invoice: tbai.Invoice,
    previousId: tbai.PreviousInvoiceId | null,
    software: tbai.Software,
    taxAgency: number,
    options: tbai.ToXmlOptions
): Promise<string> {
    const xml = tbai.toXml(invoice, previousId, software, taxAgency, options);
    const p12 = fs.readFileSync(p12File);
    const signer = await TbaiSigner.fromBuffer(p12, p12Alias, p12Pass);
    const signedXml = await signer.sign(
        xml,
        EXPECTED_POLICY_URI[taxAgency],
        EXPECTED_POLICY_HASH[taxAgency]
    );
    return signedXml;
}

async function createSignedCancelInvoice(
    p12File: string,
    p12Alias: string,
    p12Pass: string,
    invoice: tbai.Invoice,
    software: tbai.Software,
    taxAgency: number
): Promise<string> {
    const xml = tbai.cancelInvoiceToXml(invoice, software, {});
    const p12 = fs.readFileSync(p12File);
    const signer = await TbaiSigner.fromBuffer(p12, p12Alias, p12Pass);
    const signedXml = await signer.sign(
        xml,
        EXPECTED_POLICY_URI[taxAgency],
        EXPECTED_POLICY_HASH[taxAgency]
    );
    return signedXml;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else if (!obj.previousId) {
        res = tbaiguard.isInvoice(obj.invoice);
    } else {
        res = tbaiguard.isChainedInvoice(obj);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidVerifactuInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else {
        res = verifactuguard.isInvoice(obj.invoice);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidVerifactuCancelInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else {
        res = verifactuguard.isCancelInvoice(obj.invoice);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidPurchaseInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else {
        res = lroeguard.isInvoice(obj.invoice);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidCancelInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else {
        res = tbaiguard.isCancelInvoice(obj.invoice);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidPurchaseCancelInvoiceJsonDoc(obj: any): boolean {
    let res = true;
    if (obj === null) {
        console.error("Object cannot be null");
        res = false;
    } else if (typeof obj !== "object") {
        console.error("Object expected");
        res = false;
    } else {
        res = lroeguard.isCancelInvoice(obj.invoice);
    }
    return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInvoiceJson(jsonDoc: any): InvoiceAndOptions | null {
    if (isValidInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        if (!!jsonDoc.invoice.description && jsonDoc.invoice.description.operationDate) {
            jsonDoc.invoice.description.operationDate = new Date(
                jsonDoc.invoice.description.operationDate
            );
        }
        if (!!jsonDoc.previousId && jsonDoc.previousId.issuedTime) {
            jsonDoc.previousId.issuedTime = new Date(jsonDoc.previousId.issuedTime);
        }
        return {
            invoice: jsonDoc.invoice,
            previousId: jsonDoc.previousId,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseVerifactuInvoiceJson(jsonDoc: any): InvoiceVerifactuAndOptions | null {
    if (isValidVerifactuInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        if (!!jsonDoc.invoice.description && jsonDoc.invoice.description.operationDate) {
            jsonDoc.invoice.description.operationDate = new Date(
                jsonDoc.invoice.description.operationDate
            );
        }
        if (!!jsonDoc.previousId && jsonDoc.previousId.issuedTime) {
            jsonDoc.previousId.issuedTime = new Date(jsonDoc.previousId.issuedTime);
        }
        return {
            invoice: jsonDoc.invoice,
            previousId: jsonDoc.previousId,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseVerifactuCancelInvoiceJson(jsonDoc: any): CancelInvoiceVerifactuAndOptions | null {
    if (isValidVerifactuCancelInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        if (!!jsonDoc.previousId && jsonDoc.previousId.issuedTime) {
            jsonDoc.previousId.issuedTime = new Date(jsonDoc.previousId.issuedTime);
        }
        return {
            invoice: jsonDoc.invoice,
            previousId: jsonDoc.previousId,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInvoiceSsgJson(jsonDoc: any): InvoiceSsgAndOptions | null {
    if (isValidInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        if (!!jsonDoc.invoice.description && jsonDoc.invoice.description.operationDate) {
            jsonDoc.invoice.description.operationDate = new Date(
                jsonDoc.invoice.description.operationDate
            );
        }
        return {
            invoice: jsonDoc.invoice,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePurchaseInvoiceJson(jsonDoc: any): InvoicePurchaseAndOptions | null {
    if (isValidPurchaseInvoiceJsonDoc(jsonDoc)) {
        if (jsonDoc.invoice.operationDate) {
            jsonDoc.invoice.operationDate = new Date(jsonDoc.invoice.operationDate);
        }
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        jsonDoc.invoice.receptionDate = new Date(jsonDoc.invoice.receptionDate);
        return {
            invoice: jsonDoc.invoice,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCancelInvoiceJson(jsonDoc: any): tbai.Invoice | null {
    if (isValidCancelInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        return jsonDoc.invoice as tbai.Invoice;
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCancelSsgInvoiceJson(jsonDoc: any): InvoiceSsgAndOptions | null {
    if (isValidCancelInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        return {
            invoice: jsonDoc.invoice,
            options: jsonDoc.options,
        };
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePurchaseCancelInvoiceJson(jsonDoc: any): InvoicePurchaseAndOptions | null {
    if (isValidPurchaseCancelInvoiceJsonDoc(jsonDoc)) {
        jsonDoc.invoice.id.issuedTime = new Date(jsonDoc.invoice.id.issuedTime);
        return {
            invoice: jsonDoc.invoice,
            options: jsonDoc.options,
        };
    }
    return null;
}

/**
 * Devuelve un valor válido para Software.idInfo o lanza una excepción.
 *
 * La excepción es de tipo TbaiError por lo que debe tratarse de la
 * forma correcta para devolver el error a Odoo.
 *
 * Si en los parámetros no se define el país o este es España y el
 * tipo sería 02 se descarta SoftwareIdInfo.
 */
function makeSoftwareIdInfo(args: OptionValues): tbai.SoftwareIdInfo | undefined {
    if (!args.softwareDeveloperIdCountry) {
        return undefined;
    }
    if (args.softwareDeveloperIdCountry == "ES") {
        if (
            !args.softwareDeveloperIdTypeId ||
            args.softwareDeveloperIdTypeId == SOFTWARE_DEVELOPER_ID_TYPE_ID_IRS_ID
        ) {
            return undefined;
        }
    }
    const idInfo = {
        country: args.softwareDeveloperIdCountry,
        idType: args.softwareDeveloperIdTypeId || SOFTWARE_DEVELOPER_ID_TYPE_ID_IRS_ID,
    };
    if (tbaiguard.isSoftwareIdInfo(idInfo)) {
        return idInfo;
    } else {
        throw new TbaiError(
            TbaiSignerErrorMessages.ERR_BAD_DEVELOPER_INFO,
            TbaiSignerErrorCodes.ERR_BAD_DEVELOPER_INFO
        );
    }
}

function ensureRequiredArguments(args: OptionValues): void {
    const verifactuOptions = [OPERATION_VERIFACTU_CREATE, OPERATION_VERIFACTU_CANCEL];
    let errMsg = "";
    if (verifactuOptions.includes(args.operation)) {
        if (!args.softwareId) {
            errMsg = "(-i) Software Id required";
        }
        if (!args.softwareNumber) {
            errMsg = "(-h) Software Number required";
        }
    } else {
        if (!args.taxAgency) {
            errMsg = "(-t) Tax Agency required";
        }
        if (!args.certificate) {
            errMsg = "(-c) Certificate path required";
        }
        if (!args.tbaiLicense) {
            errMsg = "(-k) TBAI License Code required";
        }
    }
    if (errMsg) {
        process.stderr.write(errMsg);
        process.exit(1);
    }
}

function parseCommandLine(): OptionValues {
    const params = new Command();
    params
        .version(VERSION)
        .description("TicketBai Signer (" + BUILD_DATE + ")")
        .requiredOption("-o, --operation <create|cancel>", "Either create an invoice or cancel one")
        .option("-a, --alias <alias>", "Certificate alias")
        .option("-t, --tax-agency <agency>", "Tax agency", parseTaxAgency)
        .option("-c, --certificate <filename>", "Path to certificate")
        .option("-k, --tbai-license <license>", "TBAI License code")
        .requiredOption(
            "-d, --software-developer-id <developer id>",
            "Software Developer ID (VAT number)"
        )
        .option("-s, --software-developer-name <name>", "Software Developer Name")
        .option(
            "--software-developer-id-type-id <02|03|04|05|06>",
            "Software Developer ID type, default 02. Ignored if software-developer-id-country is not set or empty"
        )
        .option("--software-developer-id-country <Country code>", "Software Developer Country Code")
        .requiredOption("-n, --software-name <name>", "Software name")
        .requiredOption("-v, --software-version <version>", "Software version")
        .option("-i --software-id <id>", "Software Developer Id")
        .option("-h --software-number <number>", "Software Developer Number")
        .option("-e, --testing", "Testing mode. Use testing base URLs", false);

    params.parse(process.argv);
    const args = params.opts();
    ensureRequiredArguments(args);
    return args;
}

export async function processCommand(args: OptionValues): Promise<void> {
    const password: string = process.env["CERTPWD"] || "";
    const software: tbai.Software = {
        license: args.tbaiLicense,
        developerIrsId: args.softwareDeveloperId,
        name: args.softwareName,
        version: args.softwareVersion,
    };
    const taxAgency = args.taxAgency;
    try {
        software.idInfo = makeSoftwareIdInfo(args);
        const jsonTxt = await getStdin();
        const jsonDoc = JSON.parse(jsonTxt);
        let xml: string;
        let tbaiId: string;
        let resultJson;
        switch (args.operation) {
            case OPERATION_LROE_SSG_CREATE:
                const invoiceSsgData = parseInvoiceSsgJson(jsonDoc);
                if (invoiceSsgData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = await tbai.lroeSsg.toXml(invoiceSsgData.invoice, invoiceSsgData.options);
                resultJson = {
                    lroeXml: Buffer.from(xml).toString("base64"),
                };
                break;
            case OPERATION_LROE_CREATE:
                const purchaseData = parsePurchaseInvoiceJson(jsonDoc);
                if (purchaseData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = await tbai.lroe.toXml(purchaseData.invoice, purchaseData.options);
                resultJson = {
                    lroeXml: Buffer.from(xml).toString("base64"),
                };
                break;
            case OPERATION_CREATE:
                const invoiceData = parseInvoiceJson(jsonDoc);
                if (invoiceData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                if (!invoiceData.invoice.isFix) {
                    xml = await createSignedInvoice(
                        args.certificate,
                        args.alias,
                        password,
                        invoiceData.invoice,
                        invoiceData.previousId,
                        software,
                        taxAgency,
                        invoiceData.options
                    );
                    tbaiId = tbai.getTbaiId(xml);
                    const tbaiUrl = tbai.getTbaiUrl(xml, taxAgency, args.testing);
                    const chainInfo = tbai.getTbaiChainInfo(xml);
                    resultJson = {
                        qrcode: await qrcode.toDataURL(tbaiUrl),
                        chainInfo: chainInfo,
                        tbaiXml: Buffer.from(xml).toString("base64"),
                        tbaiId: tbaiId,
                        tbaiUrl: tbaiUrl,
                    };
                } else {
                    xml = await tbai.toXml(
                        invoiceData.invoice,
                        invoiceData.previousId,
                        software,
                        taxAgency,
                        invoiceData.options
                    );
                    resultJson = {
                        qrcode: null,
                        chainInfo: null,
                        tbaiXml: Buffer.from(xml).toString("base64"),
                        tbaiId: null,
                        tbaiUrl: null,
                    };
                }
                break;
            case OPERATION_CANCEL:
                const cancelInvoice = parseCancelInvoiceJson(jsonDoc);
                if (cancelInvoice === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = await createSignedCancelInvoice(
                    args.certificate,
                    args.alias,
                    password,
                    cancelInvoice,
                    software,
                    taxAgency
                );
                tbaiId = tbai.getTbaiId(xml);
                resultJson = {
                    tbaiXml: Buffer.from(xml).toString("base64"),
                    tbaiId: tbaiId,
                };
                break;
            case OPERATION_LROE_SSG_CANCEL:
                const cancelInvoiceSsgData = parseCancelSsgInvoiceJson(jsonDoc);
                if (cancelInvoiceSsgData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = tbai.lroeSsg.cancelInvoiceToXml(
                    cancelInvoiceSsgData.invoice,
                    cancelInvoiceSsgData.options
                );
                resultJson = {
                    lroeXml: Buffer.from(xml).toString("base64"),
                };
                break;
            case OPERATION_LROE_CANCEL:
                const cancelPurchaseData = parsePurchaseCancelInvoiceJson(jsonDoc);
                if (cancelPurchaseData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = tbai.lroe.cancelInvoiceToXml(
                    cancelPurchaseData.invoice,
                    cancelPurchaseData.options
                );
                resultJson = {
                    lroeXml: Buffer.from(xml).toString("base64"),
                };
                break;

            case OPERATION_VERIFACTU_CREATE:
                const softwareData: tbai.verifactu.Software = {
                    developerName: args.softwareDeveloperName,
                    developerIrsId: args.softwareDeveloperId,
                    name: args.softwareName,
                    id: args.softwareId,
                    version: args.softwareVersion,
                    number: args.softwareNumber,
                    useOnlyVerifactu: false,
                    useMulti: true,
                };
                const invoiceVData = parseVerifactuInvoiceJson(jsonDoc);
                if (invoiceVData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = await tbai.verifactu.toXml(
                    invoiceVData.invoice,
                    invoiceVData.previousId,
                    softwareData,
                    invoiceVData.options
                );
                const chainInfo = tbai.getVerifactuChainInfo(xml);
                resultJson = {
                    qrcode: null,
                    chainInfo: chainInfo,
                    verifactuXml: Buffer.from(xml).toString("base64"),
                };
                break;

            case OPERATION_VERIFACTU_CANCEL:
                const softwareCancelData: tbai.verifactu.Software = {
                    developerName: args.softwareDeveloperName,
                    developerIrsId: args.softwareDeveloperId,
                    name: args.softwareName,
                    id: args.softwareId,
                    version: args.softwareVersion,
                    number: args.softwareNumber,
                    useOnlyVerifactu: false,
                    useMulti: true,
                };
                const cancelInvoiceVData = parseVerifactuCancelInvoiceJson(jsonDoc);
                if (cancelInvoiceVData === null) {
                    throw new TbaiError(
                        TbaiSignerErrorMessages.ERR_BAD_DATA,
                        TbaiSignerErrorCodes.ERR_BAD_DATA
                    );
                }
                xml = await tbai.verifactu.cancelInvoiceToXml(
                    cancelInvoiceVData.invoice,
                    cancelInvoiceVData.previousId,
                    softwareCancelData,
                    cancelInvoiceVData.options
                );
                const cancelChainInfo = tbai.getVerifactuCancelChainInfo(xml);
                resultJson = {
                    qrcode: null,
                    chainInfo: cancelChainInfo,
                    verifactuXml: Buffer.from(xml).toString("base64"),
                };
                break;

            default:
                throw new TbaiError(
                    "Unsupported operation: " + args.operation,
                    TbaiSignerErrorCodes.ERR_UNSUPPORTED_OPERATION
                );
        }
        process.stdout.write(JSON.stringify(resultJson));
    } catch (e) {
        let errMsg = e.message + "\n";
        if (e instanceof TbaiError) {
            errMsg = e.message + "\n" + e.code + "\n";
        }
        process.stderr.write(errMsg);
        process.exit(1);
    }
}

/* eslint-enable @typescript-eslint/no-unused-vars */
async function main(): Promise<void> {
    const args = parseCommandLine();
    processCommand(args);
}

main();
