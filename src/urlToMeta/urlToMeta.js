import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"
import { assertUrlLike } from "../assertUrlLike.js"
import { applySpecifierPatternMatching } from "../applySpecifierPatternMatching/applySpecifierPatternMatching.js"

export const urlToMeta = ({ url, specifierMetaMap, ...rest } = {}) => {
  assertUrlLike(url)
  assertSpecifierMetaMap(specifierMetaMap)
  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
url, specifierMetaMap`)
  }

  return Object.keys(specifierMetaMap).reduce((previousMeta, specifier) => {
    const { matched } = applySpecifierPatternMatching({
      specifier,
      url,
    })
    if (matched) {
      return {
        ...previousMeta,
        ...specifierMetaMap[specifier],
      }
    }
    return previousMeta
  }, {})
}
