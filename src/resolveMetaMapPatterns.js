import { hrefToScheme } from "@jsenv/module-resolution"

export const resolveMetaMapPatterns = (metaMap, href) => {
  if (typeof href !== "string") {
    throw new TypeError(`href must be a string, got ${href}`)
  }
  if (!hrefToScheme(href)) {
    throw new TypeError(`href must have a scheme, got ${href}`)
  }

  const resolvedMetaMap = {}
  Object.keys(metaMap).forEach((pattern) => {
    if (hrefToScheme(pattern)) {
      resolvedMetaMap[pattern] = metaMap[pattern]
    } else {
      const resolvedPattern = `${href}${pattern}`
      resolvedMetaMap[resolvedPattern] = metaMap[pattern]
    }
  })
  return resolvedMetaMap
}
