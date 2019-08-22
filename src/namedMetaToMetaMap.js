export const namedMetaToMetaMap = (namedMeta) => {
  const metaMap = {}

  Object.keys(namedMeta).forEach((metaName) => {
    const valueMap = namedMeta[metaName]
    Object.keys(valueMap).forEach((pattern) => {
      const value = valueMap[pattern]
      const meta = { [metaName]: value }
      metaMap[pattern] = pattern in metaMap ? { ...metaMap[pattern], ...meta } : meta
    })
  })

  return metaMap
}
