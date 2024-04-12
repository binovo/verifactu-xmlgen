import "regenerator-runtime/runtime";
import { TbaiSigner, getTbaiId, getTbaiUrl, getTbaiChainInfo, Irs } from "../src/tbai";
import { P12_FILE, P12_PASSWORD, P12_ALIAS, loadBinaryFile } from "./common";
import { TbaiErrorMessages } from "../src/tbai_error";

const TBAI_XML_FILE = "/base/test/assets/tbai_unsigned.xml";
const TBAI_CANCEL_XML_BASE = "/base/test/assets/tbai_cancel_unsigned.xml";

describe("Tbai initialization", () => {
    it("can load a certificate from a buffer", async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        const signer = TbaiSigner.fromBuffer(p12, P12_ALIAS, P12_PASSWORD);
        expect(signer).toBeTruthy();
    });
    it("can load a certificate with alias undefined", async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        const signer = TbaiSigner.fromBuffer(p12, undefined, P12_PASSWORD);
        expect(signer).toBeTruthy();
    });
    it("can load a certificate with alias null", async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        const signer = TbaiSigner.fromBuffer(p12, null, P12_PASSWORD);
        expect(signer).toBeTruthy();
    });
    it("can load a certificate with alias empty string", async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        const signer = TbaiSigner.fromBuffer(p12, " ", P12_PASSWORD);
        expect(signer).toBeTruthy();
    });
});

describe("Tbai signing", () => {
    let signer: TbaiSigner;

    beforeEach(async () => {
        const p12 = await loadBinaryFile(P12_FILE);
        signer = await TbaiSigner.fromBuffer(p12, P12_ALIAS, P12_PASSWORD);
    });
    it("reports exception on bad XML files", async () => {
        const EXPECTED_POLICY_URI = "https://nohost.nodomain";
        const EXPECTED_POLICY_HASH = "HASHHASHHASH";
        const badXml = "<tag></tog>";
        let exception = null;
        try {
            await signer.sign(badXml, EXPECTED_POLICY_URI, EXPECTED_POLICY_HASH);
        } catch (error) {
            exception = error;
        }
        expect(exception).toBeTruthy();
    });
    it("can sign an arbitrary XML file", async () => {
        const EXPECTED_POLICY_URI = "https://nohost.nodomain";
        const EXPECTED_POLICY_HASH = "HASHHASHHASH";
        const simpleXml = "<tag/>";
        const signedXml = await signer.sign(simpleXml, EXPECTED_POLICY_URI, EXPECTED_POLICY_HASH);
        const signedXmlDoc = new DOMParser().parseFromString(signedXml, "application/xml");
        const signedSigProperties =
            "Signature>Object>QualifyingProperties>SignedProperties>SignedSignatureProperties";
        const signingCertV2 = signedSigProperties + ">SigningCertificate";
        const policyId =
            signedSigProperties +
            ">SignaturePolicyIdentifier>SignaturePolicyId>SigPolicyId>Identifier";
        const policyHash =
            signedSigProperties +
            ">SignaturePolicyIdentifier>SignaturePolicyId>SigPolicyHash>DigestValue";
        expect(signedXmlDoc.querySelector(signingCertV2)).toBeTruthy();
        expect(signedXmlDoc.querySelector(policyId)).toBeTruthy();
        expect(signedXmlDoc.querySelector(policyHash)).toBeTruthy();
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        expect(signedXmlDoc.querySelector(policyId)!.textContent).toBe(EXPECTED_POLICY_URI);
        expect(signedXmlDoc.querySelector(policyHash)!.textContent).toBe(EXPECTED_POLICY_HASH);
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
    });
    it("can sign a TBai document and extract the ID, the URL and the chaining info", async () => {
        const TBAI_ID_RE = /TBAI-88888888X-010220-.{13}-\d{3}/;
        const tbaiXml = new TextDecoder("utf-8").decode(await loadBinaryFile(TBAI_XML_FILE));
        const signedXml = await signer.sign(tbaiXml);
        const signedXmlDoc = new DOMParser().parseFromString(signedXml, "application/xml");
        const tbaiId = getTbaiId(signedXml);
        const pieces = tbaiId.split("-");
        expect(pieces.length).toBe(5);
        const crc = pieces[4];
        expect(tbaiId).toMatch(TBAI_ID_RE);
        expect(getTbaiId(signedXmlDoc)).toMatch(TBAI_ID_RE);
        expect(crc.length).toBe(3);
        const chainInfo = getTbaiChainInfo(signedXml);
        expect(chainInfo.number).toBe("000001");
        expect(chainInfo.serie).toBe("WXYZ");
        let tbaiUrl: string;
        tbaiUrl = getTbaiUrl(signedXml, Irs.ARABA);
        const [prefixAraba, queryAraba] = tbaiUrl.split("?");
        tbaiUrl = getTbaiUrl(signedXml, Irs.BIZKAIA);
        const [prefixBizkaia, queryBizkaia] = tbaiUrl.split("?");
        tbaiUrl = getTbaiUrl(signedXml, Irs.GIPUZKOA);
        const [prefixGipuzkoa, queryGipuzkoa] = tbaiUrl.split("?");
        tbaiUrl = getTbaiUrl(signedXml, Irs.ARABA, true);
        const [prefixTestAraba, queryTestAraba] = tbaiUrl.split("?");
        tbaiUrl = getTbaiUrl(signedXml, Irs.BIZKAIA, true);
        const [prefixTestBizkaia, queryTestBizkaia] = tbaiUrl.split("?");
        tbaiUrl = getTbaiUrl(signedXml, Irs.GIPUZKOA, true);
        const [prefixTestGipuzkoa, queryTestGipuzkoa] = tbaiUrl.split("?");
        expect(prefixAraba).toBe("https://ticketbai.araba.eus/tbai/qrtbai/");
        expect(prefixBizkaia).toBe("https://batuz.eus/QRTBAI/");
        expect(prefixGipuzkoa).toBe("https://tbai.egoitza.gipuzkoa.eus/qr/");
        expect(prefixTestAraba).toBe("https://pruebas-ticketbai.araba.eus/tbai/qrtbai/");
        expect(prefixTestBizkaia).toBe("https://batuz.eus/QRTBAI/");
        expect(prefixTestGipuzkoa).toBe("https://tbai.prep.gipuzkoa.eus/qr/");
        // descartando crc las tres son iguales
        expect(queryAraba.slice(0, -3)).toBe(queryGipuzkoa.slice(0, -3));
        expect(queryAraba.slice(0, -3)).toBe(queryBizkaia.slice(0, -3));
        expect(queryAraba.slice(0, -3)).toBe(queryTestAraba.slice(0, -3));
        expect(queryAraba.slice(0, -3)).toBe(queryTestBizkaia.slice(0, -3));
        expect(queryAraba.slice(0, -3)).toBe(queryTestGipuzkoa.slice(0, -3));
        const searchParams = new URLSearchParams(queryAraba);
        const searchObj: Record<string, string> = {};
        searchParams.forEach((value: string, key: string) => {
            searchObj[key] = value;
        });
        expect(searchObj).toEqual({
            id: tbaiId,
            s: "WXYZ",
            nf: "000001",
            i: "242.00",
            cr: queryAraba.slice(-3),
        });
    });
    it("can sign a TBai cancel invoice document and extract the ID, the URL and the chaining info", async () => {
        const TBAI_ID_RE = /TBAI-88888888X-010220-.{13}-\d{3}/;
        const tbaiXml = new TextDecoder("utf-8").decode(await loadBinaryFile(TBAI_CANCEL_XML_BASE));
        const signedXml = await signer.sign(tbaiXml);
        const signedXmlDoc = new DOMParser().parseFromString(signedXml, "application/xml");
        const tbaiId = getTbaiId(signedXml);
        const pieces = tbaiId.split("-");
        expect(pieces.length).toBe(5);
        const crc = pieces[4];
        expect(tbaiId).toMatch(TBAI_ID_RE);
        expect(getTbaiId(signedXmlDoc)).toMatch(TBAI_ID_RE);
        expect(crc.length).toBe(3);
    });
    it("test the Irs's allowed in getTbaiUrl", async () => {
        const tbaiXml = new TextDecoder("utf-8").decode(await loadBinaryFile(TBAI_XML_FILE));
        const signedXml = await signer.sign(tbaiXml);
        let tbaiUrl: string;
        try {
            tbaiUrl = getTbaiUrl(signedXml, 3);
        } catch (error) {
            expect(error.message).toBe(TbaiErrorMessages.ERR_IRS_INVALID);
        }
        try {
            tbaiUrl = getTbaiUrl(signedXml, 4);
        } catch (error) {
            expect(error.message).toBe(TbaiErrorMessages.ERR_IRS_INVALID);
        }
        // Valid values
        tbaiUrl = getTbaiUrl(signedXml, 0);
        tbaiUrl = getTbaiUrl(signedXml, 1);
        tbaiUrl = getTbaiUrl(signedXml, 2);
        expect(tbaiUrl).toBeTruthy();
    });
});
