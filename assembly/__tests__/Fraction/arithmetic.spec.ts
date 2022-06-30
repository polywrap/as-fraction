import { Fraction } from "../../Fraction";
import { TestCase } from "./testUtils/TestCase";
import { plannedTestCases } from "./testUtils/testCases";
import {BigNumber} from "as-bignumber";
import { randomTestCases } from "./testUtils/randomTestCases";

const plannedCases: TestCase[] = plannedTestCases;
const randomCases: TestCase[] = randomTestCases;

describe("Arithmetic operations", () => {

  it("adds", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      const y = Fraction.fromString(testCase.y);
      const result = x.add(y).toSignificant(18);
      const expected = Fraction.fromString(testCase.sum).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const bnY = BigNumber.fromString(testCase.y.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      const y = Fraction.fromBigNumber(bnY);
      const result = x.add(y).toSignificant(18);
      const expected = bnX.add(bnY).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
  });

  it("subtracts", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      const y = Fraction.fromString(testCase.y);
      const result = x.sub(y).toSignificant(18);
      const expected = Fraction.fromString(testCase.difference).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const bnY = BigNumber.fromString(testCase.y.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      const y = Fraction.fromBigNumber(bnY);
      const result = x.sub(y).toSignificant(18);
      const expected = bnX.sub(bnY).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
  });

  it("multiplies", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      const y = Fraction.fromString(testCase.y);
      const result = x.mul(y).toSignificant(18);
      const expected = Fraction.fromString(testCase.product).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 7;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const bnY = BigNumber.fromString(testCase.y.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      const y = Fraction.fromBigNumber(bnY);
      const result = x.mul(y).toSignificant(18);
      const expected = bnX.mul(bnY).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
  });

  it("divides", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const y = Fraction.fromString(testCase.y);
      if (y.isZero()) {
        continue;
      }
      const x = Fraction.fromString(testCase.x);
      const result = x.div(y).toSignificant(18)
      const expected = BigNumber.fromString(testCase.quotient).toSignificant(18);
      expect(result).toStrictEqual(expected);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnY = BigNumber.fromString(testCase.y.substring(0, precision));
      if (bnY.isZero()) {
        continue;
      }
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      const y = Fraction.fromBigNumber(bnY);
      const result = x.div(y).toSignificant(18)
      const expected = bnX.div(bnY).toSignificant(18)
      expect(result).toStrictEqual(expected);
    }
  });

  it("square root", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      if (!x.isNegative) {
        const result = x.sqrt().toSignificant(13);
        const expected = Fraction.fromString(testCase.sqrtX).toSignificant(13);
        expect(result).toStrictEqual(expected);
      }
      const y = Fraction.fromString(testCase.y);
      if (!y.isNegative) {
        const result = y.sqrt().toSignificant(13);
        const expected = Fraction.fromString(testCase.sqrtY).toSignificant(13);
        expect(result).toStrictEqual(expected);
      }
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      if (!x.isNegative) {
        const result = x.sqrt().toSignificant(13);
        const expected = bnX.sqrt().toSignificant(13);
        expect(result).toStrictEqual(expected);
      }
      const bnY = BigNumber.fromString(testCase.y.substring(0, precision));
      const y = Fraction.fromBigNumber(bnY);
      if (!y.isNegative) {
        const result = y.sqrt().toSignificant(13);
        const expected = bnY.sqrt().toSignificant(13);
        expect(result).toStrictEqual(expected);
      }
    }
  });

  it("square", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      // square
      const squared = x.square().toSignificant(18);
      const expectedSquare = Fraction.fromString(testCase.xSquare).toSignificant(18);
      expect(squared).toStrictEqual(expectedSquare);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      // square
      const squared = x.square().toSignificant(18);
      const expectedSquare = bnX.square().toSignificant(18);
      expect(squared).toStrictEqual(expectedSquare);
    }
  });

  it("pow", () => {
    for (let i = 0; i < plannedCases.length; i++) {
      const testCase: TestCase = plannedCases[i];
      const x = Fraction.fromString(testCase.x);
      // square
      const squared = x.pow(2).toSignificant(18);
      const expectedSquare = Fraction.fromString(testCase.xSquare).toSignificant(18);
      expect(squared).toStrictEqual(expectedSquare);
      // cube
      const cubed = x.pow(3).toSignificant(18);
      const expectedCube = Fraction.fromString(testCase.xCube).toSignificant(18);
      expect(cubed).toStrictEqual(expectedCube);
    }
    for (let i = 0; i < randomCases.length; i++) {
      const precision = 6;
      const testCase: TestCase = randomCases[i];
      const bnX = BigNumber.fromString(testCase.x.substring(0, precision));
      const x = Fraction.fromBigNumber(bnX);
      // square
      const squared = x.pow(2).toSignificant(18);
      const expectedSquare = bnX.pow(2).toSignificant(18);
      expect(squared).toStrictEqual(expectedSquare);
      // cube
      const cubed = x.pow(3).toSignificant(18);
      const expectedCube = bnX.pow(3).toSignificant(18);
      expect(cubed).toStrictEqual(expectedCube);
    }
  });

});
