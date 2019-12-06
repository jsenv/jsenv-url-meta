import { assertUrlLike } from "./internal/assertUrlLike.js"
import { assertSpecifierMetaMap } from "./internal/assertSpecifierMetaMap.js"
import { applySpecifierPatternMatching } from "./applySpecifierPatternMatching.js"

export const urlCanContainsMetaMatching = ({ url, specifierMetaMap, predicate, ...rest }) => {
  assertUrlLike(url, "url")
  // the function was meants to be used on url ending with '/'
  if (!url.endsWith("/")) {
    throw new Error(`url should end with /, got ${url}`)
  }
  assertSpecifierMetaMap(specifierMetaMap)
  if (typeof predicate !== "function") {
    throw new TypeError(`predicate must be a function, got ${predicate}`)
  }
  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
url, specifierMetaMap, predicate`)
  }

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
      url,
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
