/*
 * Generated type guards for "verifactu_doc.ts".
 * WARNING: Do not manually change this file.
 */
import { isIrsIdType, isCountryCode } from "./verifactu_doc_types.guard";
import { SoftwareIdInfo, Software, ToXmlOptions } from "./verifactu_doc";

function evaluate(
    isCorrect: boolean,
    varName: string,
    expected: string,
    actual: any
): boolean {
    if (!isCorrect) {
        console.error(
            `${varName} type mismatch, expected: ${expected}, found:`,
            actual
        )
    }
    return isCorrect
}

export function isSoftwareIdInfo(obj: unknown, argumentName: string = "softwareIdInfo"): obj is SoftwareIdInfo {
    const typedObj = obj as SoftwareIdInfo
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isIrsIdType(typedObj["idType"]) as boolean, `${argumentName}["idType"]`, "import(\"./src/verifactu_doc_types\").IrsIdType", typedObj["idType"]) &&
        evaluate(isCountryCode(typedObj["country"]) as boolean, `${argumentName}["country"]`, "import(\"./src/verifactu_doc_types\").CountryCode", typedObj["country"])
    )
}

export function isSoftware(obj: unknown, argumentName: string = "software"): obj is Software {
    const typedObj = obj as Software
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(typeof typedObj["developerName"] === "string", `${argumentName}["developerName"]`, "string", typedObj["developerName"]) &&
        evaluate(typeof typedObj["developerIrsId"] === "string", `${argumentName}["developerIrsId"]`, "string", typedObj["developerIrsId"]) &&
        evaluate((typeof typedObj["idInfo"] === "undefined" ||
            isSoftwareIdInfo(typedObj["idInfo"]) as boolean), `${argumentName}["idInfo"]`, "import(\"./src/verifactu_doc\").SoftwareIdInfo | undefined", typedObj["idInfo"]) &&
        evaluate(typeof typedObj["id"] === "string", `${argumentName}["id"]`, "string", typedObj["id"]) &&
        evaluate(typeof typedObj["version"] === "string", `${argumentName}["version"]`, "string", typedObj["version"]) &&
        evaluate(typeof typedObj["number"] === "string", `${argumentName}["number"]`, "string", typedObj["number"]) &&
        evaluate(typeof typedObj["useOnlyVerifactu"] === "boolean", `${argumentName}["useOnlyVerifactu"]`, "boolean", typedObj["useOnlyVerifactu"]) &&
        evaluate(typeof typedObj["useMulti"] === "boolean", `${argumentName}["useMulti"]`, "boolean", typedObj["useMulti"])
    )
}

export function isToXmlOptions(obj: unknown, argumentName: string = "toXmlOptions"): obj is ToXmlOptions {
    const typedObj = obj as ToXmlOptions
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate((typeof typedObj["deviceId"] === "undefined" ||
            typeof typedObj["deviceId"] === "string"), `${argumentName}["deviceId"]`, "string | undefined", typedObj["deviceId"])
    )
}
