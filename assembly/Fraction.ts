export class Fraction<T extends Number> {
  public readonly numerator: T;
  public readonly denominator: T;

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
   * @param  val the number as {Fraction<T>}, {int[]}, string, or {number}
   * @return the new {Fraction<TOut>} instance
   */
  static from<U, TOut extends Number = i32>(val: U): Fraction<TOut> {
    if (val instanceof Fraction) {
      if (nameof<TOut>() == nameof(val.numerator)) return val;
      return val.toFraction<TOut>();
    }
    if (isArray<U>(val)) return this.fromArray(val);
    if (isString<U>(val)) return this.fromString<TOut>(val);
    if (isFloat<U>(val)) return this.fromFloat<U, TOut>(val);
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

  static fromFloat<U extends Number, TOut extends Number = i32>(val: U): Fraction<TOut> {
    if (!isFloat<U>(val)) {
      throw new TypeError("Unsupported generic type " + nameof<U>(val) + ". Expected f32 or f64.");
    }
    return Fraction.fromString<TOut>(val.toString());
  }

  static fromString<TOut extends Number = i32>(val: string): Fraction<TOut> {
    // number values
    let mantissa: TOut; // mantissa
    let exponent: i32 = 0; // exponent
    let p: i32 = 0; // precision

    // values for parsing string
    let offset: i32 = 0;
    let len: i32 = val.length;

    // handle the sign
    let isNeg: boolean = false;
    if (val.charAt(offset) == '-') {
      if (!isSigned<TOut>()) {
        throw new Error(`Cannot construct Fraction<${nameof<TOut>()}> from negative decimal string ${val}`)
      }
      isNeg = true;
      offset++;
      len--;
    } else if (val.charAt(offset) == '+') { // leading + allowed
      offset++;
      len--;
    }

    let dot: boolean = false; // decimal point
    let idx: i32 = 0;
    let codes: i32[] = [];
    for (; len > 0; offset++, len--) {
      const char: i32 = val.charCodeAt(offset);

      // char is digit
      if (char >= 48 && char <= 57) {
        // char is 0
        if (char == 48) {
          // char is first leading zero
          if (p == 0) {
            codes[idx] = char;
            p = 1;
            // char is a zero that follows another digit
          } else if (idx != 0) {
            codes[idx++] = char;
            ++p;
          }
          // char is non-zero digit
        } else {
          // increment precision if char is not redundant leading zero
          if (p != 1 || idx != 0) {
            ++p;
          }
          codes[idx++] = char;
        }
        if (dot) {
          ++exponent;
        }
        continue;
      }

      // char is decimal point
      if (char == 46) {
        if (dot) {
          throw new Error("Input string contains more than one decimal point.");
        }
        dot = true;
        continue;
      }

      // exponential notation mark expected
      if (char != 69 && char != 101) {
        throw new Error("Input string contains a character that is not a digit, decimal point, or \"e\" notation exponential mark.");
      }
      const eMark: i64 = Fraction.parseExp(val, offset, len);
      if (eMark != 0) {
        exponent = Fraction.overflowGuard(<i64>exponent - eMark);
      }
      break;
    }

    // Check if digits
    if (p == 0) {
      throw new Error("No digits found.");
    }

    mantissa = <TOut>(isNeg ? I64.parseInt("-" + String.fromCharCodes(codes))  : U64.parseInt(String.fromCharCodes(codes)));
    if (mantissa == 0) {
      return new Fraction<TOut>(<TOut>0, <TOut>1);
    }

    return Fraction.fromFloatParams<TOut>(mantissa, exponent);
  }
  
  private static fromFloatParams<TOut extends Number>(mantissa: TOut, exponent: i32): Fraction<TOut> {
    if (exponent > 0) {
      const scale: TOut = <TOut>U64.parseInt("1".padEnd(1 + exponent, "0"));
      return new Fraction<TOut>(mantissa, <TOut>scale);
    } else if (exponent < 0) {
      const scale: TOut = <TOut>U64.parseInt("1".padEnd(1 - exponent, "0"));
      return new Fraction<TOut>(mantissa * scale, <TOut>1);
    } else {
      return new Fraction<TOut>(mantissa, <TOut>1);
    }
  }

  private static parseExp(val: string, offset: i32, len: i32): i32 {
    offset++;
    let char: string = val.charAt(offset);
    len--;

    const negexp: boolean = char == '-';
    // sign
    if (negexp || char == '+') {
      offset++;
      char = val.charAt(offset);
      len--;
    }

    if (len <= 0) {
      throw new Error("No digits following exponential mark.");
    }
    // skip leading zeros in the exponent
    while (len > 10 && char == '0') {
      offset++;
      char = val.charAt(offset);
      len--;
    }
    if (len > 10) {
      throw new Error("Too many nonzero exponent digits.");
    }

    let exp: i64 = 0;
    for (;; len--) {
      const code = char.charCodeAt(0);
      if (code < 48 || code > 57) {
        throw new Error("Encountered non-digit character following exponential mark.");
      }
      exp = exp * 10 + (code - 48);
      if (len == 1) {
        break; // that was final character
      }
      char = val.charAt(++offset);
    }

    // apply sign
    if (negexp) {
      exp = -exp;
    }
    return Fraction.overflowGuard(exp, false);
  }

  private static overflowGuard(k: i64, isZero: boolean = false): i32 {
    let safeInt: i32 = <i32>k;
    if (<i64>safeInt != k) {
      if (!isZero) {
        throw new Error("Integer overflow");
      }
      safeInt = k > I32.MAX_VALUE ? I32.MAX_VALUE : I32.MIN_VALUE;
    }
    return safeInt;
  }

  // OUTPUT ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  toString(): string {
    return `[${this.numerator}, ${this.denominator}]`
  }

  toNumberString(): string {
    if (this.isInteger || this.numerator == 0) {
      return this.toInt().toString();
    }
    return this.toFloat<f64>().toString();
  }

  // performs floor division
  toInt(): T {
    return this.numerator / this.denominator;
  }

  toFloat<TFloat extends Number = f64>(): TFloat {
    if (!isFloat<TFloat>()) {
      throw new TypeError("Unsupported generic type " + nameof<TFloat>() + ". Expected f32 or f64.");
    }
    return <TFloat>this.numerator / <TFloat>this.denominator;
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

  quotient(): f64 {
    return <f64>this.numerator / <f64>this.denominator;
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
    return Fraction.fromFloat<f64, T>(sqrt<f64>(<f64>this.numerator / <f64>this.denominator));
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
    return abs<T>(this.numerator) >= abs<T>(this.denominator) && (this.numerator % this.denominator == 0)
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