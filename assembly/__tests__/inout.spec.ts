import { BigInt } from "as-bigint";
import { BigNumber } from "as-bignumber";
import { Fraction } from "../Fraction";

describe('Construction', () => {

  it("fromBigNumber", () => {
    const str: string = "1234.42";
    const bn: BigNumber = BigNumber.from(str);
    const frac: Fraction = Fraction.fromBigNumber(bn);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("fromBigInt", () => {
    const str: string = "1234";
    const bi: BigInt = BigInt.from(str);
    const frac: Fraction = Fraction.fromBigInt(bi);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("generic from", () => {
    const decimalStr: string = "1234.42";
    const bn: BigNumber = BigNumber.from(decimalStr);
    const float32: f32 = F32.parseFloat(decimalStr);
    const float64: f64 = F64.parseFloat(decimalStr);
    expect(Fraction.from(decimalStr).eq(Fraction.from(bn))).toBe(true);
    expect(Fraction.from(decimalStr).toNumberString()).toStrictEqual(Fraction.from(float32).toFixed(2));
    expect(Fraction.from(decimalStr).eq(Fraction.from(float64))).toBe(true);

    const intStr: string = "1234";
    const bi: BigInt = BigInt.from(intStr);
    const int16: i16 = I16.parseInt(intStr);
    const int32: i32 = I32.parseInt(intStr);
    const int64: i64 = I64.parseInt(intStr);
    const uint16: u16 = U16.parseInt(intStr);
    const uint32: u32 = U32.parseInt(intStr);
    const uint64: u64 = U64.parseInt(intStr);
    expect(Fraction.from(intStr).eq(Fraction.from(bi))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(int16))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(int32))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(int64))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint16))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint32))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint64))).toBe(true);
  });

  it("toBigInt", () => {
    expect(
        new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).toBigInt()
    ).toBe(BigInt.fromUInt16(2))

    expect(
        new Fraction(BigInt.fromUInt16(12), BigInt.fromUInt16(4)).toBigInt()
    ).toBe(BigInt.fromUInt16(3))

    expect(
        new Fraction(BigInt.fromUInt16(16), BigInt.fromUInt16(5)).toBigInt()
    ).toBe(BigInt.fromUInt16(3))
  });

  it("toBigNumber", () => {
    let str: string = "1234.42";
    let frac: Fraction = Fraction.fromString(str);
    let bn: BigNumber = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);

    str = "0.0001234";
    frac = Fraction.fromString(str);
    bn = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);

    str = "-0.01234e4";
    frac = Fraction.fromString(str);
    bn = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);
  });

  it("quotient", () => {
    let result = new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(2)).quotient();
    expect(result.toString()).toStrictEqual("4");

    result = new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(20)).quotient();
    expect(result.toString()).toStrictEqual("0.4");
  });

  it("reciprocal", () => {
    const result = new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).reciprocal();
    expect(result.denominator).toStrictEqual(BigInt.fromUInt16(8));
    expect(result.numerator).toStrictEqual(BigInt.fromUInt16(3));
  });

});