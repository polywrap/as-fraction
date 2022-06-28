import { BigInt } from "as-bigint";
import { BigNumber } from "as-bignumber";
import { BigFraction } from "../../BigFraction";

describe('Construction', () => {

  it("fromBigNumber", () => {
    const str: string = "1234.42";
    const bn: BigNumber = BigNumber.from(str);
    const frac: BigFraction = BigFraction.fromBigNumber(bn);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("fromBigInt", () => {
    const str: string = "1234";
    const bi: BigInt = BigInt.from(str);
    const frac: BigFraction = BigFraction.fromBigInt(bi);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("fromArray", () => {
    const arr: BigInt[] = [BigInt.from(1), BigInt.from(3)];
    const frac: BigFraction = BigFraction.fromArray(arr);
    expect(frac.toString()).toStrictEqual("[1, 3]");
  });

  it("generic from", () => {
    const decimalStr: string = "1234.42";
    const bn: BigNumber = BigNumber.from(decimalStr);
    const float32: f32 = F32.parseFloat(decimalStr);
    const float64: f64 = F64.parseFloat(decimalStr);
    expect(BigFraction.from(decimalStr).eq(BigFraction.from(bn))).toBe(true);
    expect(BigFraction.from(decimalStr).toNumberString()).toStrictEqual(BigFraction.from(float32).toFixed(2));
    expect(BigFraction.from(decimalStr).eq(BigFraction.from(float64))).toBe(true);

    const intStr: string = "1234";
    const bi: BigInt = BigInt.from(intStr);
    const int16: i16 = I16.parseInt(intStr);
    const int32: i32 = I32.parseInt(intStr);
    const int64: i64 = I64.parseInt(intStr);
    const uint16: u16 = U16.parseInt(intStr);
    const uint32: u32 = U32.parseInt(intStr);
    const uint64: u64 = U64.parseInt(intStr);
    expect(BigFraction.from(intStr).eq(BigFraction.from(bi))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(int16))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(int32))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(int64))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(uint16))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(uint32))).toBe(true);
    expect(BigFraction.from(intStr).eq(BigFraction.from(uint64))).toBe(true);
  });

  it("toBigNumber", () => {
    let str: string = "1234.42";
    let frac: BigFraction = BigFraction.fromString(str);
    let bn: BigNumber = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);

    str = "0.0001234";
    frac = BigFraction.fromString(str);
    bn = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);

    str = "-0.01234e4";
    frac = BigFraction.fromString(str);
    bn = BigNumber.from(str);
    expect(frac.toBigNumber()).toStrictEqual(bn);
  });

  it("toBigInt", () => {
    expect(
        new BigFraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).toBigInt()
    ).toStrictEqual(BigInt.fromUInt16(2))

    expect(
        new BigFraction(BigInt.fromUInt16(12), BigInt.fromUInt16(4)).toBigInt()
    ).toStrictEqual(BigInt.fromUInt16(3))

    expect(
        new BigFraction(BigInt.fromUInt16(16), BigInt.fromUInt16(5)).toBigInt()
    ).toStrictEqual(BigInt.fromUInt16(3))
  });

  it("toArray", () => {
    expect(
        new BigFraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).toArray()
    ).toStrictEqual([BigInt.fromUInt16(8), BigInt.fromUInt16(3)])

    expect(
        new BigFraction(BigInt.fromUInt16(12), BigInt.fromUInt16(4)).toArray()
    ).toStrictEqual([BigInt.fromUInt16(12), BigInt.fromUInt16(4)])

    expect(
        new BigFraction(BigInt.fromUInt16(16), BigInt.fromUInt16(5)).toArray()
    ).toStrictEqual([BigInt.fromUInt16(16), BigInt.fromUInt16(5)])
  });

  it("quotient", () => {
    let result = new BigFraction(BigInt.fromUInt16(8), BigInt.fromUInt16(2)).quotient();
    expect(result.toString()).toStrictEqual("4");

    result = new BigFraction(BigInt.fromUInt16(8), BigInt.fromUInt16(20)).quotient();
    expect(result.toString()).toStrictEqual("0.4");
  });

  it("reciprocal", () => {
    const result = new BigFraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).reciprocal();
    expect(result.denominator).toStrictEqual(BigInt.fromUInt16(8));
    expect(result.numerator).toStrictEqual(BigInt.fromUInt16(3));
  });

});