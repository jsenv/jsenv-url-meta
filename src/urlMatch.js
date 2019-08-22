// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore

/*
{
  matched: Boolean, // true false if value match
  index: Number, // the index at which we were able to determine url matched or not
  patternIndex: Number, // last pattern index checked
}
*/

import { hrefToScheme } from "@jsenv/module-resolution"

export const urlMatch = ({ pattern, url }) => {
  if (typeof pattern !== "string") {
    throw new TypeError(`pattern must be a string, got ${pattern}`)
  }
  const patternScheme = hrefToScheme(pattern)
  if (!patternScheme) {
    throw new Error(`pattern must have a scheme, got ${pattern}`)
  }
  if (typeof url !== "string") {
    throw new TypeError(`url must be a string, got ${url}`)
  }
  const urlScheme = hrefToScheme(url)
  if (!urlScheme) {
    throw new Error(`url must have a scheme, got ${url}`)
  }

  return match({ pattern, string: url })
}

const match = ({ pattern, string }) => {
  let patternIndex = 0
  let index = 0
  let remainingPattern = pattern
  let remainingString = string

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //  '' === '' -> pass
    if (remainingPattern === "" && remainingString === "") {
      return pass({
        patternIndex,
        index,
      })
    }

    // '' === value -> fail
    if (remainingPattern === "" && remainingString !== "") {
      return fail({
        patternIndex,
        index,
      })
    }

    // pattern === '' -> pass only if pattern is only **
    if (remainingPattern !== "" && remainingString === "") {
      // pass because pattern is optionnal
      if (remainingPattern === "**") {
        return pass({
          patternIndex,
          index,
        })
      }

      // fail because **/ would expect something like /a
      // and **a would expect something like foo/bar/a
      return fail({
        patternIndex,
        index,
      })
    }

    if (remainingPattern.slice(0, "**".length) === "**") {
      patternIndex += `**`.length
      remainingPattern = remainingPattern.slice(`**`.length)
      if (remainingPattern[0] === "/") {
        patternIndex += "/".length
        remainingPattern = remainingPattern.slice("/".length)
      }

      // pattern ending with ** always match remaining string
      if (remainingPattern === "") {
        return pass({
          patternIndex,
          index: string.length,
        })
      }

      const skipResult = skipUntilMatch({ pattern: remainingPattern, string: remainingString })

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          index: index + skipResult.index,
        })
      }

      return pass({
        patternIndex: pattern.length,
        index: string.length,
      })
    }

    if (remainingPattern[0] === "*") {
      patternIndex += "*".length
      remainingPattern = remainingPattern.slice("*".length)

      // la c'est plus délicat, il faut que remainingString
      // ne soit composé que de truc !== '/'
      if (remainingPattern === "") {
        const slashIndex = remainingString.indexOf("/")
        if (slashIndex > -1) {
          return fail({
            patternIndex,
            index: index + slashIndex,
          })
        }
        return pass({
          patternIndex,
          index: string.length,
        })
      }

      // the next char must not the one expected by remainingPattern[0]
      // because * is greedy and expect to skip one char
      if (remainingPattern[0] === remainingString[0]) {
        return fail({
          patternIndex: patternIndex - "*".length,
          index,
        })
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        string: remainingString,
        skippablePredicate: (remainingString) => remainingString[0] !== "/",
      })

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          index: index + skipResult.index,
        })
      }

      return pass({
        patternIndex: pattern.length,
        index: string.length,
      })
    }

    if (remainingPattern[0] !== remainingString[0]) {
      return fail({
        patternIndex,
        index,
      })
    }

    // trailing slash on pattern, -> match remaining
    if (remainingPattern === "/" && remainingString.length > 1) {
      return pass({
        patternIndex: patternIndex + 1,
        index: string.length,
      })
    }

    patternIndex += 1
    index += 1
    remainingPattern = remainingPattern.slice(1)
    remainingString = remainingString.slice(1)
    continue
  }
}

const skipUntilMatch = ({ pattern, string, skippablePredicate = () => true }) => {
  let index = 0
  let remainingString = string
  let bestMatch = null

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matchAttempt = match({
      pattern,
      string: remainingString,
    })

    if (matchAttempt.matched) {
      bestMatch = matchAttempt
      break
    }

    const skippable = skippablePredicate(remainingString)

    bestMatch = fail({
      patternIndex: bestMatch
        ? Math.max(bestMatch.patternIndex, matchAttempt.patternIndex)
        : matchAttempt.patternIndex,
      index: index + matchAttempt.index,
    })

    if (!skippable) {
      break
    }

    // search against the next unattempted string
    index += matchAttempt.index + 1
    remainingString = remainingString.slice(matchAttempt.index + 1)
    if (remainingString === "") {
      bestMatch = {
        ...bestMatch,
        index: string.length,
      }
      break
    }

    continue
  }

  return bestMatch
}

const pass = ({ patternIndex, index }) => {
  return {
    matched: true,
    index,
    patternIndex,
  }
}

const fail = ({ patternIndex, index }) => {
  return {
    matched: false,
    index,
    patternIndex,
  }
}
