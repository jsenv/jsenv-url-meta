import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"
import { assertUrlLike } from "../assertUrlLike.js"
import { applySpecifierPatternMatching } from "../applySpecifierPatternMatching/applySpecifierPatternMatching.js"

export const urlToMeta = ({ url, specifierMetaMap } = {}) => {
  assertUrlLike(url)
  assertSpecifierMetaMap(specifierMetaMap)

  return Object.keys(specifierMetaMap).reduce((previousMeta, specifier) => {
    const { matched } = applySpecifierPatternMatching({
      specifier,
      url,
    })
    return matched ? { ...previousMeta, ...specifierMetaMap[specifier] } : previousMeta
  }, {})
}
