import { assertUrlLike } from "./internal/assertUrlLike.js"
import { structuredMetaMapToMetaMap } from "./internal/structuredMetaMapToMetaMap.js"
import { applySpecifierPatternMatching } from "./applySpecifierPatternMatching.js"

export const urlToMeta = ({ url, structuredMetaMap, ...rest } = {}) => {
  assertUrlLike(url)
  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
url, structuredMetaMap`)
  }

  const metaMap = structuredMetaMapToMetaMap(structuredMetaMap)
  return Object.keys(metaMap).reduce((previousMeta, pattern) => {
    const { matched } = applySpecifierPatternMatching({
      pattern,
      url,
    })
    if (matched) {
      const meta = metaMap[pattern]
      return {
        ...previousMeta,
        ...meta,
      }
    }
    return previousMeta
  }, {})
}
