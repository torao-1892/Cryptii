
import { describe } from 'mocha'

import EncoderTester from '../Helper/EncoderTester'
import A1Z26Encoder from '../../src/Encoder/A1Z26'

/** @test {A1Z26Encoder} */
describe('A1Z26Encoder', () => EncoderTester.test(A1Z26Encoder, [
  {
    content: 'thequickbrownfoxjumpsoverthelazydog',
    expectedResult:
      '20 8 5 17 21 9 3 11 2 18 15 23 14 6 15 24 10 21 13 16 19 ' +
      '15 22 5 18 20 8 5 12 1 26 25 4 15 7'
  }
]))
