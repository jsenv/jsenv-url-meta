// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore

import { assertUrlLike } from "./internal/assertUrlLike.js"

export const applySpecifierPatternMatching = ({ specifier, url, ...rest } = {}) => {
  assertUrlLike(specifier, "specifier")
  assertUrlLike(url, "url")
  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
specifier, url`)
  }
  return applyPatternMatching(specifier, url)
}

const applyPatternMatching = (pattern, string) => {
  let patternIndex = 0
  let index = 0
  let remainingPattern = pattern
  let remainingString = string

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // pattern consumed and string consumed
    if (remainingPattern === "" && remainingString === "") {
      // pass because string fully matched pattern
      return pass({
        patternIndex,
        index,
      })
    }

    // pattern consumed, string not consumed
    if (remainingPattern === "" && remainingString !== "") {
      // fails because string longer than expected
      return fail({
        patternIndex,
        index,
      })
    }

    // from this point pattern is not consumed

    // string consumed, pattern not consumed
    if (remainingString === "") {
      // pass because trailing "**" is optional
      if (remainingPattern === "**") {
        return pass({
          patternIndex: patternIndex + 2,
          index,
        })
      }
      // fail because string shorted than expected
      return fail({
        patternIndex,
        index,
      })
    }

    // from this point pattern and string are not consumed

    // fast path trailing slash
    if (remainingPattern === "/") {
      // pass because trailing slash matches remaining
      if (remainingString[0] === "/") {
        return pass({
          patternIndex: patternIndex + 1,
          index: string.length,
        })
      }

      return fail({
        patternIndex,
        index,
      })
    }

    // fast path trailing '**'
    if (remainingPattern === "**") {
      // pass because trailing ** matches remaining
      return pass({
        patternIndex: patternIndex + 2,
        index: string.length,
      })
    }

    // pattern leading **
    if (remainingPattern.slice(0, 2) === "**") {
      // consumes "**"
      remainingPattern = remainingPattern.slice(2)
      patternIndex += 2
      if (remainingPattern[0] === "/") {
        // consumes "/"
        remainingPattern = remainingPattern.slice(1)
        patternIndex += 1
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
      // consumes "*"
      remainingPattern = remainingPattern.slice(1)
      patternIndex += 1

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

    // consumes next char
    remainingPattern = remainingPattern.slice(1)
    remainingString = remainingString.slice(1)
    patternIndex += 1
    index += 1
    continue
  }
}

const skipUntilMatch = ({ pattern, string, skippablePredicate = () => true }) => {
  let index = 0
  let remainingString = string
  let bestMatch = null

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matchAttempt = applyPatternMatching(pattern, remainingString)

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
    remainingString = remainingString.slice(matchAttempt.index + 1)
    index += matchAttempt.index + 1
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
