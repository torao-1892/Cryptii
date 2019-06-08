
import Factory from '../Factory'

// Package bricks
import A1Z26Encoder from '../Encoder/A1Z26'
import AffineCipherEncoder from '../Encoder/AffineCipher'
import AlphabeticalSubstitutionEncoder from '../Encoder/AlphabeticalSubstitution'
import Ascii85Encoder from '../Encoder/Ascii85'
import Base32Encoder from '../Encoder/Base32'
import Base64Encoder from '../Encoder/Base64'
import BifidCipherEncoder from '../Encoder/BifidCipher'
import BitwiseOperationEncoder from '../Encoder/BitwiseOperation'
import BlockCipherEncoder from '../Encoder/BlockCipher'
import BootstringEncoder from '../Encoder/Bootstring'
import BytesViewer from '../Viewer/Bytes'
import CaesarCipherEncoder from '../Encoder/CaesarCipher'
import CaseTransformEncoder from '../Encoder/CaseTransform'
import EnigmaEncoder from '../Encoder/Enigma'
import HashEncoder from '../Encoder/Hash'
import HMACEncoder from '../Encoder/HMAC'
import IntegerEncoder from '../Encoder/Integer'
import MorseCodeEncoder from '../Encoder/MorseCode'
import NihilistCipherEncoder from '../Encoder/NihilistCipher'
import NumeralSystemEncoder from '../Encoder/NumeralSystem'
import PolybiusSquareEncoder from '../Encoder/PolybiusSquare'
import PunycodeEncoder from '../Encoder/Punycode'
import RC4Encoder from '../Encoder/RC4'
import ReverseEncoder from '../Encoder/Reverse'
import ROT13Encoder from '../Encoder/ROT13'
import SpellingAlphabetEncoder from '../Encoder/SpellingAlphabet'
import TapCodeEncoder from '../Encoder/TapCode'
import TextViewer from '../Viewer/Text'
import UnicodeCodePointsEncoder from '../Encoder/UnicodeCodePoints'
import URLEncoder from '../Encoder/URL'
import VigenereCipherEncoder from '../Encoder/VigenereCipher'

// Singleton instance
let instance = null

/**
 * Factory for brick objects
 */
export default class BrickFactory extends Factory {
  /**
   * Brick factory constructor
   */
  constructor () {
    super()

    // Gather package brick classes
    const invokables = [
      TextViewer,
      BytesViewer,
      ReverseEncoder,
      CaseTransformEncoder,
      NumeralSystemEncoder,
      BitwiseOperationEncoder,
      MorseCodeEncoder,
      SpellingAlphabetEncoder,
      EnigmaEncoder,
      CaesarCipherEncoder,
      AffineCipherEncoder,
      ROT13Encoder,
      A1Z26Encoder,
      VigenereCipherEncoder,
      PolybiusSquareEncoder,
      BifidCipherEncoder,
      NihilistCipherEncoder,
      TapCodeEncoder,
      AlphabeticalSubstitutionEncoder,
      Base32Encoder,
      Base64Encoder,
      Ascii85Encoder,
      URLEncoder,
      PunycodeEncoder,
      BootstringEncoder,
      UnicodeCodePointsEncoder,
      IntegerEncoder,
      BlockCipherEncoder,
      RC4Encoder,
      HashEncoder,
      HMACEncoder
    ]

    // Register each brick
    invokables.forEach(this.register.bind(this))
  }

  /**
   * Registers brick invokable.
   * @param {class} invokable
   * @throws If identifier already exists.
   * @return {BrickFactory} Fluent interface
   */
  register (invokable) {
    const identifier = invokable.getMeta().name
    return super.register(identifier, invokable)
  }

  /**
   * Returns brick meta for given identifier.
   * @throws If identifier does not exist.
   * @param {string} identifier
   * @return {object} Brick meta
   */
  getMeta (identifier) {
    return this.getInvokable(identifier).getMeta()
  }

  /**
   * Returns array of brick meta objects.
   * @return {object[]}
   */
  getLibrary () {
    return this.getIdentifiers()
      .map(identifier => this.getMeta(identifier))
  }

  /**
   * Get brick factory singleton instance.
   * @return {BrickFactory}
   */
  static getInstance () {
    if (instance === null) {
      instance = new BrickFactory()
    }
    return instance
  }
}
