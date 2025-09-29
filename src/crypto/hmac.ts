export const HMAC = {
    ALGORITHM: "HMAC",
    HASH: "SHA-256",
    import(
        key: string,
        format: "raw",
        uses: "sign" | "verify"
    ): Promise<CryptoKey> {
        return crypto.subtle.importKey(
            format,
            new TextEncoder().encode(key),
            {
                name: this.ALGORITHM,
                hash: this.HASH,
            },
            false,
            [uses],
        )
    },
    async verify(
        key: CryptoKey, 
        buffer: Uint8Array, 
        payload: string
    ): Promise<boolean> {
        return crypto.subtle.verify(
            this.ALGORITHM, 
            key, 
            // @ts-expect-error Type 'SharedArrayBuffer' is missing the following properties from type 'ArrayBuffer': resizable, resize, detached, transfer, transferToFixedLengthts(2345)  
            buffer,
            new TextEncoder().encode(payload),
        )
    }
}