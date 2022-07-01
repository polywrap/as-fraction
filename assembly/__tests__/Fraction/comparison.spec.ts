import { Fraction } from "../../Fraction";

describe('comparison operators', () => {

    it("positive fractions", () => {
        let a: Fraction<i32>;
        let b: Fraction<i32>;
        let au: Fraction<u32>;
        let bu: Fraction<u32>;

        a = new Fraction<i32>(1, 10);
        b = new Fraction<i32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        au = new Fraction<u32>(1, 10);
        bu = new Fraction<u32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        a = new Fraction<i32>(1,3);
        b = new Fraction<i32>(4, 12);
        expect(a.eq(b)).toBe(true);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(0);
        expect(a.magCompareTo(b)).toBe(0);

        au = new Fraction<u32>(1,3);
        bu = new Fraction<u32>(4, 12);
        expect(a.eq(b)).toBe(true);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(0);
        expect(a.magCompareTo(b)).toBe(0);


        a = new Fraction<i32>(5, 12);
        b = new Fraction<i32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBeGreaterThan(0);
        expect(a.magCompareTo(b)).toBeGreaterThan(0);

        au = new Fraction<u32>(5, 12);
        bu = new Fraction<u32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBeGreaterThan(0);
        expect(a.magCompareTo(b)).toBeGreaterThan(0);
    });

    it("positive fractions with negative numerator and denominator", () => {
        let a: Fraction<i32>;
        let b: Fraction<i32>;
        let au: Fraction<u32>;
        let bu: Fraction<u32>;

        a = new Fraction<i32>(-1, -10);
        b = new Fraction<i32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        a = new Fraction<i32>(-1, -10);
        bu = new Fraction<u32>(4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        a = new Fraction<i32>(1, 10);
        b = new Fraction<i32>(-4, -12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        au = new Fraction<u32>(1, 10);
        b = new Fraction<i32>(-4, -12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        a = new Fraction<i32>(-1, -10);
        b = new Fraction<i32>(-4, -12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);
    });

    it("negative fractions", () => {
        let a: Fraction<i32>;
        let b: Fraction<i32>;
        let au: Fraction<u32>;

        a = new Fraction<i32>(1, 10);
        b = new Fraction<i32>(-4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBeGreaterThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        au = new Fraction<u32>(1, 10);
        b = new Fraction<i32>(-4, 12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(false);
        expect(a.gt(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBeGreaterThan(0);
        expect(a.magCompareTo(b)).toBeLessThan(0);

        a = new Fraction<i32>(-1, 3);
        b = new Fraction<i32>(-4, 12);
        expect(a.eq(b)).toBe(true);
        expect(a.lt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(true);
        expect(a.compareTo(b)).toBe(0);
        expect(a.magCompareTo(b)).toBe(0);


        a = new Fraction<i32>(5, -12);
        b = new Fraction<i32>(4, -12);
        expect(a.eq(b)).toBe(false);
        expect(a.lt(b)).toBe(true);
        expect(a.lte(b)).toBe(true);
        expect(a.gt(b)).toBe(false);
        expect(a.gte(b)).toBe(false);
        expect(a.compareTo(b)).toBeLessThan(0);
        expect(a.magCompareTo(b)).toBeGreaterThan(0);
    });
});