import { describe, it, expect } from 'vitest';
import { includeTemplate } from '../src/merge.js';

describe('merge utils', () => {
  it('should correctly figure out if a template should be included', () => {
    const template = {
      when: {
        foo: {
          eq: 'bar',
        },
        bar: {
          gt: 5,
        },
      },
    };

    expect(includeTemplate(template, { foo: 'bar', bar: 10 })).toBe(true);
    expect(includeTemplate(template, { foo: 'something', bar: 20 })).toBe(
      false,
    );
    expect(includeTemplate(template, { foo: 'bar', bar: 4 })).toBe(false);
  });
});
