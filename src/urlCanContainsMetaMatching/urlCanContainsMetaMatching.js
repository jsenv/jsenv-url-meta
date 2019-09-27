import { assertUrlLike } from "../assertUrlLike.js"
import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"
import { applySpecifierPatternMatching } from "../applySpecifierPatternMatching/applySpecifierPatternMatching.js"

export const urlCanContainsMetaMatching = ({ url, specifierMetaMap, predicate }) => {
  assertUrlLike(url, "url")
  assertSpecifierMetaMap(specifierMetaMap)
  if (typeof predicate !== "function") {
    throw new TypeError(`predicate must be a function, got ${predicate}`)
  }

  // we add a trailing slash because we are intested into what will be inside
  // this url, not the url itself
  // it allows to match pattern for what is inside
  const urlWithTrailingSlash = `${url}/`

  // for full match we must create an object to allow pattern to override previous ones
  let fullMatchMeta = {}
  let someFullMatch = false
  // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname
  const partialMatchMetaArray = []

  Object.keys(specifierMetaMap).forEach((specifier) => {
    const meta = specifierMetaMap[specifier]
    const { matched, index } = applySpecifierPatternMatching({
      specifier,
      url: urlWithTrailingSlash,
    })
    if (matched) {
      someFullMatch = true
      fullMatchMeta = {
        ...fullMatchMeta,
        ...meta,
      }
    } else if (someFullMatch === false && index >= url.length) {
      partialMatchMetaArray.push(meta)
    }
  })

  if (someFullMatch) {
    return Boolean(predicate(fullMatchMeta))
  }

  return partialMatchMetaArray.some((partialMatchMeta) => predicate(partialMatchMeta))
}
