import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"
import { assertUrlLike } from "../assertUrlLike.js"
import { applySpecifierPatternMatching } from "../applySpecifierPatternMatching/applySpecifierPatternMatching.js"

export const urlToMeta = ({ url, specifierMetaMap, includePartial = false } = {}) => {
  assertUrlLike(url)
  assertSpecifierMetaMap(specifierMetaMap)

  return Object.keys(specifierMetaMap).reduce((previousMeta, specifier) => {
    const { matched, index } = applySpecifierPatternMatching({
      specifier,
      url,
    })
    if (matched || (includePartial && index >= url.length)) {
      return {
        ...previousMeta,
        ...specifierMetaMap[specifier],
      }
    }
    return previousMeta
  }, {})
}
