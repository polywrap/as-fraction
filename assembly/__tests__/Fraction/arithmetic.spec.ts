import { Fraction } from "../../Fraction";
import { TestCase } from "./testUtils/TestCase";
import { plannedTestCases } from "./testUtils/testCases";
import {BigNumber} from "as-bignumber";
import { randomTestCases } from "./testUtils/randomTestCases";

const plannedCases: TestCase[] = plannedTestCases;
const randomCases: TestCase[] = randomTestCases;

describe("Arithmetic operations", () => {

  const precision = 6;

  it("adds", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      const y = Fraction.fromString<i64>(testCase.y);
      const result = x.add(y).toNumberString();
      const expected = Fraction.fromString<i64>(testCase.sum).toNumberString();
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const caseY: string = testCase.y.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const bnY = BigNumber.fromString(caseY);
      const x = Fraction.fromString<i64>(caseX);
      const y = Fraction.fromString<i64>(caseY);
      const result = x.add(y).toNumberString();
      const expected = BigNumber.from(bnX.add(bnY).toFloat64()).toString();
      expect(result).toStrictEqual(expected);
    }
  });

  it("subtracts", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      const y = Fraction.fromString<i64>(testCase.y);
      const result = x.sub(y).toNumberString();
      const expected = Fraction.fromString<i64>(testCase.difference).toNumberString();
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const caseY: string = testCase.y.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const bnY = BigNumber.fromString(caseY);
      const x = Fraction.fromString<i64>(caseX);
      const y = Fraction.fromString<i64>(caseY);
      const result = x.sub(y).toNumberString();
      const expected = BigNumber.from(bnX.sub(bnY).toFloat64()).toString();
      expect(result).toStrictEqual(expected);
    }
  });

  it("multiplies", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      const y = Fraction.fromString<i64>(testCase.y);
      const result = x.mul(y).toNumberString();
      const expected = Fraction.fromString<i64>(testCase.product).toNumberString();
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const caseY: string = testCase.y.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const bnY = BigNumber.fromString(caseY);
      const x = Fraction.fromString<i64>(caseX);
      const y = Fraction.fromString<i64>(caseY);
      const result = x.mul(y).toNumberString();
      const expected = BigNumber.from(bnX.mul(bnY).toFloat64()).toString();
      expect(result).toStrictEqual(expected);
    }
  });

  it("divides", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      const y = Fraction.fromString<i64>(testCase.y);
      if (y.isZero()) {
        continue;
      }
      const result = x.div(y).toNumberString();
      const expected = Fraction.fromString<i64>(testCase.quotient).toNumberString();
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const caseY: string = testCase.y.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const bnY = BigNumber.fromString(caseY);
      if (bnY.isZero()) {
        continue;
      }
      const x = Fraction.fromString<i64>(caseX);
      const y = Fraction.fromString<i64>(caseY);
      const result = x.mul(y).toNumberString();
      const expected = BigNumber.from(bnX.mul(bnY).toFloat64()).toString();
      expect(result).toStrictEqual(expected);
    }
  });

  it("square root", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      if (!x.isNegative) {
        const result = x.sqrt().toNumberString();
        const expected = BigNumber.from(BigNumber.fromString(testCase.x).sqrt().toFloat64()).toString();
        expect(result).toStrictEqual(expected);
      }
      const y = Fraction.fromString<i64>(testCase.y);
      if (!y.isNegative) {
        const result = y.sqrt().toNumberString();
        const expected = BigNumber.from(BigNumber.fromString(testCase.y).sqrt().toFloat64()).toString();
        expect(result).toStrictEqual(expected);
      }
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const x = Fraction.fromString<i64>(caseX);
      if (!x.isNegative) {
        const result = x.sqrt().toNumberString();
        const expected = BigNumber.from(bnX.sqrt().toFloat64()).toString();
        // same length due to precision
        let resultTrunc = result.substr(0, expected.length);
        let expectedTrunc = expected.substr(0, result.length);
        // allow last digit to differ due to rounding/precision
        resultTrunc = resultTrunc.substring(0, resultTrunc.length - 1);
        expectedTrunc = expectedTrunc.substring(0, expectedTrunc.length - 1);
        expect(resultTrunc).toStrictEqual(expectedTrunc);
      }
      const caseY: string = testCase.y.substring(0, precision);
      const bnY = BigNumber.fromString(caseY);
      const y = Fraction.fromString<i64>(caseY);
      if (!y.isNegative) {
        const result = y.sqrt().toNumberString();
        const expected = BigNumber.from(bnY.sqrt().toFloat64()).toString();
        // same length due to precision
        let resultTrunc = result.substr(0, expected.length);
        let expectedTrunc = expected.substr(0, result.length);
        // allow last digit to differ due to rounding/precision
        resultTrunc = resultTrunc.substring(0, resultTrunc.length - 1);
        expectedTrunc = expectedTrunc.substring(0, expectedTrunc.length - 1);
        expect(resultTrunc).toStrictEqual(expectedTrunc);
      }
    }
  });

  it("square", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      const squared = x.square().toNumberString();
      const expectedSquare = Fraction.fromString<i64>(testCase.xSquare).toNumberString();
      expect(squared).toStrictEqual(expectedSquare);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const x = Fraction.fromString<i64>(caseX);
      const squared = x.square().toNumberString()
      const expectedSquare = BigNumber.from(bnX.square().toFloat64()).toString();
      expect(squared).toStrictEqual(expectedSquare);
    }
  });

  it("pow", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString<i64>(testCase.x);
      // square
      const squared = x.pow(2).toNumberString()
      const expectedSquare = Fraction.fromString<i64>(testCase.xSquare).toNumberString();
      expect(squared).toStrictEqual(expectedSquare);
      // cube
      const cubed = x.pow(3).toNumberString()
      const expectedCube = Fraction.fromString<i64>(testCase.xCube).toNumberString();
      expect(cubed).toStrictEqual(expectedCube);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const testCase: TestCase = randomCases[i];
      const caseX: string = testCase.x.substring(0, precision);
      const bnX = BigNumber.fromString(caseX);
      const x = Fraction.fromString<i64>(caseX);
      // square
      const squared = x.pow(2).toNumberString();
      const expectedSquare = BigNumber.from(bnX.pow(2).toFloat64()).toString();
      expect(squared).toStrictEqual(expectedSquare);
      // cube
      const cubed = x.pow(3).toFloat().toString();
      const expectedCube = bnX.pow(3).toFloat64().toString();
      expect(cubed).toStrictEqual(expectedCube);
    }
  });

});
