import { describe, it, expect } from 'vitest';
import { clsx } from './clsx.ts';

describe('clsx', () => {
  it('joins string arguments', () => {
    expect(clsx('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(clsx('foo', false, null, undefined, '', 'bar')).toBe('foo bar');
  });

  it('handles numbers', () => {
    expect(clsx('foo', 0, 1)).toBe('foo 0 1');
  });

  it('flattens arrays', () => {
    expect(clsx('foo', ['bar', 'baz'])).toBe('foo bar baz');
  });

  it('handles nested arrays', () => {
    expect(clsx('a', ['b', ['c', 'd']])).toBe('a b c d');
  });

  it('filters falsy values inside arrays', () => {
    expect(clsx(['foo', false, null, 'bar'])).toBe('foo bar');
  });

  it('returns empty string for no arguments', () => {
    expect(clsx()).toBe('');
  });

  it('returns empty string for all falsy arguments', () => {
    expect(clsx(false, null, undefined, '')).toBe('');
  });
});
