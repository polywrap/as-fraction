import { BigInt } from "as-bigint";
import { BigNumber } from "as-bignumber";
import { Fraction } from "../../Fraction";

describe('Construction', () => {

  it("fromBigNumber", () => {
    const str: string = "1234.42";
    const bn: BigNumber = BigNumber.from(str);
    const frac = Fraction.fromBigNumber(bn);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("fromBigInt", () => {
    const str: string = "1234";
    const bi: BigInt = BigInt.from(str);
    const frac = Fraction.fromBigInt(bi);
    expect(frac.toNumberString()).toStrictEqual(str);
  });

  it("fromArray", () => {
    const arr = [1,3];
    const frac = Fraction.fromArray(arr);
    expect(frac.toString()).toStrictEqual("[1, 3]");
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

  it("toBigNumber", () => {
    let str: string = "1234.42";
    let frac = Fraction.fromString(str);
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

  it("toBigInt", () => {
    expect(new Fraction<i32>(8, 3).toBigInt()).toStrictEqual(BigInt.fromUInt16(2))
    expect(new Fraction<i32>(12, 4).toBigInt()).toStrictEqual(BigInt.fromUInt16(3))
    expect(new Fraction<i32>(16, 5).toBigInt()).toStrictEqual(BigInt.fromUInt16(3))
  });

  it("toArray", () => {
    expect(
        new Fraction<i32>(8, 3).toArray()
    ).toStrictEqual([8, 3])

    expect(
        new Fraction<i32>(12, 4).toArray()
    ).toStrictEqual([12, 4])

    expect(
        new Fraction<i32>(16, 5).toArray()
    ).toStrictEqual([16, 5])
  });

  it("quotient", () => {
    let result = new Fraction<i32>(8, 2).quotient();
    expect(result.toString()).toStrictEqual("4.0");

    result = new Fraction<i32>(8, 20).quotient();
    expect(result.toString()).toStrictEqual("0.4");
  });

  it("reciprocal", () => {
    const result = new Fraction<i32>(8, 3).reciprocal();
    expect(result.denominator).toStrictEqual(8);
    expect(result.numerator).toStrictEqual(3);
  });

});