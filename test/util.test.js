import { describe, it, expect } from 'vitest';
import { camelCase, pascalCase } from '../src/util.js';

describe('utils', () => {
  describe('camelCase', () => {
    it('should correctly figure out if a template should be included', () => {
      expect(camelCase('foo bar')).toBe('fooBar');
      expect(camelCase('foo-bar')).toBe('fooBar');
      expect(camelCase('FOO-BAR')).toBe('fooBar');
      expect(camelCase('fOo---BaR')).toBe('fooBar');
      expect(camelCase('fOO    BAr')).toBe('fooBar');
      expect(camelCase('FooBar')).toBe('fooBar');
      expect(camelCase('fooBar')).toBe('fooBar');
    });
  });

  describe('pascalCase', () => {
    it('should correctly figure out if a template should be included', () => {
      expect(pascalCase('foo bar')).toBe('FooBar');
      expect(pascalCase('foo-bar')).toBe('FooBar');
      expect(pascalCase('FOO-BAR')).toBe('FooBar');
      expect(pascalCase('fOo---BaR')).toBe('FooBar');
      expect(pascalCase('fOO    BAr')).toBe('FooBar');
      expect(pascalCase('fooBar')).toBe('FooBar');
      expect(pascalCase('FooBar')).toBe('FooBar');
    });
  });
});
