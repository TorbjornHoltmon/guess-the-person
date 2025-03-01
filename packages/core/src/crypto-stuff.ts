import { secp256k1 } from '@noble/curves/secp256k1'

const priv = secp256k1.utils.randomPrivateKey()

const rawMsg = {
  hello: 'world',
  this: 'is',
  a: {
    private: 'message',
    123: 456,
    all: ['ko', 'fo', 'bo'],
  },
}

const stringMsg = JSON.stringify(rawMsg)

// Make the string msg a Uint8Array hex
const msg = new TextEncoder().encode(stringMsg)

// 128 characters long
const sig = secp256k1.sign(msg, priv, {
  extraEntropy: true,
})

const stringEncryptedMessage = sig.toCompactHex()

console.log('encrypted message', stringEncryptedMessage)

// Get the public key from the private key
const pub = secp256k1.getPublicKey(priv)
// To verify:
const signatureBytes = secp256k1.Signature.fromCompact(stringEncryptedMessage)
const isValid = secp256k1.verify(signatureBytes, msg, pub)
console.log('signature valid?', isValid)

const decoder = new TextDecoder()
const decodedMsg = decoder.decode(msg)
const originalObj = JSON.parse(decodedMsg)

console.log('original message:', originalObj)
