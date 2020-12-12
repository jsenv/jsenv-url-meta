import { assertUrlLike } from "./internal/assertUrlLike.js"

export const normalizeStructuredMetaMap = (structuredMetaMap, url, ...rest) => {
  assertUrlLike(url, "url")
  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${2 + rest.length}
--- number of arguments expected ---
2`)
  }

  const structuredMetaMapNormalized = {}
  Object.keys(structuredMetaMap).forEach((metaProperty) => {
    const metaValueMap = structuredMetaMap[metaProperty]
    const metaValueMapNormalized = {}
    Object.keys(metaValueMap).forEach((pattern) => {
      const metaValue = metaValueMap[pattern]
      const specifierResolved = String(new URL(pattern, url))
      metaValueMapNormalized[specifierResolved] = metaValue
    })
    structuredMetaMapNormalized[metaProperty] = metaValueMapNormalized
  })
  return structuredMetaMapNormalized
}
