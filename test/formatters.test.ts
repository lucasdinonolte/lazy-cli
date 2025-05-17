import { describe, expect, it } from 'vitest';

import { camelCase, pascalCase } from '../src/formatters';

describe('utils', () => {
  describe('camelCase', () => {
    it('should work as expcected', () => {
      expect(camelCase('foo bar')).toBe('fooBar');
      expect(camelCase('foo-bar')).toBe('fooBar');
      expect(camelCase('FOO-BAR')).toBe('fooBar');
      expect(camelCase('FooBar')).toBe('fooBar');
      expect(camelCase('fooBar')).toBe('fooBar');
      expect(camelCase('MyComponent')).toBe('myComponent');
      expect(camelCase('myComponent')).toBe('myComponent');
      expect(camelCase('IComponent')).toBe('iComponent');
    });
  });

  describe('pascalCase', () => {
    it('should work as expcected', () => {
      expect(pascalCase('foo bar')).toBe('FooBar');
      expect(pascalCase('foo-bar')).toBe('FooBar');
      expect(pascalCase('FOO-BAR')).toBe('FooBar');
      expect(pascalCase('fooBar')).toBe('FooBar');
      expect(pascalCase('FooBar')).toBe('FooBar');
      expect(pascalCase('MyComponent')).toBe('MyComponent');
      expect(pascalCase('myComponent')).toBe('MyComponent');
      expect(pascalCase('iComponent')).toBe('IComponent');
      expect(pascalCase('IComponent')).toBe('IComponent');
    });
  });
});
