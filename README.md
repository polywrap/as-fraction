# as-fraction
AssemblyScript classes for math with fraction representations of fixed and arbitrary precision numbers

`BigFraction` is a class for arbitrary precision arithmetic with numbers of arbitrary size. The numerator and denominator
of a `BigFraction` are of type `BigInt`.

`Fraction` is a generic class for fixed precision arithmetic with integer primitives.
It no external dependencies, making it lightweight, performant, and memory efficient.

`Fraction` limits:
Square root and string output operations are handled by 64-bit float operations, and therefore those operations have the
same precision as 64-bit float operations. 
More importantly, core arithmetic operations (add, subtract, multiply, divide) involve multiplication of the numerators 
and denominators to obtain precise results.
These operations cast the numerator and denominator to 64-bit integers during intermediate operations to prevent integer 
overflow. 
Operations on Fraction<i64> and Fraction<u64> are unsafe. 
Integer overflow does not throw an exception.

## Features

- Fast arithmetic operations
- Lightweight
- Immutable instances
- Core operations thoroughly tested

## Getting Started

### Installation
`npm install as-fraction`  
or  
`yarn add as-fraction`

### Quick start

```typescript
import { BigFraction } from "as-fraction"

// construct from numerator and denominator
const standard: BigFraction = new BigFraction(BigInt.from(1), BigInt.from(3));

// generic constructor supports Array, BigNumber, Fraction, BigInt, string, f32, f64, and all native integer types
const a: BigFraction = BigFraction.from("1.93");
// construct from BigInt[] of the form [numerator, denominator]
const b: BigFraction = BigFraction.fromArray([BigInt.from(1), BigInt.from(3)]);
// construct from BigNumber
const c: BigFraction = BigFraction.fromBigNumber(BigNumber.from("1.93"));
// construct from BigInt
const d: BigFraction = BigFraction.fromBigInt(BigInt.from("3"));
// construct from string
const e: BigFraction = BigFraction.fromString("1.93");

// arithmetic (operator overloads: +, -, *, /, **)
const sum: BigFraction = a.add(b);
const difference: BigFraction = a.sub(b);
const product: BigFraction = a.mul(b);
const quotient: BigFraction = a.div(b);
const exponential: BigFraction = a.pow(3);
const squared: BigFraction = a.square();
const squareRoot: BigFraction = a.sqrt();

// comparison operations (operator overloads: ==, !=, <, <=, >, >=)
const isEqual: boolean = a.eq(b);
const isNotEqual: boolean = a.ne(b);
const isLessThan: boolean = a.lt(b);
const isLessThanOrEqualTo: boolean = a.lte(b);
const isGreaterThan: boolean = a.gt(b);
const isGreaterThanOrEqualTo: boolean = a.gte(b);

// binary arithmetic and comparison operators also have static implementations
const staticProduct: BigFraction = BigFraction.mul(a, b);
const staticIsEqual: boolean = BigFraction.eq(a, b);

// instantiate new copy, absolute value, opposite, or reciprocal
const sameNumber: BigFraction = a.copy();
const positiveNumber: BigFraction = a.abs();
const oppositeSign: BigFraction = a.opposite();
const reciprocal: BigFraction = a.reciprocal();

// convenience functions
const isNegative: boolean = a.isNegative;
const isInteger: boolean = a.isInteger;
const isZeroNumber: boolean = a.isZero();
const one: BigFraction = BigFraction.ONE;
const half: BigFraction = BigFraction.HALF;

// string output
const toString: string = a.toString(); // e.g. "[1, 3]"
const toNumberString: string = a.toNumberString(precision, rounding); // e.g. "0.333"
const toSignificant: string = a.toSignificant(digits, rounding);
const toFixed: string = a.toFixed(places, rounding);

// type conversions
const toBigNumber: BigNumber = a.toBigNumber();
const quotientNumber: BigNumber = a.quotient(); // alias for toBigNumber
const toBigInt: BigInt = a.toBigInt();
const toArray: Array<BigInt> = a.toArray();
```

```typescript
import { Fraction } from "as-fraction"

// construct from numerator and denominator
const standard: Fraction<T> = new Fraction<T>(1, 3);

// generic constructor supports Array, string, f32, f64, and all native integer types
const a: Fraction<T> = Fraction.from("1.93");
// construct from BigInt[] of the form [numerator, denominator]
const b: Fraction<T> = Fraction.fromArray<T>([1, 3]);
// construct from string
const c: Fraction<T> = Fraction.fromString<T>("1.93");

// arithmetic (operator overloads: +, -, *, /, **)
const sum: Fraction<T> = a.add(b);
const difference: Fraction<T> = a.sub(b);
const product: Fraction<T> = a.mul(b);
const quotient: Fraction<T> = a.div(b);
const exponential: Fraction<T> = a.pow(3);
const squared: Fraction<T> = a.square();
const squareRoot: Fraction<T> = a.sqrt();

// comparison operations (operator overloads: ==, !=, <, <=, >, >=)
const isEqual: boolean = a.eq(b);
const isNotEqual: boolean = a.ne(b);
const isLessThan: boolean = a.lt(b);
const isLessThanOrEqualTo: boolean = a.lte(b);
const isGreaterThan: boolean = a.gt(b);
const isGreaterThanOrEqualTo: boolean = a.gte(b);

// binary arithmetic and comparison operators also have static implementations
const staticProduct: Fraction<T> = Fraction.mul(a, b);
const staticIsEqual: boolean = Fraction.eq(a, b);

// instantiate new copy, absolute value, opposite, or reciprocal
const sameNumber: Fraction<T> = a.copy();
const positiveNumber: Fraction<T> = a.abs();
const oppositeSign: Fraction<T> = a.opposite();
const reciprocal: Fraction<T> = a.reciprocal();

// convenience functions
const isNegative: boolean = a.isNegative;
const isInteger: boolean = a.isInteger;
const isZeroNumber: boolean = a.isZero();

// string output
const toString: string = a.toString(); // e.g. "[1, 3]"
const toNumberString: string = a.toNumberString(precision, rounding); // e.g. "0.333"

// type conversions
const toFraction: Fraction<T> = a.toFraction<T>(); // T is desired generic type (an integer primitive)
const toFloat: f32 = a.toFloat<f32>(); // cast to f32 or f64
const quotientNumber: f64 = a.quotient(); // synonym for a.toFloat<f64>();
const toArray: Array<T> = a.toArray(); // returns [numerator, denominator]
const floorDivision: T = a.toInt(); // returns the fraction's generic type (an integer primitive)
```

### Rounding and Precision

Because some numbers are irrational or have infinite digits, rounding is necessary when converting a fraction to its 
decimal representation. Numbers are rounded to a specific number of digits, which we call 'precision'. For example, the 
number 123.45 has five digits, and therefore has a precision of 5.

By default, decimal output is assigned a maximum precision of 155. When a result of a decimal output operation would 
exceed 155 digits, it is rounded to the best 155 digits according to the default or specified rounding rule. The 
magnitude of a number can still exceed that of a 155 digit integer due to exponential notation.

Decimal output operations accept optional arguments to specify the precision and rounding mode for the result of the 
operation. The default precision and rounding mode can also be changed using static methods.

A precision less than or equal to 0 indicates that the result of a decimal output operation should have exact precision. 
This can cause operations to throw an exception when a result would have infinite digits.

```typescript
// rounding modes
export enum Rounding {
  UP, // Rounding mode to round away from zero.
  DOWN, // Rounding mode to round towards zero.
  CEIL, // Rounding mode to round towards positive infinity.
  FLOOR, // Rounding mode to round towards negative infinity.
  HALF_UP, // Rounding mode to round towards "nearest neighbor" unless both neighbors are equidistant, in which case round up.
  HALF_DOWN, // Rounding mode to round towards "nearest neighbor" unless both neighbors are equidistant, in which case round down.
  HALF_EVEN, // Rounding mode to round towards the "nearest neighbor" unless both neighbors are equidistant, in which case, round towards the even neighbor.
  NONE, // Rounding mode to assert that the requested operation has an exact result, hence no rounding is necessary.
}
```
```typescript
import { BigFraction, Rounding } from "as-fraction"

// many methods accept arguments that adjust precision and rounding
const precision: i32 = 250;
const rounding: Rounding = Rounding.FLOOR;
const fraction: BigFraction = new BigFraction(BigInt.from(1), BigInt.from(3));
const quotient: string = fraction.toNumberString(precision, rounding);

// default precision and rounding can be changed
BigFraction.DEFAULT_PRECISION = 155;
BigFraction.DEFAULT_ROUNDING = Rounding.HALF_UP;
```

## Contributing  

### Build  
`yarn build`  

### Test  
`yarn test`  

### Lint
`yarn lint`

To autofix lint errors:
`yarn lint:fix`

## Handling large integer numbers

If you need to work with arbitrarily large integers, check out as-bigint: https://github.com/polywrap/as-bigint. The BigInt class facilitates high-performance integer arithmetic.

## Handling large decimal numbers

If you need to work with arbitrarily large decimal numbers, check out as-bignumber: https://github.com/polywrap/as-bignumber. The BigNumber class is built on top of BigInt for high-performance decimal arithmetic.

## Acknowledgements

Polywrap developed BigFraction and Fraction to use in the development tools we produce for fast, language-agnostic decentralized API development. Polywrap allows developers to interact with any web3 protocol from any language, making between-protocol composition easy. Learn more at https://polywrap.io.

as-fraction was influenced by Uniswap's Fraction class: https://github.com/Uniswap/sdk-core/blob/main/src/entities/fractions/fraction.ts.

## Contact
Please create an issue in this repository or email kris@dorg.tech
