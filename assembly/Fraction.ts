import { BigInt } from "as-bigint";
import { BigNumber, Rounding } from "as-bignumber";

// TODO: check for overflow and throw

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
   * Returns a new {Fraction} instance from generic type {T}.
   *
   * @param  val the number as {BigNumber}, {BigInt}, {BigInt[]}, string, or {number}
   * @return the new {Fraction} instance
   */
  static from<TOut extends Number, TArg>(val: TArg): Fraction<TOut> {
    if (val instanceof Fraction) {
      if (nameof<TOut>() == nameof(val.numerator)) return val;
      return val.toFraction<TOut>();
    }
    // @ts-ignore
    if (isArray<TArg>()) return this.fromArray<TOut>(val);
    // @ts-ignore
    if (val instanceof BigNumber) return Fraction.fromBigNumber<TOut>(val);
    // @ts-ignore
    if (isString<TArg>()) return Fraction.fromString<TOut>(val);
    // @ts-ignore
    if (val instanceof BigInt) return Fraction.fromBigInt<TOut>(val);
    // @ts-ignore
    if (isFloat<TArg>()) return Fraction.fromBigNumber<TOut>(BigNumber.fromFloat64(<f64>val));
    // @ts-ignore
    if (isInteger<TArg>()) return new Fraction(val, 1).toFraction<TOut>();

    throw new TypeError("Unsupported generic type " + nameof<TArg>(val));
  }

  static fromArray<TOut extends Number, TArg extends Number>(arr: Array<TArg>): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    if (!isInteger<TArg>(arr[0])) {
      throw new TypeError("Unsupported generic type " + nameof<TArg>(arr[0]));
    }
    if (arr.length != 2) {
      throw new Error(
        "Unexpected length: expected an array of length 2 in the form [numerator, denominator]"
      );
    }
    return new Fraction(<TOut><unknown>arr[0], <TOut><unknown>arr[1]);
  }

  static fromArrayToInferredType<TArg extends Number, TOut extends Number = TArg>(arr: TArg[]): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    if (!isInteger<TArg>(arr[0])) {
      throw new TypeError("Unsupported generic type " + nameof<TArg>(arr[0]));
    }
    if (arr.length != 2) {
      throw new Error(
          "Unexpected length: expected an array of length 2 in the form [numerator, denominator]"
      );
    }
    return new Fraction(<TOut><unknown>arr[0], <TOut><unknown>arr[1]);
  }
  
  static fromBigNumber<TOut extends Number = i64>(val: BigNumber, unsafe = false): Fraction<TOut> {
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
        return new Fraction(<TOut><unknown>val.m.toInt64(), <TOut><unknown>scale.toUInt32());
      }
      return new Fraction(<TOut><unknown>val.m.toUInt64(), <TOut><unknown>scale.toUInt32());
    } else if (val.e < 0) {
      const scale = BigInt.fromString("1".padEnd(1 - val.e, "0"));
      const intVal: BigInt = val.m.mul(scale);
      if (intVal.isNegative) {
        return new Fraction(<TOut><unknown>intVal.toInt64(), <TOut><unknown>1);
      }
      return new Fraction(<TOut><unknown>intVal.toUInt64(), <TOut><unknown>1);
    } else {
      if (val.m.isNegative) {
        return new Fraction(<TOut><unknown>val.m.toInt64(), <TOut><unknown>1);
      }
      return new Fraction(<TOut><unknown>val.m.toUInt64(), <TOut><unknown>1);
    }
  }

  static fromBigInt<TOut extends Number = i64>(val: BigInt): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    if (val.isNegative) {
      return new Fraction(<TOut><unknown>val.toInt64(), <TOut><unknown>1);
    }
    return new Fraction(<TOut><unknown>val.toUInt64(), <TOut><unknown>1);
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
    // @ts-ignore
    return BigInt.from(this.numerator / this.denominator);
  }

  toArray<TOut extends Number = T>(): TOut[] {
    return [<TOut><unknown>this.numerator, <TOut><unknown>this.denominator];
  }

  toFraction<TOut extends Number>(): Fraction<TOut> {
    return new Fraction(<TOut><unknown>this.numerator, <TOut><unknown>this.denominator);
  }

  quotient(precision: i32 = Fraction.DEFAULT_PRECISION, rounding: Rounding = Fraction.DEFAULT_ROUNDING): BigNumber {
    return this.toBigNumber(precision, rounding);
  }

  copy<TOut extends Number = T>(): Fraction<TOut> {
    return new Fraction(<TOut><unknown>this.numerator, <TOut><unknown>this.denominator);
  }

  opposite<TOut extends Number = T>(): Fraction<TOut> {
    // @ts-ignore
    return new Fraction<TOut>(-1 * <TOut><unknown>this.numerator, <TOut><unknown>this.denominator);
  }
  
  abs<TOut extends Number = T>(): Fraction<TOut> {
    // @ts-ignore
    return new Fraction(<TOut><unknown>abs(this.numerator), <TOut><unknown>abs(this.denominator));
  }

  reciprocal<TOut extends Number = T>(): Fraction<TOut> {
    return new Fraction(<TOut><unknown>this.denominator, <TOut><unknown>this.numerator);
  }

  // COMPARISON OPERATORS //////////////////////////////////////////////////////////////////////////////////////////////

  eq<U>(other: U): boolean {
    return this.compareTo(Fraction.from(other)) == 0;
  }

  ne<U>(other: U): boolean {
    return !this.eq(Fraction.from(other));
  }

  lt<U>(other: U): boolean {
    return this.compareTo(Fraction.from(other)) < 0;
  }

  lte<U>(other: U): boolean {
    return this.compareTo(Fraction.from(other)) <= 0;
  }

  gt<U>(other: U): boolean {
    return this.compareTo(Fraction.from(other)) > 0;
  }

  gte<U>(other: U): boolean {
    return this.compareTo(Fraction.from(other)) >= 0;
  }

  compareTo<U>(other: U): i32 {
    const right = Fraction.from(other);
    if (isSigned(this.numerator) || isSigned(right.numerator)) {
      const leftIsNeg: boolean = this.isNegative;
      const rightIsNeg: boolean = right.isNegative;
      if (leftIsNeg && !rightIsNeg) {
        return -1;
      } else if (!leftIsNeg && rightIsNeg) {
        return 1;
      }
    }
    return this.magCompareTo(right);
  }

  magCompareTo<U>(other: U): i32 {
    const right = Fraction.from(other);
    if (isSigned(this.numerator) || isSigned(right.numerator)) {
      const a: i64 = <i64><unknown>this.numerator * <i64><unknown>right.denominator;
      const b: i64 = <i64><unknown>right.numerator * <i64><unknown>this.denominator;
      const absA: i64 = abs(a);
      const absB: i64 = abs(b);
      return this.isNegative ? absB - absA : absA - absB;
    }
    const a: u64 = <u64><unknown>this.numerator * <u64><unknown>right.denominator;
    const b: u64 = <u64><unknown>right.numerator * <u64><unknown>this.denominator;
    if (this.isNegative) {
      if (b < a) return -1;
      if (b > a) return 1;
      return 0;
    } else {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
  }

  // ARITHMETIC ////////////////////////////////////////////////////////////////////////////////////////////////////////

  add<U, TOut extends Number = T>(other: U): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    const addend = Fraction.from(other);
    if (isSigned(this.numerator) || isSigned(addend.numerator)) {
      const thisNum: i64 = <i64><unknown>this.numerator;
      const thisDenom: i64 = <i64><unknown>this.denominator;
      const otherNum: i64 = <i64><unknown>addend.numerator;
      const otherDenom: i64 = <i64><unknown>addend.denominator;
      if (thisDenom == otherDenom) {
        return new Fraction(<TOut><unknown>(thisNum + otherNum), <TOut><unknown>thisDenom);
      }
      return new Fraction(
        <TOut><unknown>(thisNum * otherDenom + otherNum * thisDenom),
        <TOut><unknown>(thisDenom * otherDenom)
      );
    }
    const thisNum: u64 = <u64><unknown>this.numerator;
    const thisDenom: u64 = <u64><unknown>this.denominator;
    const otherNum: u64 = <u64><unknown>addend.numerator;
    const otherDenom: u64 = <u64><unknown>addend.denominator;
    if (thisDenom == otherDenom) {
      return new Fraction(<TOut><unknown>(thisNum + otherNum), <TOut><unknown>thisDenom);
    }
    return new Fraction(
      <TOut><unknown>(thisNum * otherDenom + otherNum * thisDenom),
      <TOut><unknown>(thisDenom * otherDenom)
    );
  }

  sub<U, TOut extends Number = T>(other: U): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    const subtrahend = Fraction.from(other);
    if (isSigned(this.numerator || isSigned(subtrahend.numerator))) {
      const thisNum: i64 = <i64><unknown>this.numerator;
      const thisDenom: i64 = <i64><unknown>this.denominator;
      const otherNum: i64 = <i64><unknown>subtrahend.numerator;
      const otherDenom: i64 = <i64><unknown>subtrahend.denominator;
      if (thisDenom == otherDenom) {
        return new Fraction(<TOut><unknown>(thisNum - otherNum), <TOut><unknown>thisDenom);
      }
      return new Fraction(
        <TOut><unknown>(thisNum * otherDenom - otherNum * thisDenom),
        <TOut><unknown>(thisDenom * otherDenom)
      );
    }
    const thisNum: u64 = <u64><unknown>this.numerator;
    const thisDenom: u64 = <u64><unknown>this.denominator;
    const otherNum: u64 = <u64><unknown>subtrahend.numerator;
    const otherDenom: u64 = <u64><unknown>subtrahend.denominator;
    if (thisDenom == otherDenom) {
      return new Fraction(<TOut><unknown>(thisNum - otherNum), <TOut><unknown>thisDenom);
    }
    return new Fraction(
      <TOut><unknown>(thisNum * otherDenom - otherNum * thisDenom),
      <TOut><unknown>(thisDenom * otherDenom)
    );
  }

  mul<U, TOut extends Number = T>(other: U): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    const multiplier = Fraction.from(other);
    return new Fraction<TOut>(
      // @ts-ignore
      <TOut><unknown>this.numerator * <TOut><unknown>multiplier.numerator,
      // @ts-ignore
      <TOut><unknown>this.denominator * <TOut><unknown>multiplier.denominator
    );
  }

  square<TOut extends Number = T>(): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    return new Fraction<TOut>(
      // @ts-ignore
      <TOut><unknown>this.numerator * <TOut><unknown>this.numerator,
      // @ts-ignore
      <TOut><unknown>this.denominator * <TOut><unknown>this.denominator
    );
  }

  /**
   * Divides two Fractions and rounds result
   */
  div<U, TOut extends Number = T>(other: U): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    const divisor = Fraction.from(other);
    if (divisor.numerator == 0) {
      throw new Error("Divide by zero");
    }
    return new Fraction<TOut>(
      // @ts-ignore
      <TOut><unknown>this.numerator * <TOut><unknown>divisor.denominator,
      // @ts-ignore
      <TOut><unknown>this.denominator * <TOut><unknown>divisor.numerator
    );
  }

  // TODO: why can't i take sqrt(numerator) / sqrt(denominator) ??
  sqrt<TOut extends Number = T>(): Fraction<TOut> {
    if (!isInteger<TOut>()) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>());
    }
    if (this.isNegative) {
      throw new RangeError("Square root of negative numbers is not supported");
    }
    // @ts-ignore
    if (this.numerator == 0) {
      return this.toFraction<TOut>();
    }
    const outType = nameof<TOut>();
    if (outType == I64.name || outType == U64.name) {
      return Fraction.fromBigNumber<TOut>(this.toBigNumber().sqrt(19), true);
    } else if (outType == I32.name || outType == U32.name) {
      return Fraction.fromBigNumber<TOut>(this.toBigNumber().sqrt(10), true);
    } else if (outType == I16.name || outType == U16.name) {
      return Fraction.fromBigNumber<TOut>(this.toBigNumber().sqrt(5), true);
    } else {
      return Fraction.fromBigNumber<TOut>(this.toBigNumber().sqrt(3), true);
    }
  }

  pow<TOut extends Number = T>(k: TOut): Fraction<TOut> {
    if (!isInteger<TOut>(k)) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>(k));
    }
    if (k < 0) {
      // @ts-ignore
      return new Fraction<TOut>((<TOut>this.denominator) ** k, (<TOut>this.numerator) ** k);
    }
    // @ts-ignore
    return new Fraction<TOut>((<TOut>this.numerator) ** k, (<TOut>this.denominator) ** k);
  }

  // UTILITIES /////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isNegative(): boolean {
    // @ts-ignore
    return this.numerator < 0 != this.denominator < 0;
  }

  isZero(): boolean {
    // @ts-ignore
    return this.numerator == 0;
  }

  get isInteger(): boolean {
    // @ts-ignore
    return this.numerator >= this.denominator && (this.numerator % this.denominator == 0)
  }

  private static checkBigNumberSafety(outType: string, precision: i32): void {
    if (outType == I64.name || outType == U64.name) {
      if (precision > 19) {
        throw new Error(`Integer overflow: BigNumber input has precision of ${precision} digits while 64 bit integers fit only 19 digits`);
      }
    } else if (outType == I32.name || outType == U32.name) {
      if (precision > 10) {
        throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 32 bit integers fit only 10 digits`);
      }
    } else if (outType == I16.name || outType == U16.name) {
      if (precision > 5) {
        throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 16 bit integers fit only 5 digits`);
      }
    } else if (outType == I8.name || outType == U8.name) {
      if (precision > 3) {
       throw new Error (`Integer overflow: BigNumber input has precision of ${precision} digits while 8 bit integers fit only 3 digits`);
     }
    }
  }

  // SYNTAX SUGAR ///////////////////////////////////////////////////////////////////////////////////////////////////

  static eq<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.eq(right);
  }

  @operator("==")
  private static eqOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.eq(right);
  }

  static ne<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.ne(right);
  }

  @operator("!=")
  private static neOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.ne(right);
  }

  static lt<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.lt(right);
  }

  @operator("<")
  private static ltOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.lt(right);
  }

  static lte<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.lte(right);
  }

  @operator("<=")
  private static lteOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.lte(right);
  }

  static gt<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.gt(right);
  }

  @operator(">")
  private static gtOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.gt(right);
  }

  static gte<T, U>(left: T, right: U): boolean {
    const a = Fraction.from(left);
    return a.gte(right);
  }

  @operator(">=")
  private static gteOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): boolean {
    return left.gte(right);
  }

  static add<TOut extends Number, T, U>(left: T, right: U): Fraction<TOut> {
    const a = Fraction.from(left);
    return a.add<U, TOut>(right);
  }

  @operator("+")
  private static addOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): Fraction<TInt> {
    return left.add(right);
  }

  static sub<TOut extends Number, T, U>(left: T, right: U): Fraction<TOut> {
    const a = Fraction.from(left);
    return a.sub<U, TOut>(right);
  }

  @operator("-")
  private static subOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): Fraction<TInt> {
    return left.sub(right);
  }

  static mul<TOut extends Number, T, U>(left: T, right: U): Fraction<TOut> {
    const a = Fraction.from(left);
    return a.mul<U, TOut>(right);
  }

  @operator("*")
  private static mulOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): Fraction<TInt>{
    return left.mul(right);
  }

  static div<TOut extends Number, T, U>(left: T, right: U): Fraction<TOut> {
    const a = Fraction.from(left);
    return a.div<U, TOut>(right);
  }

  @operator("/")
  static divOp<TInt extends Number>(left: Fraction<TInt>, right: Fraction<TInt>): Fraction<TInt> {
    return left.div(right);
  }

  static pow<TOut extends Number, U>(base: U, k: TOut): Fraction<TOut> {
    if (!isInteger<TOut>(k)) {
      throw new TypeError("Unsupported generic type " + nameof<TOut>(k));
    }
    const x = Fraction.from(base);
    return x.pow(k);
  }

  @operator("**")
  private static powOp<TInt extends  Number>(left: Fraction<TInt>, right: Fraction<TInt>): Fraction<TInt> {
    if (!right.isInteger) {
      throw new Error("Exponent must be an integer value");
    }
    // @ts-ignore
    return left.pow(<TInt><unknown>(right.numerator / right.denominator));
  }
}