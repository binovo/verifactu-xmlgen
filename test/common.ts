export const P12_FILE = "/base/test/assets/ciudadano_act.p12";
export const P12_PASSWORD = "794613";
export const P12_ALIAS =
    "SERIALNUMBER=99999990S, SN=FICTICIO, G=CIUDADANO, CN=CIUDADANO FICTICIO ACTIVO, DNQUALIFIER=-dni 99999990S, OU=Condiciones de uso en www.izenpe.com nola erabili jakiteko, OU=Herritar ziurtagiria - Certificado de ciudadano, OU=Ziurtagiri onartua - Certific";

export function loadBinaryFile(url: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
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
        req.open("GET", url, true);
        req.send();
    });
}
