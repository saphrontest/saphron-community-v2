/**
 * The `useDebounce` function returns a debounce function that delays the execution of a callback
 * function until a specified interval time has passed, and can be cancelled if called again before the
 * interval time has elapsed.
 * @returns The `useDebounce` function returns a `debounce` function.
 */

const useDebounce = () => {
  /**
   * The debounce function takes a callback function and an interval time as parameters, and returns a
   * function that will execute the callback function after the specified interval time has passed, but
   * if the returned function is called again before the interval time has passed, the previous timeout
   * is cleared and a new timeout is set.
   * @param {Function} callback - The `callback` parameter is a function that will be executed after
   * the specified `intervalTime` has passed.
   * @param {number} intervalTime - The `intervalTime` parameter is the time in milliseconds that
   * specifies the delay before the `callback` function is executed.
   * @returns The debounce function returns a function that can be used to cancel the timeout.
   */
  const debounce = (callback: Function, intervalTime: number) => {
    const timeout = setTimeout(callback, intervalTime)
    return () => clearTimeout(timeout)
  }
  return debounce
}

export default useDebounce