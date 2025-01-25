import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../use-toggle';

describe('useToggle', () => {
  test('should initialize with the correct default value', () => {
    const { result } = renderHook(() => useToggle());

    // Default value should be false
    expect(result.current[0]).toBe(false);
  });

  test('should initialize with the provided initial value', () => {
    const { result } = renderHook(() => useToggle(true));

    // Initial value should be true
    expect(result.current[0]).toBe(true);
  });

  test('should toggle the value', () => {
    const { result } = renderHook(() => useToggle(false));

    // Initial value should be false
    expect(result.current[0]).toBe(false);

    // Toggle the value
    act(() => {
      result.current[1]();
    });

    // Value should now be true
    expect(result.current[0]).toBe(true);

    // Toggle again
    act(() => {
      result.current[1]();
    });

    // Value should now be false
    expect(result.current[0]).toBe(false);
  });

  test('should handle multiple toggles', () => {
    const { result } = renderHook(() => useToggle(false));

    // Toggle multiple times
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});
