import { urlMatch } from "./urlMatch.js"

export const urlToMeta = ({ url, metaMap }) => {
  return Object.keys(metaMap).reduce((previousMeta, metaPattern) => {
    const { matched } = urlMatch({ url, pattern: metaPattern })
    return matched ? { ...previousMeta, ...metaMap[metaPattern] } : previousMeta
  }, {})
}
