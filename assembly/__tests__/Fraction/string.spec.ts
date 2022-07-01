import { Fraction } from "../..";

describe('String operations', () => {

  describe("fromString and toDecimalString", () => {

    it("Accepts string input and outputs to string", () => {
      // simple decimal numbers
      let arr: string[] = [
        "1234.42",
        "-1234.42",
        "0.1234",
        "-0.1234",
      ]
      for (let i = 0; i < arr.length; i++) {
        const str: string = arr[i];
        const frac = Fraction.fromString(str);
        expect(frac.toNumberString()).toStrictEqual(str);
      }

      // atypical decimal number representations
      expect(Fraction.fromString(".1234").toNumberString()).toStrictEqual("0.1234");
      expect(Fraction.fromString("-.1234").toNumberString()).toStrictEqual("-0.1234");
      expect(Fraction.fromString("+1234.42").toNumberString()).toStrictEqual("1234.42");

      // integer numbers
      expect(Fraction.fromString("1234.0").toNumberString()).toStrictEqual("1234");
      expect(Fraction.fromString("1234.",).toNumberString()).toStrictEqual("1234");
      expect(Fraction.fromString("1234",).toNumberString()).toStrictEqual("1234");
      expect(Fraction.fromString("-1234.0").toNumberString()).toStrictEqual("-1234");
      expect(Fraction.fromString("-1234.",).toNumberString()).toStrictEqual("-1234");
      expect(Fraction.fromString("-1234",).toNumberString()).toStrictEqual("-1234");
    });

    it("Accepts input strings in E notation", () => {
      // positive nubmers with E notation
      expect(Fraction.fromString("1234E5").toNumberString()).toStrictEqual("123400000");
      expect(Fraction.fromString("1234.42E5").toNumberString()).toStrictEqual("123442000");
      expect(Fraction.fromString("1234E-5").toNumberString()).toStrictEqual("0.01234");
      expect(Fraction.fromString("1234.42E-5").toNumberString()).toStrictEqual("0.0123442");

      // negative nubmers with E notation
      expect(Fraction.fromString("-1234E5").toNumberString()).toStrictEqual("-123400000");
      expect(Fraction.fromString("-1234.42E5").toNumberString()).toStrictEqual("-123442000");
      expect(Fraction.fromString("-1234E-5").toNumberString()).toStrictEqual("-0.01234");
      expect(Fraction.fromString("-1234.42E-5").toNumberString()).toStrictEqual("-0.0123442");
    });

    it("Accepts input strings with leading or trailing zeros", () => {
      // positive numbers
      expect(Fraction.fromString("0001234.42").toNumberString()).toStrictEqual("1234.42");
      expect(Fraction.fromString("00.1234").toNumberString()).toStrictEqual("0.1234");
      expect(Fraction.fromString("00000123400000").toNumberString()).toStrictEqual("123400000");
      expect(Fraction.fromString("00.123400").toNumberString()).toStrictEqual("0.1234");
      // negative numbers
      expect(Fraction.fromString("-0001234.42").toNumberString()).toStrictEqual("-1234.42");
      expect(Fraction.fromString("-00.1234").toNumberString()).toStrictEqual("-0.1234");
      expect(Fraction.fromString("-00000123400000").toNumberString()).toStrictEqual("-123400000");
      expect(Fraction.fromString("-00.123400").toNumberString()).toStrictEqual("-0.1234");
    });

    it("Throws on multiple decimal points", () => {
      const throws = (): void => {
        Fraction.fromString("123.45.6");
      }
      expect(throws).toThrow("Input string contains more than one decimal point.");
    });

    it("Throws on unexpected character", () => {
      const throws = (): void => {
        Fraction.fromString("12A3");
      }
      expect(throws).toThrow("Input string contains a value that is not a digit, decimal point, or \"e\" notation exponential mark.");
    });
  });

  describe("toString", () => {
    const str: string = "1234.42";
    const frac = Fraction.fromString(str);
    expect(frac.toString()).toStrictEqual("[123442, 100]");
  });
});