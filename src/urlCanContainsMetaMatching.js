import { urlMatch } from "./urlMatch.js"

export const urlCanContainsMetaMatching = ({ url, metaMap, predicate }) => {
  if (typeof url !== "string") throw new TypeError(`pathname must be a string, got ${url}`)
  if (typeof metaMap !== "object") throw new TypeError(`metaMap must be an object, got ${metaMap}`)
  if (typeof predicate !== "function")
    throw new TypeError(`predicate must be a function, got ${predicate}`)

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

  Object.keys(metaMap).forEach((pattern) => {
    const { matched, index } = urlMatch({
      url: urlWithTrailingSlash,
      pattern,
    })
    if (matched) {
      someFullMatch = true
      fullMatchMeta = {
        ...fullMatchMeta,
        ...metaMap[pattern],
      }
    } else if (someFullMatch === false && index >= url.length) {
      partialMatchMetaArray.push(metaMap[pattern])
    }
  })

  if (someFullMatch) return Boolean(predicate(fullMatchMeta))

  return partialMatchMetaArray.some((partialMatchMeta) => predicate(partialMatchMeta))
}
