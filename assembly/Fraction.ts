import { BigInt } from "as-bigint";
import { BigNumber, Rounding } from "as-bignumber";
import {BigFraction} from "./BigFraction";

export class Fraction<T extends Number> {
  public readonly numerator: T;
  public readonly denominator: T;

  // 155, the number of digits in the maximum value of a 512 bit integer
  public static DEFAULT_PRECISION: i32 = 155;
  public static DEFAULT_ROUNDING: Rounding = Rounding.HALF_UP;

  // CONSTRUCTORS //////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(numerator: T, denominator: T) {
    if (!isInteger<T>(denominator)) {
      throw new Error("Fraction numerator and denominator must be integers");
    }
    if (denominator == 0) {
      throw new Error("Divide by zero");
    }
    this.numerator = numerator;
    this.denominator = denominator;
  }

  /**
   * Returns a new {Fraction} instance from generic type {TArg}.
   *
   * @param  val the number as {BigNumber}, {BigInt}, {BigInt[]}, string, or {number}
   * @return the new {Fraction<TOut>} instance
   */
  static from<U, TOut extends Number = i64>(val: U): Fraction<TOut> {
    if (val instanceof Fraction) {
      if (nameof<TOut>() == nameof(val.numerator)) return val;
      return val.toFraction<TOut>();
    }
    if (isArray<U>(val)) return this.fromArray(val);
    if (val instanceof BigNumber) return Fraction.fromBigNumber<TOut>(val);
    if (isString<U>(val)) return Fraction.fromString<TOut>(val);
    if (val instanceof BigInt) return Fraction.fromBigInt<TOut>(val);
    if (isFloat<U>(val)) return Fraction.fromBigNumber<TOut>(BigNumber.fromFloat64(<f64>val), true);
    if (isInteger<U>(val)) return new Fraction<TOut>(<TOut>val, <TOut>1);

    throw new TypeError("Unsupported generic type " + nameof<U>(val));
  }

  static fromArray<W extends Number>(arr: Array<W>): Fraction<W> {
    if (!isInteger<W>(arr[0])) {
      throw new TypeError("Unsupported generic type " + nameof<W>(arr[0]));
    }
    if (arr.length != 2) {
      throw new Error(
        "Unexpected length: expected an array of length 2 in the form [numerator, denominator]"
      );
    }
    return new Fraction<W>(arr[0], arr[1]);
  }

  static fromBigNumber<TOut extends Number = i64>(val: BigNumber, unsafe: boolean = false): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    if (!unsafe) {
      const outType: string = nameof<TOut>();
      const precision: i32 = val.precision;
      Fraction.checkBigNumberSafety(outType, precision);
    }
    if (val.e > 0) {
      const scale = BigInt.fromString("1".padEnd(1 + val.e, "0"));
      if (val.m.isNegative) {
        return new Fraction<TOut>(<TOut>val.m.toInt64(), <TOut>scale.toUInt64());
      }
      return new Fraction<TOut>(<TOut>val.m.toUInt64(), <TOut>scale.toUInt64());
    } else if (val.e < 0) {
      const scale = BigInt.fromString("1".padEnd(1 - val.e, "0"));
      const intVal: BigInt = val.m.mul(scale);
      if (intVal.isNegative) {
        return new Fraction<TOut>(<TOut>intVal.toInt64(), <TOut>1);
      }
      return new Fraction<TOut>(<TOut>intVal.toUInt64(), <TOut>1);
    } else {
      if (val.m.isNegative) {
        return new Fraction<TOut>(<TOut>val.m.toInt64(), <TOut>1);
      }
      return new Fraction<TOut>(<TOut>val.m.toUInt64(), <TOut>1);
    }
  }

  static fromBigInt<TOut extends Number = i64>(val: BigInt): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    return new Fraction<TOut>(<TOut>(isSigned<TOut>() ? val.toInt64() : val.toUInt64()), <TOut>1);
  }

  static fromString<TOut extends Number = i64>(val: string): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    return Fraction.fromBigNumber<TOut>(BigNumber.fromString(val, 0));
  }

  // OUTPUT ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  toString(): string {
    return `[${this.numerator}, ${this.denominator}]`
  }

  toNumberString(precision: i32 = Fraction.DEFAULT_PRECISION, rounding: Rounding = Fraction.DEFAULT_ROUNDING): string {
    return BigNumber.fromFraction(
        BigInt.from(this.numerator),
        BigInt.from(this.denominator),
        precision,
        rounding
    ).toString();
  }

  toSignificant(
      digits: i32,
      rounding: Rounding = Rounding.HALF_UP
  ): string {
    if (digits < 0) {
      return "0";
    }
    return BigNumber.fromFraction(
        BigInt.from(this.numerator),
        BigInt.from(this.denominator),
        Fraction.DEFAULT_PRECISION,
        rounding
    ).toSignificant(digits, rounding);
  }

  toFixed(
      places: i32,
      rounding: Rounding = Rounding.HALF_UP
  ): string {
    return BigNumber.fromFraction(
        BigInt.from(this.numerator),
        BigInt.from(this.denominator),
        Fraction.DEFAULT_PRECISION,
        rounding
    ).toFixed(places, rounding);
  }

  toBigNumber(precision: i32 = Fraction.DEFAULT_PRECISION, rounding: Rounding = Fraction.DEFAULT_ROUNDING): BigNumber {
    const numerator: BigNumber = BigNumber.from(this.numerator);
    const denominator: BigNumber = BigNumber.from(this.denominator);
    return numerator.div(denominator, precision, rounding);
  }

  // performs floor division
  toBigInt(): BigInt {
    return BigInt.from(this.numerator / this.denominator);
  }

  // performs floor division
  toInt(): T {
    return this.numerator / this.denominator;
  }

  toFloat32(): f32 {
    return <f32>this.numerator / <f32>this.denominator;
  }

  toFloat64(): f64 {
    return <f64>this.numerator / <f64>this.denominator;
  }

  toArray(): Array<T> {
    return [this.numerator, this.denominator];
  }

  toFraction<W extends Number>(): Fraction<W> {
    if (!isInteger<W>()) {
      throw new TypeError("Unsupported generic type " + nameof<W>());
    }
    return new Fraction<W>(<W>this.numerator, <W>this.denominator);
  }

  toBigFraction(): BigFraction {
    return BigFraction.fromArray([this.numerator, this.denominator]);
  }

  quotient(precision: i32 = Fraction.DEFAULT_PRECISION, rounding: Rounding = Fraction.DEFAULT_ROUNDING): BigNumber {
    return this.toBigNumber(precision, rounding);
  }

  copy(): Fraction<T> {
    return new Fraction<T>(this.numerator, this.denominator);
  }

  opposite(): Fraction<T> {
    if (!isSigned<T>()) {
      throw new Error("Cannot take opposite of Fraction with unsigned integers")
    }
    return new Fraction<T>(-1 * this.numerator, this.denominator);
  }

  abs(): Fraction<T> {
    return new Fraction<T>(abs<T>(this.numerator), abs<T>(this.denominator));
  }

  reciprocal(): Fraction<T> {
    return new Fraction(this.denominator, this.numerator);
  }

  // COMPARISON OPERATORS //////////////////////////////////////////////////////////////////////////////////////////////

  eq<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) == 0;
  }

  ne<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) != 0;
  }

  lt<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) < 0;
  }

  lte<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) <= 0;
  }

  gt<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) > 0;
  }

  gte<W extends Number>(other: Fraction<W>): boolean {
    return this.compareTo(other) >= 0;
  }

  compareTo<W extends Number>(right: Fraction<W>): i32 {
    if (isSigned<T>() || isSigned<W>()) {
      const leftIsNeg: boolean = this.isNegative;
      const rightIsNeg: boolean = right.isNegative;
      if (leftIsNeg && !rightIsNeg) {
        return -1;
      } else if (!leftIsNeg && rightIsNeg) {
        return 1;
      }
    }
    const a: u64 = <u64>abs(this.numerator) * <u64>abs(right.denominator);
    const b: u64 = <u64>abs(right.numerator) * <u64>abs(this.denominator);
    if (this.isNegative) {
      if (b > a) return 1;
      if (b < a) return -1;
      return 0;
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  magCompareTo<W extends Number>(right: Fraction<W>): i32 {
    const a: u64 = <u64>abs(this.numerator) * <u64>abs(right.denominator);
    const b: u64 = <u64>abs(right.numerator) * <u64>abs(this.denominator);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  // ARITHMETIC ////////////////////////////////////////////////////////////////////////////////////////////////////////

  add<U>(other: U): Fraction<T> {
    const addend: Fraction<T> = Fraction.from<U, T>(other);
    if (this.denominator == addend.denominator) {
      return new Fraction<T>(this.numerator + addend.numerator, this.denominator);
    }
    if (isSigned<T>()) {
      const a: i64 = <i64>this.numerator * addend.denominator;
      const b: i64 = <i64>addend.numerator * this.denominator;
      const c: T = this.denominator * addend.denominator;
      return new Fraction<T>(<T>(a + b), c);
    }
    const a: T = this.numerator * addend.denominator;
    const b: T = addend.numerator * this.denominator;
    const c: T = this.denominator * addend.denominator;
    return new Fraction<T>(a + b, c);
  }

  sub<U>(other: U): Fraction<T> {
    const subtrahend: Fraction<T> = Fraction.from<U, T>(other);
    if (this.denominator == subtrahend.denominator) {
      return new Fraction<T>(this.numerator - subtrahend.numerator, this.denominator);
    }
    if (isSigned<T>()) {
      const a: i64 = <i64>this.numerator * subtrahend.denominator;
      const b: i64 = <i64>subtrahend.numerator * this.denominator;
      const c: T = this.denominator * subtrahend.denominator;
      return new Fraction<T>(<T>(a - b), c);
    }
    const a: u64 = <u64>this.numerator * subtrahend.denominator;
    const b: u64 = <u64>subtrahend.numerator * this.denominator;
    const c: T = this.denominator * subtrahend.denominator;
    return new Fraction<T>(<T>(a - b), c);
  }

  mul<U>(other: U): Fraction<T> {
    const multiplier: Fraction<T> = Fraction.from<U, T>(other);
    return new Fraction<T>(
      this.numerator * multiplier.numerator,
      this.denominator * multiplier.denominator
    );
  }

  square(): Fraction<T> {
    return new Fraction<T>(
      this.numerator * this.numerator,
      this.denominator * this.denominator
    );
  }

  /**
   * Divides two Fractions and rounds result
   */
  div<U>(other: U): Fraction<T> {
    const divisor: Fraction<T> = Fraction.from<U, T>(other);
    if (divisor.numerator == 0) {
      throw new Error("Divide by zero");
    }
    return new Fraction<T>(
      this.numerator * divisor.denominator,
      this.denominator * divisor.numerator
    );
  }

  sqrt(): Fraction<T> {
    if (this.isNegative) {
      throw new RangeError("Square root of negative numbers is not supported");
    }
    if (this.numerator == 0) {
      return this.copy();
    }
    const intType = nameof<T>();
    if (intType == nameof<i64>() || intType == nameof<u64>()) {
      return Fraction.fromBigNumber(this.toBigNumber().sqrt(19), true);
    } else if (intType == nameof<i32>() || intType == nameof<u32>()) {
      return Fraction.fromBigNumber(this.toBigNumber().sqrt(10), true);
    } else if (intType == nameof<i16>() || intType == nameof<u16>()) {
      return Fraction.fromBigNumber(this.toBigNumber().sqrt(5), true);
    } else {
      return Fraction.fromBigNumber(this.toBigNumber().sqrt(3), true);
    }
  }

  pow(k: i32): Fraction<T> {
    if (k < 0) {
      return new Fraction<T>(this.denominator ** k, this.numerator ** k);
    }
    return new Fraction<T>(this.numerator ** k, this.denominator ** k);
  }

  // UTILITIES /////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isNegative(): boolean {
    return this.numerator < 0 != this.denominator < 0;
  }

  isZero(): boolean {
    return this.numerator == 0;
  }

  get isInteger(): boolean {
    return this.numerator >= this.denominator && (this.numerator % this.denominator == 0)
  }

  private static checkBigNumberSafety(outType: string, precision: i32): void {
    if (outType == nameof<i64>() || outType == nameof<u64>()) {
      if (precision > 19) {
        throw new Error(`Integer overflow: BigNumber input has precision of ${precision} digits while 64 bit integers fit only 19 digits`);
      }
    } else if (outType == nameof<i32>() || outType == nameof<u32>()) {
      if (precision > 10) {
        throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 32 bit integers fit only 10 digits`);
      }
    } else if (outType == nameof<i16>() || outType == nameof<u16>()) {
      if (precision > 5) {
        throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 16 bit integers fit only 5 digits`);
      }
    } else if (outType == nameof<i8>() || outType == nameof<u8>()) {
      if (precision > 3) {
       throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 8 bit integers fit only 3 digits`);
     }
    }
  }

  // SYNTAX SUGAR ///////////////////////////////////////////////////////////////////////////////////////////////////

  static eq<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.eq(right);
  }

  static ne<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.ne(right);
  }

  static lt<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.lt(right);
  }

  static lte<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.lte(right);
  }

  static gt<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.gt(right);
  }

  static gte<W extends Number, V extends Number>(left: Fraction<W>, right: Fraction<V>): boolean {
    return left.gte(right);
  }

  static add<W extends Number, U>(left: Fraction<W>, right: U): Fraction<W> {
    return left.add<U>(right);
  }

  static sub<W extends Number, U>(left: Fraction<W>, right: U): Fraction<W> {
    return left.sub<U>(right);
  }

  static mul<W extends Number, U>(left: Fraction<W>, right: U): Fraction<W> {
    return left.mul<U>(right);
  }

  static div<W extends Number, U>(left: Fraction<W>, right: U): Fraction<W> {
    return left.div<U>(right);
  }

  static pow<W extends Number>(base: Fraction<W>, k: i32): Fraction<W> {
    return base.pow(k);
  }
}