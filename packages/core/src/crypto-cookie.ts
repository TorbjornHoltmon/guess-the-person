const algorithm = { name: 'HMAC', hash: 'SHA-256' }

interface CookieSignerOptions {
  secret: string
}

export function createCookieSigner(options: CookieSignerOptions) {
  return new CookieSigner(options.secret)
}

class CookieSigner {
  private secret: string
  private key: CryptoKey | undefined

  constructor(secret: string) {
    this.secret = secret
  }

  async getCryptoKey(): Promise<CryptoKey> {
    if (this.key) return this.key
    const keyMaterial = new TextEncoder().encode(this.secret)
    const key = await crypto.subtle.importKey('raw', keyMaterial, algorithm, false, ['sign', 'verify'])
    this.key = key
    return key
  }

  async sign(data: object): Promise<string> {
    const jsonStr = JSON.stringify(data)
    const message = new TextEncoder().encode(jsonStr)
    const key = await this.getCryptoKey()
    const signature = await crypto.subtle.sign(algorithm, key, message)
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    return `${jsonStr}.${base64Signature}`
  }

  async verify(signedData: string): Promise<object | null> {
    try {
      // Find the last dot to split payload and signature
      const lastDotIndex = signedData.lastIndexOf('.')
      if (lastDotIndex === -1) return null

      const jsonStr = signedData.slice(0, lastDotIndex)
      const base64Signature = signedData.slice(lastDotIndex + 1)

      const message = new TextEncoder().encode(jsonStr)

      const signature = Uint8Array.from(atob(base64Signature), (c) => c.charCodeAt(0))

      const key = await this.getCryptoKey()

      const isValid = await crypto.subtle.verify(algorithm, key, signature, message)

      return isValid ? JSON.parse(jsonStr) : null
    } catch {
      return null
    }
  }
}
