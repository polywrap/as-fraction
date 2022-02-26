import { Fraction } from "../Fraction";
import {BigInt} from "as-bigint";

describe('comparison operators', () => {

    it("positive fractions", () => {
        let a: Fraction = new Fraction(
            BigInt.fromUInt16(1),
            BigInt.fromUInt16(10)
        );
        let b: Fraction = new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBe(-1);
        expect(a.magCompareTo(b)).toBe(-1);

        a = new Fraction(
            BigInt.fromUInt16(1),
            BigInt.fromUInt16(3)
        );
        b = new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(true);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(0);
        expect(a.magCompareTo(b)).toBe(0);


        a = new Fraction(
            BigInt.fromUInt16(5),
            BigInt.fromUInt16(12)
        );
        b = new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(1);
        expect(a.magCompareTo(b)).toBe(1);
    });

    it("positive fractions with negative numerator and denominator", () => {
        let a: Fraction = new Fraction(
            BigInt.fromUInt16(1).opposite(),
            BigInt.fromUInt16(10).opposite()
        );
        let b: Fraction = new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBe(-1);
        expect(a.magCompareTo(b)).toBe(-1);

        a = new Fraction(
            BigInt.fromUInt16(1),
            BigInt.fromUInt16(10)
        );
        b = new Fraction(
            BigInt.fromUInt16(4).opposite(),
            BigInt.fromUInt16(12).opposite()
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBe(-1);
        expect(a.magCompareTo(b)).toBe(-1);


        a = new Fraction(
            BigInt.fromUInt16(1).opposite(),
            BigInt.fromUInt16(10).opposite()
        );
        b = new Fraction(
            BigInt.fromUInt16(4).opposite(),
            BigInt.fromUInt16(12).opposite()
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBe(-1);
        expect(a.magCompareTo(b)).toBe(-1);
    });

    it("negative fractions", () => {
        let a: Fraction = new Fraction(
            BigInt.fromUInt16(1),
            BigInt.fromUInt16(10)
        );
        let b: Fraction = new Fraction(
            BigInt.fromUInt16(4).opposite(),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(1);
        expect(a.magCompareTo(b)).toBe(-1);

        a = new Fraction(
            BigInt.fromUInt16(1).opposite(),
            BigInt.fromUInt16(3)
        );
        b = new Fraction(
            BigInt.fromUInt16(4).opposite(),
            BigInt.fromUInt16(12)
        );
        expect(a.eq(b)).toBe(true);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(0);
        expect(a.magCompareTo(b)).toBe(0);


        a = new Fraction(
            BigInt.fromUInt16(5),
            BigInt.fromUInt16(12).opposite()
        );
        b = new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12).opposite()
        );
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBe(-1);
        expect(a.magCompareTo(b)).toBe(1);
    });
});