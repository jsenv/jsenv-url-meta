import { assertUrlLike } from "./assertUrlLike.js"

export const normalizeMetaMap = (metaMap, url, ...rest) => {
  assertUrlLike(url, "url")
  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${2 + rest.length}
--- number of arguments expected ---
2`)
  }

  const metaMapNormalized = {}
  Object.keys(metaMap).forEach((key) => {
    const specifierMap = metaMap[key]
    const specifierMapNormalized = {}
    Object.keys(specifierMap).forEach((specifier) => {
      const specifierValue = specifierMap[specifier]
      const specifierResolved = String(new URL(specifier, url))
      specifierMapNormalized[specifierResolved] = specifierValue
    })
    metaMapNormalized[key] = specifierMapNormalized
  })
  return metaMapNormalized
}
