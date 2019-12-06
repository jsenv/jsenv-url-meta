export const assertUrlLike = (value, name = "url") => {
  if (typeof value !== "string") {
    throw new TypeError(`${name} must be a url string, got ${value}`)
  }
  if (isWindowsPathnameSpecifier(value)) {
    throw new TypeError(`${name} must be a url but looks like a windows pathname, got ${value}`)
  }
  if (!hasScheme(value)) {
    throw new TypeError(`${name} must be a url and no scheme found, got ${value}`)
  }
}

const isWindowsPathnameSpecifier = (specifier) => {
  const firstChar = specifier[0]
  if (!/[a-zA-Z]/.test(firstChar)) return false
  const secondChar = specifier[1]
  if (secondChar !== ":") return false
  const thirdChar = specifier[2]
  return thirdChar === "/"
}

const hasScheme = (specifier) => /^[a-zA-Z]+:/.test(specifier)
