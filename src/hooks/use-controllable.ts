import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseControllableOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllable<T>(
  options: UseControllableOptions<T>,
): [T, (value: T) => void] {
  const { value, defaultValue, onChange } = options;

  const [isControlled] = useState(() => value !== undefined);
  const [internalValue, setInternalValue] = useState(defaultValue);

  if (process.env.NODE_ENV !== 'production') {
    if (isControlled && value === undefined) {
      console.warn(
        '[Tempora] A component is changing from controlled to uncontrolled. ' +
        'This is likely caused by the value changing from a defined to undefined. ' +
        'Decide between using a controlled or uncontrolled component for the lifetime of the component.',
      );
    }
    if (!isControlled && value !== undefined) {
      console.warn(
        '[Tempora] A component is changing from uncontrolled to controlled. ' +
        'This is likely caused by the value changing from undefined to a defined value. ' +
        'Decide between using a controlled or uncontrolled component for the lifetime of the component.',
      );
    }
  }

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = useCallback((next: T) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChangeRef.current?.(next);
  }, [isControlled]);

  if (isControlled) {
    return [value as T, setValue];
  }

  return [internalValue, setValue];
}
