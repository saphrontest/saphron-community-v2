const useDebounce = () => {

  const debounce = (callback: Function, intervalTime: number) => {
    const timeout = setTimeout(callback, intervalTime)
    return () => clearTimeout(timeout)
  }
  return debounce
}

export default useDebounce