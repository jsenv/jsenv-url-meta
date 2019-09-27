import { resolveSpecifier } from "@jsenv/import-map"
import { assertSpecifierMetaMap } from "../assertSpecifierMetaMap.js"

const FAKE_HTTP_ORIGIN_UNLIKELY_TO_COLLIDE = "http://fake_origin_unlikely_to_collide.ext"

export const normalizeSpecifierMetaMap = (
  specifierMetaMap,
  url,
  { forceHttpResolutionForFile = false } = {},
) => {
  assertSpecifierMetaMap(specifierMetaMap)

  const resolveSpecifierScoped =
    forceHttpResolutionForFile && url.startsWith("file:///")
      ? (specifier, url) => {
          const specifierResolvedAgainstHttp = resolveSpecifier(
            specifier,
            FAKE_HTTP_ORIGIN_UNLIKELY_TO_COLLIDE,
          )
          if (specifierResolvedAgainstHttp.startsWith(`${FAKE_HTTP_ORIGIN_UNLIKELY_TO_COLLIDE}/`)) {
            const specifierPathname = specifierResolvedAgainstHttp.slice(
              FAKE_HTTP_ORIGIN_UNLIKELY_TO_COLLIDE.length,
            )
            return `${url}${specifierPathname}`
          }
          return specifierResolvedAgainstHttp
        }
      : resolveSpecifier

  const specifierMetaMapNormalized = {}
  Object.keys(specifierMetaMap).forEach((specifier) => {
    const specifierResolved = resolveSpecifierScoped(specifier, url)
    specifierMetaMapNormalized[specifierResolved] = specifierMetaMap[specifier]
  })
  return specifierMetaMapNormalized
}
