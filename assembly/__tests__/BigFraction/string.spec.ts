import { BigFraction, Rounding } from "../../BigFraction";

describe('String operations', () => {

  describe("fromString and toDecimalString", () => {

    it("Accepts string input and outputs to string", () => {
      // simple decimal numbers
      let arr: string[] = [
        "1234.42",
        "-1234.42",
        "3259235823280734598273407234235353125134634513523513451235325.23423134857923498679843276987436246436346436436363463445353454",
        "-3259235823280734598273407234235353125134634513523513451235325.23423134857923498679843276987436246436346436436363463445353454",
        "0.1234",
        "-0.1234",
      ]
      for (let i = 0; i < arr.length; i++) {
        const str: string = arr[i];
        const frac: BigFraction = BigFraction.fromString(str);
        expect(frac.toNumberString()).toStrictEqual(str);
      }

      // atypical decimal number representations
      expect(BigFraction.fromString(".1234").toNumberString()).toStrictEqual("0.1234");
      expect(BigFraction.fromString("-.1234").toNumberString()).toStrictEqual("-0.1234");
      expect(BigFraction.fromString("+1234.42").toNumberString()).toStrictEqual("1234.42");

      // integer numbers
      expect(BigFraction.fromString("1234.0").toNumberString()).toStrictEqual("1234");
      expect(BigFraction.fromString("1234.",).toNumberString()).toStrictEqual("1234");
      expect(BigFraction.fromString("1234",).toNumberString()).toStrictEqual("1234");
      expect(BigFraction.fromString("-1234.0").toNumberString()).toStrictEqual("-1234");
      expect(BigFraction.fromString("-1234.",).toNumberString()).toStrictEqual("-1234");
      expect(BigFraction.fromString("-1234",).toNumberString()).toStrictEqual("-1234");
    });

    it("Accepts input strings in E notation", () => {
      // positive nubmers with E notation
      expect(BigFraction.fromString("1234E5").toNumberString()).toStrictEqual("123400000");
      expect(BigFraction.fromString("1234.42E5").toNumberString()).toStrictEqual("123442000");
      expect(BigFraction.fromString("1234E-5").toNumberString()).toStrictEqual("0.01234");
      expect(BigFraction.fromString("1234.42E-5").toNumberString()).toStrictEqual("0.0123442");

      // negative nubmers with E notation
      expect(BigFraction.fromString("-1234E5").toNumberString()).toStrictEqual("-123400000");
      expect(BigFraction.fromString("-1234.42E5").toNumberString()).toStrictEqual("-123442000");
      expect(BigFraction.fromString("-1234E-5").toNumberString()).toStrictEqual("-0.01234");
      expect(BigFraction.fromString("-1234.42E-5").toNumberString()).toStrictEqual("-0.0123442");
    });

    it("Accepts input strings with leading or trailing zeros", () => {
      // positive numbers
      expect(BigFraction.fromString("0001234.42").toNumberString()).toStrictEqual("1234.42");
      expect(BigFraction.fromString("00.1234").toNumberString()).toStrictEqual("0.1234");
      expect(BigFraction.fromString("00000123400000").toNumberString()).toStrictEqual("123400000");
      expect(BigFraction.fromString("00.123400").toNumberString()).toStrictEqual("0.1234");
      // negative numbers
      expect(BigFraction.fromString("-0001234.42").toNumberString()).toStrictEqual("-1234.42");
      expect(BigFraction.fromString("-00.1234").toNumberString()).toStrictEqual("-0.1234");
      expect(BigFraction.fromString("-00000123400000").toNumberString()).toStrictEqual("-123400000");
      expect(BigFraction.fromString("-00.123400").toNumberString()).toStrictEqual("-0.1234");
    });

    it("Throws on multiple decimal points", () => {
      const throws = (): void => {
        BigFraction.fromString("123.45.6");
      }
      expect(throws).toThrow("Input string contains more than one decimal point.");
    });

    it("Throws on unexpected character", () => {
      const throws = (): void => {
        BigFraction.fromString("12A3");
      }
      expect(throws).toThrow("Input string contains a value that is not a digit, decimal point, or \"e\" notation exponential mark.");
    });
  });

  describe("toFixed", () => {

    it("Prints output with fixed precision Rounding.UP", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.UP)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.UP)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.UP)).toStrictEqual("1234.012345679");
      expect(bn.toFixed(4, Rounding.UP)).toStrictEqual("1234.0124");
      expect(bn.toFixed(0, Rounding.UP)).toStrictEqual("1235");
      expect(bn.toFixed(-1, Rounding.UP)).toStrictEqual("124");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.UP)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.UP)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.UP)).toStrictEqual("-1234.012345679");
      expect(bnNeg.toFixed(4, Rounding.UP)).toStrictEqual("-1234.0124");
      expect(bnNeg.toFixed(0, Rounding.UP)).toStrictEqual("-1235");
      expect(bnNeg.toFixed(-1, Rounding.UP)).toStrictEqual("-124");
    });

    it("Prints output with fixed precision Rounding.DOWN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.DOWN)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.DOWN)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.DOWN)).toStrictEqual("1234.012345678");
      expect(bn.toFixed(4, Rounding.DOWN)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.DOWN)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.DOWN)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.DOWN)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.DOWN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.DOWN)).toStrictEqual("-1234.012345678");
      expect(bnNeg.toFixed(4, Rounding.DOWN)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.DOWN)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.DOWN)).toStrictEqual("-123");
    });

    it("Prints output with fixed precision Rounding.CEIL", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.CEIL)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.CEIL)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.CEIL)).toStrictEqual("1234.012345679");
      expect(bn.toFixed(4, Rounding.CEIL)).toStrictEqual("1234.0124");
      expect(bn.toFixed(0, Rounding.CEIL)).toStrictEqual("1235");
      expect(bn.toFixed(-1, Rounding.CEIL)).toStrictEqual("124");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.CEIL)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.CEIL)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.CEIL)).toStrictEqual("-1234.012345678");
      expect(bnNeg.toFixed(4, Rounding.CEIL)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.CEIL)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.CEIL)).toStrictEqual("-123");
    });

    it("Prints output with fixed precision Rounding.FLOOR", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.FLOOR)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.FLOOR)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.FLOOR)).toStrictEqual("1234.012345678");
      expect(bn.toFixed(4, Rounding.FLOOR)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.FLOOR)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.FLOOR)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.FLOOR)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.FLOOR)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.FLOOR)).toStrictEqual("-1234.012345679");
      expect(bnNeg.toFixed(4, Rounding.FLOOR)).toStrictEqual("-1234.0124");
      expect(bnNeg.toFixed(0, Rounding.FLOOR)).toStrictEqual("-1235");
      expect(bnNeg.toFixed(-1, Rounding.FLOOR)).toStrictEqual("-124");
    });

    it("Prints output with fixed precision Rounding.HALF_UP", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.HALF_UP)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.HALF_UP)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.HALF_UP)).toStrictEqual("1234.012345679");
      expect(bn.toFixed(4, Rounding.HALF_UP)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.HALF_UP)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.HALF_UP)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.HALF_UP)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.HALF_UP)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.HALF_UP)).toStrictEqual("-1234.012345679");
      expect(bnNeg.toFixed(4, Rounding.HALF_UP)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.HALF_UP)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.HALF_UP)).toStrictEqual("-123");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toFixed(5, Rounding.HALF_UP)).toStrictEqual("1234.01235");
    });

    it("Prints output with fixed precision Rounding.HALF_DOWN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.HALF_DOWN)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.HALF_DOWN)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.HALF_DOWN)).toStrictEqual("1234.012345679");
      expect(bn.toFixed(4, Rounding.HALF_DOWN)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.HALF_DOWN)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.HALF_DOWN)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.HALF_DOWN)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.HALF_DOWN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.HALF_DOWN)).toStrictEqual("-1234.012345679");
      expect(bnNeg.toFixed(4, Rounding.HALF_DOWN)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.HALF_DOWN)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.HALF_DOWN)).toStrictEqual("-123");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toFixed(5, Rounding.HALF_DOWN)).toStrictEqual("1234.01234");
    });

    it("Prints output with fixed precision Rounding.HALF_EVEN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.HALF_EVEN)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.HALF_EVEN)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.HALF_EVEN)).toStrictEqual("1234.012345679");
      expect(bn.toFixed(4, Rounding.HALF_EVEN)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.HALF_EVEN)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.HALF_EVEN)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.HALF_EVEN)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.HALF_EVEN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.HALF_EVEN)).toStrictEqual("-1234.012345679");
      expect(bnNeg.toFixed(4, Rounding.HALF_EVEN)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.HALF_EVEN)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.HALF_EVEN)).toStrictEqual("-123");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toFixed(5, Rounding.HALF_EVEN)).toStrictEqual("1234.01234");
      const strHalfOdd: string = "1234.012335";
      const bnHalfOdd: BigFraction = BigFraction.fromString(strHalfOdd);
      expect(bnHalfOdd.toFixed(5, Rounding.HALF_EVEN)).toStrictEqual("1234.01234");
    });

    it("Prints output with fixed precision Rounding.NONE", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(18, Rounding.NONE)).toStrictEqual("1234.012345678900000000");
      expect(bn.toFixed(10, Rounding.NONE)).toStrictEqual("1234.0123456789");
      expect(bn.toFixed(9, Rounding.NONE)).toStrictEqual("1234.012345678");
      expect(bn.toFixed(4, Rounding.NONE)).toStrictEqual("1234.0123");
      expect(bn.toFixed(0, Rounding.NONE)).toStrictEqual("1234");
      expect(bn.toFixed(-1, Rounding.NONE)).toStrictEqual("123");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toFixed(18, Rounding.NONE)).toStrictEqual("-1234.012345678900000000");
      expect(bnNeg.toFixed(10, Rounding.NONE)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toFixed(9, Rounding.NONE)).toStrictEqual("-1234.012345678");
      expect(bnNeg.toFixed(4, Rounding.NONE)).toStrictEqual("-1234.0123");
      expect(bnNeg.toFixed(0, Rounding.NONE)).toStrictEqual("-1234");
      expect(bnNeg.toFixed(-1, Rounding.NONE)).toStrictEqual("-123");
    });

    it("Prints output with fixed precision when rounding adds a zero", () => {
      const str: string = "1234.012345678901";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(10, Rounding.UP)).toStrictEqual("1234.0123456790");
    });

    it("Prints output with fixed precision when requested places eliminates string", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toFixed(-5, Rounding.UP)).toStrictEqual("0");
      expect(bn.toFixed(-4, Rounding.UP)).toStrictEqual("0");
    });
  });


  describe("toSignificant", () => {

    it("Prints output with significant digits Rounding.UP", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.UP)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.UP)).toStrictEqual("1234.012346");
      expect(bn.toSignificant(9, Rounding.UP)).toStrictEqual("1234.01235");
      expect(bn.toSignificant(4, Rounding.UP)).toStrictEqual("1235");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.UP)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.UP)).toStrictEqual("-1234.012346");
      expect(bnNeg.toSignificant(9, Rounding.UP)).toStrictEqual("-1234.01235");
      expect(bnNeg.toSignificant(4, Rounding.UP)).toStrictEqual("-1235");
    });

    it("Prints output with significant digits Rounding.DOWN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.DOWN)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.DOWN)).toStrictEqual("1234.012345");
      expect(bn.toSignificant(9, Rounding.DOWN)).toStrictEqual("1234.01234");
      expect(bn.toSignificant(4, Rounding.DOWN)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.DOWN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.DOWN)).toStrictEqual("-1234.012345");
      expect(bnNeg.toSignificant(9, Rounding.DOWN)).toStrictEqual("-1234.01234");
      expect(bnNeg.toSignificant(4, Rounding.DOWN)).toStrictEqual("-1234");
    });

    it("Prints output with significant digits Rounding.CEIL", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.CEIL)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.CEIL)).toStrictEqual("1234.012346");
      expect(bn.toSignificant(9, Rounding.CEIL)).toStrictEqual("1234.01235");
      expect(bn.toSignificant(4, Rounding.CEIL)).toStrictEqual("1235");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.CEIL)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.CEIL)).toStrictEqual("-1234.012345");
      expect(bnNeg.toSignificant(9, Rounding.CEIL)).toStrictEqual("-1234.01234");
      expect(bnNeg.toSignificant(4, Rounding.CEIL)).toStrictEqual("-1234");
    });

    it("Prints output with significant digits Rounding.FLOOR", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.FLOOR)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.FLOOR)).toStrictEqual("1234.012345");
      expect(bn.toSignificant(9, Rounding.FLOOR)).toStrictEqual("1234.01234");
      expect(bn.toSignificant(4, Rounding.FLOOR)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.FLOOR)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.FLOOR)).toStrictEqual("-1234.012346");
      expect(bnNeg.toSignificant(9, Rounding.FLOOR)).toStrictEqual("-1234.01235");
      expect(bnNeg.toSignificant(4, Rounding.FLOOR)).toStrictEqual("-1235");
    });

    it("Prints output with significant digits Rounding.HALF_UP", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.HALF_UP)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.HALF_UP)).toStrictEqual("1234.012346");
      expect(bn.toSignificant(9, Rounding.HALF_UP)).toStrictEqual("1234.01235");
      expect(bn.toSignificant(4, Rounding.HALF_UP)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.HALF_UP)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.HALF_UP)).toStrictEqual("-1234.012346");
      expect(bnNeg.toSignificant(9, Rounding.HALF_UP)).toStrictEqual("-1234.01235");
      expect(bnNeg.toSignificant(4, Rounding.HALF_UP)).toStrictEqual("-1234");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toSignificant(9, Rounding.HALF_UP)).toStrictEqual("1234.01235");
    });

    it("Prints output with significant digits Rounding.HALF_DOWN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.HALF_DOWN)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.HALF_DOWN)).toStrictEqual("1234.012346");
      expect(bn.toSignificant(9, Rounding.HALF_DOWN)).toStrictEqual("1234.01235");
      expect(bn.toSignificant(4, Rounding.HALF_DOWN)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.HALF_DOWN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.HALF_DOWN)).toStrictEqual("-1234.012346");
      expect(bnNeg.toSignificant(9, Rounding.HALF_DOWN)).toStrictEqual("-1234.01235");
      expect(bnNeg.toSignificant(4, Rounding.HALF_DOWN)).toStrictEqual("-1234");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toSignificant(9, Rounding.HALF_DOWN)).toStrictEqual("1234.01234");
    });

    it("Prints output with significant digits Rounding.HALF_EVEN", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.HALF_EVEN)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.HALF_EVEN)).toStrictEqual("1234.012346");
      expect(bn.toSignificant(9, Rounding.HALF_EVEN)).toStrictEqual("1234.01235");
      expect(bn.toSignificant(4, Rounding.HALF_EVEN)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.HALF_EVEN)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.HALF_EVEN)).toStrictEqual("-1234.012346");
      expect(bnNeg.toSignificant(9, Rounding.HALF_EVEN)).toStrictEqual("-1234.01235");
      expect(bnNeg.toSignificant(4, Rounding.HALF_EVEN)).toStrictEqual("-1234");

      const strHalf: string = "1234.012345";
      const bnHalf: BigFraction = BigFraction.fromString(strHalf);
      expect(bnHalf.toSignificant(9, Rounding.HALF_EVEN)).toStrictEqual("1234.01234");
      const strHalfOdd: string = "1234.012335";
      const bnHalfOdd: BigFraction = BigFraction.fromString(strHalfOdd);
      expect(bnHalfOdd.toSignificant(9, Rounding.HALF_EVEN)).toStrictEqual("1234.01234");
    });

    it("Prints output with significant digits Rounding.NONE", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(18, Rounding.NONE)).toStrictEqual("1234.0123456789");
      expect(bn.toSignificant(10, Rounding.NONE)).toStrictEqual("1234.012345");
      expect(bn.toSignificant(9, Rounding.NONE)).toStrictEqual("1234.01234");
      expect(bn.toSignificant(4, Rounding.NONE)).toStrictEqual("1234");

      const strNeg: string = "-1234.0123456789";
      const bnNeg: BigFraction = BigFraction.fromString(strNeg);
      expect(bnNeg.toSignificant(18, Rounding.NONE)).toStrictEqual("-1234.0123456789");
      expect(bnNeg.toSignificant(10, Rounding.NONE)).toStrictEqual("-1234.012345");
      expect(bnNeg.toSignificant(9, Rounding.NONE)).toStrictEqual("-1234.01234");
      expect(bnNeg.toSignificant(4, Rounding.NONE)).toStrictEqual("-1234");
    });

    it("Prints output with significant digits when rounding would add a zero", () => {
      const str: string = "1234.01234567891";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(14, Rounding.UP)).toStrictEqual("1234.012345679");
    });

    it("Prints output with significant digits when requested digits is zero or negative", () => {
      const str: string = "1234.0123456789";
      const bn: BigFraction = BigFraction.fromString(str);
      expect(bn.toSignificant(0, Rounding.UP)).toStrictEqual("0");
      expect(bn.toSignificant(-1, Rounding.UP)).toStrictEqual("0");
    });
  });

  describe("toString", () => {
    const str: string = "1234.42";
    const frac: BigFraction = BigFraction.fromString(str);
    expect(frac.toString()).toStrictEqual("[123442, 100]");
  });
});