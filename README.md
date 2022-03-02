# Fraction
An AssemblyScript class for math with Fraction representations of arbitrary precision numbers

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
import { Fraction } from "as-fraction"

// generic constructor supports Array, BigNumber, BigInt, string, f32, f64, and all native integer types
const a: Fraction = Fraction.from("1.93");
// construct from BigInt[] of the form [numerator, denominator]
const b: Fraction = Fraction.fromArray([BigInt.fromString("1"), BigInt.fromString("3")]);
// construct from BigNumber
const c: Fraction = Fraction.fromBigNumber(BigNumber.from("1.93"));
// construct from BigInt
const d: Fraction = Fraction.fromBigInt(BigInt.from("3"));
// construct from string
const e: Fraction = Fraction.fromString("1.93");

// arithmetic (operator overloads: +, -, *, /, **)
const sum: Fraction = a.add(b);
const difference: Fraction = a.sub(b);
const product: Fraction = a.mul(b);
const quotient: Fraction = a.div(b);
const exponential: Fraction = a.pow(3);
const squared: Fraction = a.square();
const squareRoot: Fraction = a.sqrt();

// comparison operations (operator overloads: ==, !=, <, <=, >, >=)
const isEqual: boolean = a.eq(b);
const isNotEqual: boolean = a.ne(b);
const isLessThan: boolean = a.lt(b);
const isLessThanOrEqualTo: boolean = a.lte(b);
const isGreaterThan: boolean = a.gt(b);
const isGreaterThanOrEqualTo: boolean = a.gte(b);

// binary arithmetic and comparison operators also have static implementations
const staticProduct: Fraction = Fraction.mul(a, b);
const staticIsEqual: boolean = Fraction.eq(a, b);

// instantiate new copy, absolute value, opposite, or reciprocal
const sameNumber: Fraction = a.copy();
const positiveNumber: Fraction = a.abs();
const oppositeSign: Fraction = a.opposite();
const reciprocal: Fraction = a.reciprocal();

// convenience functions
const isNegative: boolean = a.isNegative;
const isInteger: boolean = a.isInteger;
const isZeroNumber: boolean = a.isZero();
const one: Fraction = Fraction.ONE;
const half: Fraction = Fraction.HALF;

// string output
const toString: string = a.toString();
const toDecimalString: string = a.toDecimalString(precision, rounding);
const toSignificant: string = a.toSignificant(digits, rounding);
const toFixed: string = a.toFixed(places, rounding);

// type conversions
const toBigNumber: BigNumber = a.toBigNumber();
const quotientNumber: BigNumber = a.quotient(); // alias for toBigNumber
const toBigInt: BigInt = a.toBigInt();
const toArray: Array<BigInt> = a.toArray();
```

## Development Status & Roadmap
![CI](https://github.com/polywrap/as-fraction/actions/workflows/ci.yaml/badge.svg?branch=main)

## Contributing  

### Build  
`yarn build`  

### Test  
`yarn test`  

### Lint
`yarn lint`

To autofix lint errors:
`yarn lint:fix`

## Handling integer numbers

If you need to work with arbitrarily large integers, check out as-bigint: https://github.com/polywrap/as-bigint. The BigInt class facilitates high-performance integer arithmetic.

## Handling decimal numbers

If you need to work with arbitrarily large decimal numbers, check out as-bignumber: https://github.com/polywrap/as-bignumber. The BigNumber class is built on top of BigInt for high-performance decimal arithmetic.

## Acknowledgements

Polywrap developed Fraction to use in the development tools we produce for fast, language-agnostic decentralized API development. Polywrap allows developers to interact with any web3 protocol from any language, making between-protocol composition easy. Learn more at https://polywrap.io.

as-fraction was influenced by Uniswap's Fraction class: https://github.com/Uniswap/sdk-core/blob/main/src/entities/fractions/fraction.ts.

## Contact
Please create an issue in this repository or email kris@dorg.tech
