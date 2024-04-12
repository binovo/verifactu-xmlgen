export interface InvoiceIdJson {
    serie?: string;
    number: string;
    issuedTime: Date | string;
}

export interface PreviousInvoiceIdJson extends InvoiceIdJson {
    hash: string;
}

export interface InvoiceId extends InvoiceIdJson {
    issuedTime: Date;
}

/**
 * Tipo que representa cualquiera de las posibles representaciones de
 * un id de factura.
 *
 * Si es un string se tratará como TBAIID.
 *
 * Si es un número debe ser entero > 0 y se tratará como un
 * identificador de cola de envío.
 *
 * La interpretación exacta de los formatos de string y de entero
 * queda fuera del alcance de este documento.
 */
export type GeneralizedInvoiceId = InvoiceId | string | number;

export interface PreviousInvoiceId extends PreviousInvoiceIdJson {
    issuedTime: Date;
}
