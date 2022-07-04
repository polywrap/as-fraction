import { Fraction } from "../../Fraction";

describe('Construction', () => {

  it("gcd normalization", () => {
    expect(new Fraction<i32>(20, 4).toArray()).toStrictEqual([20 / 4, 4 / 4]);
    expect(new Fraction<i32>(4200, 3780).toArray()).toStrictEqual([4200 / 420, 3780 / 420]);
    expect(new Fraction<i32>(421345631,56325234).toArray()).toStrictEqual([421345631 / 7, 56325234 / 7]);
  });

  it("fromArray", () => {
    const arr = [1,3];
    const frac = Fraction.fromArray(arr);
    expect(frac.toString()).toStrictEqual("[1, 3]");
  });

  it("fromFloat", () => {
    const shortFloat: f64 = <f64>6 / <f64>4;
    const frac32 = Fraction.fromFloat(shortFloat);
    expect(frac32.toNumberString()).toStrictEqual(shortFloat.toString());

    const longFloat: f64 = <f64>1 / <f64>3;
    const frac64 = Fraction.fromFloat<f64, i64>(longFloat);
    expect(frac64.toNumberString()).toStrictEqual(longFloat.toString());
  });

  it("generic from", () => {
    const decimalStr: string = "1234.43";
    const float32: f32 = F32.parseFloat(decimalStr);
    const float64: f64 = F64.parseFloat(decimalStr);
    const expectedFloat32: string = Fraction.from<f32, i64>(float32).toNumberString().substring(0, decimalStr.length);
    expect(Fraction.from(decimalStr).toNumberString()).toStrictEqual(expectedFloat32);
    expect(Fraction.from(decimalStr).eq(Fraction.from(float64))).toBe(true);

    const intStr: string = "1234";
    const int16: i16 = I16.parseInt(intStr);
    const int32: i32 = I32.parseInt(intStr);
    const int64: i64 = I64.parseInt(intStr);
    const uint16: u16 = U16.parseInt(intStr);
    const uint32: u32 = U32.parseInt(intStr);
    const uint64: u64 = U64.parseInt(intStr);
    expect(Fraction.from(intStr).eq(Fraction.from(int16))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(int32))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(int64))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint16))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint32))).toBe(true);
    expect(Fraction.from(intStr).eq(Fraction.from(uint64))).toBe(true);
  });

  it("toArray", () => {
    expect(
        new Fraction<i32>(8, 3).toArray()
    ).toStrictEqual([8, 3])

    expect(
        new Fraction<i32>(12, 4).toArray()
    ).toStrictEqual([3, 1])

    expect(
        new Fraction<i32>(16, 5).toArray()
    ).toStrictEqual([16, 5])
  });

  it("toInt", () => {
    expect(new Fraction<i32>(8, 3).toInt()).toStrictEqual(2);
    expect(new Fraction<i32>(12, 4).toInt()).toStrictEqual(3);
    expect(new Fraction<i32>(16, 5).toInt()).toStrictEqual(3);
    expect(new Fraction<u64>(16, 5).toInt()).toStrictEqual(<u64>3);
  });

  it("toFloat", () => {
    let str: string = "1234.42";
    let frac = Fraction.fromString(str);
    let float: f64 = F64.parseFloat(str);
    expect(frac.toFloat()).toStrictEqual(float);

    str = "0.0001234";
    frac = Fraction.fromString(str);
    float = F64.parseFloat(str);
    expect(frac.toFloat()).toStrictEqual(float);

    str = "-0.01234e4";
    frac = Fraction.fromString(str);
    float = F64.parseFloat(str);
    expect(frac.toFloat()).toStrictEqual(float);

    str = "1234.42";
    frac = Fraction.fromString(str);
    let float32 = F32.parseFloat(str);
    expect(frac.toFloat<f32>()).toStrictEqual(float32);
  });

  it("toFraction", () => {
    let a: Fraction<i32> = new Fraction<i32>(8, 3);
    let b: Fraction<u8> = new Fraction<u8>(8, 3);
    let c: Fraction<u64> = new Fraction<u64>(8, 3);
    expect(a.toFraction<u8>()).toStrictEqual(b);
    expect(a.toFraction<u64>()).toStrictEqual(c);
    expect(b.toFraction<i32>()).toStrictEqual(a);
    expect(b.toFraction<u64>()).toStrictEqual(c);
    expect(c.toFraction<i32>()).toStrictEqual(a);
    expect(c.toFraction<u8>()).toStrictEqual(b);
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