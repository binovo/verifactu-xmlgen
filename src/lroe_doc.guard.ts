/*
 * Generated type guards for "lroe_doc.ts".
 * WARNING: Do not manually change this file.
 */
import { LroeModel, ToXmlOptions } from "./lroe_doc";

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

export function isLroeModel(obj: unknown, argumentName: string = "lroeModel"): obj is LroeModel {
    const typedObj = obj as LroeModel
    return (
        (typedObj === "240" ||
            typedObj === "140")
    )
}

export function isToXmlOptions(obj: unknown, argumentName: string = "toXmlOptions"): obj is ToXmlOptions {
    const typedObj = obj as ToXmlOptions
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(isLroeModel(typedObj["model"]) as boolean, `${argumentName}["model"]`, "import(\"./src/lroe_doc\").LroeModel", typedObj["model"])
    )
}
