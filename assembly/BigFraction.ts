import { BigInt } from "as-bigint";
import { BigNumber, Rounding } from "as-bignumber";

export class BigFraction {
  public readonly numerator: BigInt;
  public readonly denominator: BigInt;

  // 155, the number of digits in the maximum value of a 512 bit integer
  public static DEFAULT_PRECISION: i32 = 155;
  public static DEFAULT_ROUNDING: Rounding = Rounding.HALF_UP;
  public static readonly MAX_POWER: i32 = 999999999;

  public static readonly ONE: BigFraction = new BigFraction(BigInt.ONE);
  public static readonly HALF: BigFraction = new BigFraction(BigInt.ONE, BigInt.fromUInt16(2));

  // CONSTRUCTORS //////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(numerator: BigInt, denominator: BigInt = BigInt.ONE) {
    if (denominator.isZero()) {
      throw new Error("Divide by zero");
    }
    this.numerator = numerator;
    this.denominator = denominator;
  }

  /**
   * Returns a new {Fraction} instance from generic type {T}.
   *
   * @param  val the number as {BigNumber}, {BigInt}, {BigInt[]}, string, or {number}
   * @return the new {Fraction} instance
   */
  static from<T>(val: T): BigFraction {
    if (val instanceof BigFraction) return val;
    // @ts-ignore
    if (val instanceof Array) return BigFraction.fromArray(val);
    // @ts-ignore
    if (val instanceof BigNumber) return BigFraction.fromBigNumber(val);
    // @ts-ignore
    if (val instanceof string) return BigFraction.fromString(val);
    // @ts-ignore
    if (val instanceof BigInt) return new BigFraction(val);
    // @ts-ignore
    if (val instanceof f32) return BigFraction.fromBigNumber(BigNumber.fromFloat64(<f64>val));
    // @ts-ignore
    if (val instanceof f64) return BigFraction.fromBigNumber(BigNumber.fromFloat64(val));
    // @ts-ignore
    if (val instanceof i8) return new BigFraction(BigInt.fromInt16(<i16>val));
    // @ts-ignore
    if (val instanceof u8) return new BigFraction(BigInt.fromUInt16(<u16>val));
    // @ts-ignore
    if (val instanceof i16) return new BigFraction(BigInt.fromInt16(val));
    // @ts-ignore
    if (val instanceof u16) return new BigFraction(BigInt.fromUInt16(val));
    // @ts-ignore
    if (val instanceof i32) return new BigFraction(BigInt.fromInt32(val));
    // @ts-ignore
    if (val instanceof u32) return new BigFraction(BigInt.fromUInt32(val));
    // @ts-ignore
    if (val instanceof i64) return new BigFraction(BigInt.fromInt64(val));
    // @ts-ignore
    if (val instanceof u64) return new BigFraction(BigInt.fromUInt64(val));

    throw new TypeError("Unsupported generic type " + nameof<T>(val));
  }

  static fromArray<TInt>(arr: TInt[]): BigFraction {
    if (arr.length != 2) {
      throw new Error(
          "Unexpected length: expected an array of length 2 in the form [numerator, denominator]"
      );
    }
    return new BigFraction(BigInt.from(arr[0]), BigInt.from(arr[1]));
  }

  static fromBigNumber(val: BigNumber): BigFraction {
    if (val.e > 0) {
      const scale = BigInt.fromString("1".padEnd(1 + val.e, "0"));
      return new BigFraction(val.m.copy(), scale);
    } else if (val.e < 0) {
      const scale = BigInt.fromString("1".padEnd(1 - val.e, "0"));
      return new BigFraction(val.m.mul(scale));
    } else {
      return new BigFraction(val.m.copy());
    }
  }

  static fromBigInt(val: BigInt): BigFraction {
    return new BigFraction(val.copy());
  }
  
  static fromString(val: string): BigFraction {
    return BigFraction.fromBigNumber(BigNumber.fromString(val, 0));
  }

  // OUTPUT ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  toString(): string {
    return `[${this.numerator.toString()}, ${this.denominator.toString()}]`
  }

  toNumberString(precision: i32 = BigFraction.DEFAULT_PRECISION, rounding: Rounding = BigFraction.DEFAULT_ROUNDING): string {
    return BigNumber.fromFraction(
        this.numerator,
        this.denominator,
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
        this.numerator,
        this.denominator,
        BigFraction.DEFAULT_PRECISION,
        rounding
    ).toSignificant(digits, rounding);
  }

  toFixed(
      places: i32,
      rounding: Rounding = Rounding.HALF_UP
  ): string {
    return BigNumber.fromFraction(
        this.numerator,
        this.denominator,
        BigFraction.DEFAULT_PRECISION,
        rounding
    ).toFixed(places, rounding);
  }

  toBigNumber(precision: i32 = BigFraction.DEFAULT_PRECISION, rounding: Rounding = BigFraction.DEFAULT_ROUNDING): BigNumber {
    const numerator: BigNumber = BigNumber.from(this.numerator);
    const denominator: BigNumber = BigNumber.from(this.denominator);
    return numerator.div(denominator, precision, rounding);
  }

  // performs floor division
  toBigInt(): BigInt {
    return this.numerator.div(this.denominator);
  }

  toArray(): BigInt[] {
    return [this.numerator.copy(), this.denominator.copy()];
  }

  quotient(precision: i32 = BigFraction.DEFAULT_PRECISION, rounding: Rounding = BigFraction.DEFAULT_ROUNDING): BigNumber {
    return this.toBigNumber(precision, rounding);
  }

  // O(N)
  copy(): BigFraction {
    return new BigFraction(this.numerator.copy(), this.denominator.copy());
  }

  // O(N)
  opposite(): BigFraction  {
    return new BigFraction(this.numerator.opposite(), this.denominator.copy());
  }

  // O(N)
  abs(): BigFraction  {
    return new BigFraction(this.numerator.abs(), this.denominator.abs());
  }

  reciprocal(): BigFraction {
    return new BigFraction(this.denominator.copy(), this.numerator.copy());
  }

  // COMPARISON OPERATORS //////////////////////////////////////////////////////////////////////////////////////////////

  eq<T>(other: T): boolean {
    return this.compareTo(BigFraction.from(other)) == 0;
  }

  ne<T>(other: T): boolean {
    return !this.eq(BigFraction.from(other));
  }

  lt<T>(other: T): boolean {
    return this.compareTo(BigFraction.from(other)) < 0;
  }

  lte<T>(other: T): boolean {
    return this.compareTo(BigFraction.from(other)) <= 0;
  }

  gt<T>(other: T): boolean {
    return this.compareTo(BigFraction.from(other)) > 0;
  }

  gte<T>(other: T): boolean {
    return this.compareTo(BigFraction.from(other)) >= 0;
  }

  compareTo(other: BigFraction): i32 {
    const leftIsNeg: boolean = this.isNegative;
    const rightIsNeg: boolean = other.isNegative;
    if (leftIsNeg && !rightIsNeg) {
      return -1;
    } else if (!leftIsNeg && rightIsNeg) {
      return 1;
    }
    const a = BigInt.mul(this.numerator, other.denominator);
    const b = BigInt.mul(other.numerator, this.denominator);
    return leftIsNeg ? b.magCompareTo(a) : a.magCompareTo(b);
  }

  magCompareTo(other: BigFraction): i32 {
    const left = BigInt.mul(this.numerator, other.denominator);
    const right = BigInt.mul(other.numerator, this.denominator);
    return left.magCompareTo(right);
  }

  // ARITHMETIC ////////////////////////////////////////////////////////////////////////////////////////////////////////

  add<T>(other: T): BigFraction {
    const addend = BigFraction.from(other);
    if (this.denominator.eq(addend.denominator)) {
      const numeratorSum: BigInt = BigInt.add(this.numerator, addend.numerator);
      return new BigFraction(numeratorSum, this.denominator);
    }
    return new BigFraction(
        BigInt.add(
            BigInt.mul(this.numerator, addend.denominator),
            BigInt.mul(addend.numerator, this.denominator)
        ),
        BigInt.mul(this.denominator, addend.denominator)
    );
  }

  sub<T>(other: T): BigFraction {
    const subtrahend: BigFraction = BigFraction.from(other);
    if (BigInt.eq(this.denominator, subtrahend.denominator)) {
      const numeratorSub: BigInt = BigInt.sub(this.numerator, subtrahend.numerator);
      return new BigFraction(numeratorSub, this.denominator);
    }
    return new BigFraction(
        BigInt.sub(
            BigInt.mul(this.numerator, subtrahend.denominator),
            BigInt.mul(subtrahend.numerator, this.denominator)
        ),
        BigInt.mul(this.denominator, subtrahend.denominator)
    );
  }

  mul<T>(other: T): BigFraction {
    const multiplier: BigFraction = BigFraction.from(other);
    return new BigFraction(
        BigInt.mul(this.numerator, multiplier.numerator),
        BigInt.mul(this.denominator, multiplier.denominator)
    );
  }

  square(): BigFraction {
    return new BigFraction(
        this.numerator.square(),
        this.denominator.square()
    );
  }

  /**
   * Divides two Fractions and rounds result
   */
  div<T>(other: T): BigFraction {
    const divisor: BigFraction = BigFraction.from(other);
    if (divisor.numerator.isZero()) {
      throw new Error("Divide by zero");
    }
    return new BigFraction(
        BigInt.mul(this.numerator, divisor.denominator),
        BigInt.mul(this.denominator, divisor.numerator)
    );
  }

  sqrt(): BigFraction {
    if (this.isNegative)
      throw new RangeError("Square root of negative numbers is not supported");
    if (this.isZero()) {
      return this.copy();
    }
    return BigFraction.fromBigNumber(this.toBigNumber().sqrt());
  }

  pow(k: i32): BigFraction {
    if (k < -BigFraction.MAX_POWER || k > BigFraction.MAX_POWER) {
      throw new Error(`Power argument out of bounds [-${BigFraction.MAX_POWER}, ${BigFraction.MAX_POWER}]: ${k}`);
    }
    if (k < 0) {
      return new BigFraction(this.denominator.pow(k), this.numerator.pow(k));
    }
    return new BigFraction(this.numerator.pow(k), this.denominator.pow(k));
  }

  // UTILITIES /////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isNegative(): boolean {
    return this.numerator.isNegative != this.denominator.isNegative;
  }

  isZero(): boolean {
    return this.numerator.isZero();
  }

  get isInteger(): boolean {
    return this.toBigNumber().isInteger;
  }

  // SYNTAX SUGAR ///////////////////////////////////////////////////////////////////////////////////////////////////

  static eq<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.eq(right);
  }

  @operator("==")
  private static eqOp(left: BigFraction, right: BigFraction): boolean {
    return left.eq(right);
  }

  static ne<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.ne(right);
  }

  @operator("!=")
  private static neOp(left: BigFraction, right: BigFraction): boolean {
    return left.ne(right);
  }

  static lt<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.lt(right);
  }

  @operator("<")
  private static ltOp(left: BigFraction, right: BigFraction): boolean {
    return left.lt(right);
  }

  static lte<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.lte(right);
  }

  @operator("<=")
  private static lteOp(left: BigFraction, right: BigFraction): boolean {
    return left.lte(right);
  }

  static gt<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.gt(right);
  }

  @operator(">")
  private static gtOp(left: BigFraction, right: BigFraction): boolean {
    return left.gt(right);
  }

  static gte<T, U>(left: T, right: U): boolean {
    const a: BigFraction = BigFraction.from(left);
    return a.gte(right);
  }

  @operator(">=")
  private static gteOp(left: BigFraction, right: BigFraction): boolean {
    return left.gte(right);
  }

  static add<T, U>(left: T, right: U): BigFraction {
    const a: BigFraction = BigFraction.from(left);
    return a.add(right);
  }

  @operator("+")
  private static addOp(left: BigFraction, right: BigFraction): BigFraction {
    return left.add(right);
  }

  static sub<T, U>(left: T, right: U): BigFraction {
    const a: BigFraction = BigFraction.from(left);
    return a.sub(right);
  }

  @operator("-")
  private static subOp(left: BigFraction, right: BigFraction): BigFraction {
    return left.sub(right);
  }

  static mul<T, U>(left: T, right: U): BigFraction {
    const a: BigFraction = BigFraction.from(left);
    return a.mul(right);
  }

  @operator("*")
  private static mulOp(left: BigFraction, right: BigFraction): BigFraction {
    return left.mul(right);
  }

  static div<T, U>(left: T, right: U): BigFraction {
    const a: BigFraction = BigFraction.from(left);
    return a.div(right);
  }

  @operator("/")
  static divOp(left: BigFraction, right: BigFraction): BigFraction {
    return left.div(right);
  }

  static pow<T>(base: T, k: i32): BigFraction {
    const x: BigFraction = BigFraction.from(base);
    return x.pow(k);
  }

  @operator("**")
  private static powOp(left: BigFraction, right: BigFraction): BigFraction {
    if (!right.isInteger) {
      throw new Error("Exponent must be an integer value");
    }
    return left.pow(right.toBigInt().toInt32());
  }
}