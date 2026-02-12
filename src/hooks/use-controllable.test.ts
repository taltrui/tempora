import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useControllable } from './use-controllable.ts';

describe('useControllable', () => {
  describe('controlled mode', () => {
    it('returns the value prop', () => {
      const { result } = renderHook(() =>
        useControllable({ value: 'controlled', defaultValue: 'default' }),
      );

      expect(result.current[0]).toBe('controlled');
    });

    it('calls onChange when setter is invoked', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllable({ value: 'controlled', defaultValue: 'default', onChange }),
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(onChange).toHaveBeenCalledWith('new-value');
    });

    it('tracks prop changes on re-render', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) =>
          useControllable({ value, defaultValue: 'default' }),
        { initialProps: { value: 'first' } },
      );

      expect(result.current[0]).toBe('first');

      rerender({ value: 'second' });

      expect(result.current[0]).toBe('second');
    });
  });

  describe('uncontrolled mode', () => {
    it('starts with defaultValue', () => {
      const { result } = renderHook(() =>
        useControllable({ defaultValue: 'default' }),
      );

      expect(result.current[0]).toBe('default');
    });

    it('updates internal state when setter is invoked', () => {
      const { result } = renderHook(() =>
        useControllable({ defaultValue: 'default' }),
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('calls onChange when setter is invoked', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllable({ defaultValue: 'default', onChange }),
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(onChange).toHaveBeenCalledWith('updated');
    });
  });

  describe('mode stability', () => {
    it('stays uncontrolled if value becomes undefined after initial render', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value?: string }) =>
          useControllable({ value, defaultValue: 'default' }),
        { initialProps: { value: undefined } },
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');

      rerender({ value: 'ignored-controlled' as string | undefined });

      expect(result.current[0]).toBe('updated');
    });

    it('stays controlled if started controlled', () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ value }: { value?: string }) =>
          useControllable({ value, defaultValue: 'default', onChange }),
        { initialProps: { value: 'controlled' as string | undefined } },
      );

      expect(result.current[0]).toBe('controlled');

      rerender({ value: undefined });

      expect(result.current[0]).toBe(undefined);
    });
  });

  describe('setter stability', () => {
    it('returns a stable setter reference across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useControllable({ defaultValue: 'default' }),
      );

      const firstSetter = result.current[1];

      rerender();

      expect(result.current[1]).toBe(firstSetter);
    });
  });
});
