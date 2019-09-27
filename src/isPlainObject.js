export const isPlainObject = (value) => {
  if (value === null) {
    return false
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return false
    }
    return true
  }
  return false
}
