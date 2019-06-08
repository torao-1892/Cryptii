
import StringUtil from './StringUtil'
import ByteEncodingError from './Error/ByteEncoding'

const base64Alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const base64Variants = {
  base64: {
    label: 'Standard \'base64\' (RFC 3548, RFC 4648)',
    description: null,
    alphabet: base64Alphabet + '+/',
    padCharacter: '=',
    padCharacterOptional: false,
    foreignCharactersForbidden: true
  },
  base64url: {
    label: 'Standard \'base64url\' (RFC 4648 §5)',
    description: 'URL and Filename Safe Alphabet',
    alphabet: base64Alphabet + '-_',
    padCharacter: '=',
    padCharacterOptional: true,
    foreignCharactersForbidden: true
  },
  rfc2045: {
    label: 'Transfer encoding for MIME (RFC 2045)',
    description: null,
    alphabet: base64Alphabet + '+/',
    padCharacter: '=',
    padCharacterOptional: false,
    foreignCharactersForbidden: false,
    maxLineLength: 76,
    lineSeparator: '\r\n'
  },
  rfc1421: {
    label: 'Original Base64 (RFC 1421)',
    description: 'Privacy-Enhanced Mail (PEM)',
    alphabet: base64Alphabet + '+/',
    padCharacter: '=',
    padCharacterOptional: false,
    foreignCharactersForbidden: true,
    maxLineLength: 64,
    lineSeparator: '\r\n'
  }
}

/**
 * Utility class providing static methods for translations
 * between bytes and strings.
 */
export default class ByteEncoder {
  /**
   * Returns hex string representing given bytes.
   * @param {Uint8Array} bytes Bytes
   * @return {string} Hex string
   */
  static hexStringFromBytes (bytes) {
    return Array.from(bytes)
      .map(byte => ('0' + byte.toString(16)).slice(-2))
      .join('')
  }

  /**
   * Returns bytes from given hex string.
   * @param {string} string Hex string
   * @return {Uint8Array} Bytes
   */
  static bytesFromHexString (string) {
    // Fill up leading zero
    if (string.length % 2 === 1) {
      string = '0' + string
    }

    // Decode each byte
    const bytes = StringUtil.chunk(string, 2).map((byteString, index) => {
      const byte = parseInt(byteString, 16)
      if (byteString.match(/[0-9a-f]{2}/i) === null || isNaN(byte)) {
        throw new ByteEncodingError(
          `Invalid hex encoded byte '${byteString}'`)
      }
      return byte
    })

    return new Uint8Array(bytes)
  }

  /**
   * Returns binary string representing given bytes.
   * @param {Uint8Array} bytes Bytes
   * @return {string} Binary string
   */
  static binaryStringFromBytes (bytes) {
    return Array.from(bytes)
      .map(byte => ('0000000' + byte.toString(2)).slice(-8))
      .join('')
  }

  /**
   * Returns bytes from given binary string.
   * @param {string} string Binary string
   * @return {Uint8Array} Bytes
   */
  static bytesFromBinaryString (string) {
    // Fill up leading zero digits
    if (string.length % 8 > 0) {
      string = ('0000000' + string).substr(string.length % 8 - 1)
    }

    // Decode each byte
    const bytes = StringUtil.chunk(string, 8).map((byteString, index) => {
      const byte = parseInt(byteString, 2)
      if (byteString.match(/[0-1]{8}/) === null || isNaN(byte)) {
        throw new ByteEncodingError(
          `Invalid binary encoded byte '${byteString}'`)
      }
      return byte
    })

    return new Uint8Array(bytes)
  }

  /**
   * Returns base64 string representing given bytes.
   * @param {Uint8Array} bytes Bytes
   * @param {string} [variant='base64'] Base64 variant (base64, base64url)
   * @return {string} Base64 string
   */
  static base64StringFromBytes (bytes, variant = 'base64') {
    const options = base64Variants[variant]
    const alphabet = options.alphabet
    const padCharacter = !options.padCharacterOptional && options.padCharacter
      ? options.padCharacter : ''

    // Encode each 3-byte-pair
    let string = ''
    let byte1, byte2, byte3
    let octet1, octet2, octet3, octet4

    for (let i = 0; i < bytes.length; i += 3) {
      // Collect pair bytes
      byte1 = bytes[i]
      byte2 = i + 1 < bytes.length ? bytes[i + 1] : NaN
      byte3 = i + 2 < bytes.length ? bytes[i + 2] : NaN

      // Bits 1-6 from byte 1
      octet1 = byte1 >> 2

      // Bits 7-8 from byte 1 joined by bits 1-4 from byte 2
      octet2 = ((byte1 & 3) << 4) | (byte2 >> 4)

      // Bits 4-8 from byte 2 joined by bits 1-2 from byte 3
      octet3 = ((byte2 & 15) << 2) | (byte3 >> 6)

      // Bits 3-8 from byte 3
      octet4 = byte3 & 63

      // Map octets to characters
      string +=
        alphabet[octet1] +
        alphabet[octet2] +
        (!isNaN(byte2) ? alphabet[octet3] : padCharacter) +
        (!isNaN(byte3) ? alphabet[octet4] : padCharacter)
    }

    if (options.maxLineLength) {
      // Limit text line length, insert line separators
      let limitedString = ''
      for (let i = 0; i < string.length; i += options.maxLineLength) {
        limitedString +=
          (limitedString !== '' ? options.lineSeparator : '') +
          string.substr(i, options.maxLineLength)
      }
      string = limitedString
    }

    return string
  }

  /**
   * Returns bytes from given base64 string.
   * @param {string} string Base64 string
   * @param {string} [variant='base64']  Base64 variant (base64, base64url)
   * @return {Uint8Array} Bytes
   */
  static bytesFromBase64String (string, variant = 'base64') {
    const options = base64Variants[variant]
    const alphabet = options.alphabet

    // Translate each character into an octet
    const length = string.length
    const octets = []
    let character, octet
    let i = -1

    // Go through each character
    while (++i < length) {
      character = string[i]

      if (options.lineSeparator &&
          character === options.lineSeparator[0] &&
          string.substr(i, options.lineSeparator.length) ===
            options.lineSeparator) {
        // This is a line separator, skip it
        i = i + options.lineSeparator.length - 1
      } else if (character === options.padCharacter) {
        // This is a pad character, ignore it
      } else {
        // This is an octet or a foreign character
        octet = alphabet.indexOf(character)
        if (octet !== -1) {
          octets.push(octet)
        } else if (options.foreignCharactersForbidden) {
          throw new ByteEncodingError(
            `Forbidden character '${character}' at index ${i}`)
        }
      }
    }

    // Calculate original padding and verify it
    const padding = (4 - octets.length % 4) % 4
    if (padding === 3) {
      throw new ByteEncodingError(
        `A single remaining encoded character in the last quadruple or a ` +
        `padding of 3 characters is not allowed`)
    }

    // Fill up octets
    for (i = 0; i < padding; i++) {
      octets.push(0)
    }

    // Map pairs of octets (4) to pairs of bytes (3)
    const size = octets.length / 4 * 3
    const bytes = new Uint8Array(size)
    let j
    for (i = 0; i < octets.length; i += 4) {
      // Calculate byte index
      j = i / 4 * 3
      // Byte 1: bits 1-6 from octet 1 joined by bits 1-2 from octet 2
      bytes[j] = (octets[i] << 2) | (octets[i + 1] >> 4)
      // Byte 2: bits 3-6 from octet 2 joined by bits 1-4 from octet 3
      bytes[j + 1] = ((octets[i + 1] & 0b001111) << 4) | (octets[i + 2] >> 2)
      // Byte 3: bits 5-6 from octet 3 joined by bits 1-6 from octet 4
      bytes[j + 2] = ((octets[i + 2] & 0b000011) << 6) | octets[i + 3]
    }

    return bytes.slice(0, size - padding)
  }

  /**
   * Returns available base64 variants.
   * @return {object[]} Variant objects (containing name, label, description)
   */
  static getBase64Variants () {
    return Object.keys(base64Variants).map(name => {
      const options = base64Variants[name]
      return {
        name,
        label: options.label,
        description: options.description
      }
    })
  }
}
