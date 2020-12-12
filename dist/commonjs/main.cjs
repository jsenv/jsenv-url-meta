'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const assertUrlLike = (value, name = "url") => {
  if (typeof value !== "string") {
    throw new TypeError(`${name} must be a url string, got ${value}`);
  }

  if (isWindowsPathnameSpecifier(value)) {
    throw new TypeError(`${name} must be a url but looks like a windows pathname, got ${value}`);
  }

  if (!hasScheme(value)) {
    throw new TypeError(`${name} must be a url and no scheme found, got ${value}`);
  }
};

const isWindowsPathnameSpecifier = specifier => {
  const firstChar = specifier[0];
  if (!/[a-zA-Z]/.test(firstChar)) return false;
  const secondChar = specifier[1];
  if (secondChar !== ":") return false;
  const thirdChar = specifier[2];
  return thirdChar === "/" || thirdChar === "\\";
};

const hasScheme = specifier => /^[a-zA-Z]+:/.test(specifier);

// https://git-scm.com/docs/gitignore
const applySpecifierPatternMatching = ({
  specifier,
  url,
  ...rest
} = {}) => {
  assertUrlLike(specifier, "specifier");
  assertUrlLike(url, "url");

  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
specifier, url`);
  }

  return applyPatternMatching(specifier, url);
};

const applyPatternMatching = (pattern, string) => {
  let patternIndex = 0;
  let index = 0;
  let remainingPattern = pattern;
  let remainingString = string; // eslint-disable-next-line no-constant-condition

  while (true) {
    // pattern consumed and string consumed
    if (remainingPattern === "" && remainingString === "") {
      // pass because string fully matched pattern
      return pass({
        patternIndex,
        index
      });
    } // pattern consumed, string not consumed


    if (remainingPattern === "" && remainingString !== "") {
      // fails because string longer than expected
      return fail({
        patternIndex,
        index
      });
    } // from this point pattern is not consumed
    // string consumed, pattern not consumed


    if (remainingString === "") {
      // pass because trailing "**" is optional
      if (remainingPattern === "**") {
        return pass({
          patternIndex: patternIndex + 2,
          index
        });
      } // fail because string shorted than expected


      return fail({
        patternIndex,
        index
      });
    } // from this point pattern and string are not consumed
    // fast path trailing slash


    if (remainingPattern === "/") {
      // pass because trailing slash matches remaining
      if (remainingString[0] === "/") {
        return pass({
          patternIndex: patternIndex + 1,
          index: string.length
        });
      }

      return fail({
        patternIndex,
        index
      });
    } // fast path trailing '**'


    if (remainingPattern === "**") {
      // pass because trailing ** matches remaining
      return pass({
        patternIndex: patternIndex + 2,
        index: string.length
      });
    } // pattern leading **


    if (remainingPattern.slice(0, 2) === "**") {
      // consumes "**"
      remainingPattern = remainingPattern.slice(2);
      patternIndex += 2;

      if (remainingPattern[0] === "/") {
        // consumes "/"
        remainingPattern = remainingPattern.slice(1);
        patternIndex += 1;
      } // pattern ending with ** always match remaining string


      if (remainingPattern === "") {
        return pass({
          patternIndex,
          index: string.length
        });
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        string: remainingString
      });

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          index: index + skipResult.index
        });
      }

      return pass({
        patternIndex: pattern.length,
        index: string.length
      });
    }

    if (remainingPattern[0] === "*") {
      // consumes "*"
      remainingPattern = remainingPattern.slice(1);
      patternIndex += 1; // la c'est plus délicat, il faut que remainingString
      // ne soit composé que de truc !== '/'

      if (remainingPattern === "") {
        const slashIndex = remainingString.indexOf("/");

        if (slashIndex > -1) {
          return fail({
            patternIndex,
            index: index + slashIndex
          });
        }

        return pass({
          patternIndex,
          index: string.length
        });
      } // the next char must not the one expected by remainingPattern[0]
      // because * is greedy and expect to skip one char


      if (remainingPattern[0] === remainingString[0]) {
        return fail({
          patternIndex: patternIndex - "*".length,
          index
        });
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        string: remainingString,
        skippablePredicate: remainingString => remainingString[0] !== "/"
      });

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          index: index + skipResult.index
        });
      }

      return pass({
        patternIndex: pattern.length,
        index: string.length
      });
    }

    if (remainingPattern[0] !== remainingString[0]) {
      return fail({
        patternIndex,
        index
      });
    } // consumes next char


    remainingPattern = remainingPattern.slice(1);
    remainingString = remainingString.slice(1);
    patternIndex += 1;
    index += 1;
    continue;
  }
};

const skipUntilMatch = ({
  pattern,
  string,
  skippablePredicate = () => true
}) => {
  let index = 0;
  let remainingString = string;
  let bestMatch = null; // eslint-disable-next-line no-constant-condition

  while (true) {
    const matchAttempt = applyPatternMatching(pattern, remainingString);

    if (matchAttempt.matched) {
      bestMatch = matchAttempt;
      break;
    }

    const skippable = skippablePredicate(remainingString);
    bestMatch = fail({
      patternIndex: bestMatch ? Math.max(bestMatch.patternIndex, matchAttempt.patternIndex) : matchAttempt.patternIndex,
      index: index + matchAttempt.index
    });

    if (!skippable) {
      break;
    } // search against the next unattempted string


    remainingString = remainingString.slice(matchAttempt.index + 1);
    index += matchAttempt.index + 1;

    if (remainingString === "") {
      bestMatch = { ...bestMatch,
        index: string.length
      };
      break;
    }

    continue;
  }

  return bestMatch;
};

const pass = ({
  patternIndex,
  index
}) => {
  return {
    matched: true,
    index,
    patternIndex
  };
};

const fail = ({
  patternIndex,
  index
}) => {
  return {
    matched: false,
    index,
    patternIndex
  };
};

const isPlainObject = value => {
  if (value === null) {
    return false;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return false;
    }

    return true;
  }

  return false;
};

const metaMapToSpecifierMetaMap = (metaMap, ...rest) => {
  if (!isPlainObject(metaMap)) {
    throw new TypeError(`metaMap must be a plain object, got ${metaMap}`);
  }

  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${1 + rest.length}
--- number of arguments expected ---
1`);
  }

  const specifierMetaMap = {};
  Object.keys(metaMap).forEach(metaKey => {
    const specifierValueMap = metaMap[metaKey];

    if (!isPlainObject(specifierValueMap)) {
      throw new TypeError(`metaMap value must be plain object, got ${specifierValueMap} for ${metaKey}`);
    }

    Object.keys(specifierValueMap).forEach(specifier => {
      const metaValue = specifierValueMap[specifier];
      const meta = {
        [metaKey]: metaValue
      };
      specifierMetaMap[specifier] = specifier in specifierMetaMap ? { ...specifierMetaMap[specifier],
        ...meta
      } : meta;
    });
  });
  return specifierMetaMap;
};

const assertSpecifierMetaMap = (value, checkComposition = true) => {
  if (!isPlainObject(value)) {
    throw new TypeError(`specifierMetaMap must be a plain object, got ${value}`);
  }

  if (checkComposition) {
    const plainObject = value;
    Object.keys(plainObject).forEach(key => {
      assertUrlLike(key, "specifierMetaMap key");
      const value = plainObject[key];

      if (value !== null && !isPlainObject(value)) {
        throw new TypeError(`specifierMetaMap value must be a plain object or null, got ${value} under key ${key}`);
      }
    });
  }
};

const normalizeSpecifierMetaMap = (specifierMetaMap, url, ...rest) => {
  assertSpecifierMetaMap(specifierMetaMap, false);
  assertUrlLike(url, "url");

  if (rest.length) {
    throw new Error(`received more arguments than expected.
--- number of arguments received ---
${2 + rest.length}
--- number of arguments expected ---
2`);
  }

  const specifierMetaMapNormalized = {};
  Object.keys(specifierMetaMap).forEach(specifier => {
    const specifierResolved = String(new URL(specifier, url));
    specifierMetaMapNormalized[specifierResolved] = specifierMetaMap[specifier];
  });
  return specifierMetaMapNormalized;
};

const urlCanContainsMetaMatching = ({
  url,
  specifierMetaMap,
  predicate,
  ...rest
}) => {
  assertUrlLike(url, "url"); // the function was meants to be used on url ending with '/'

  if (!url.endsWith("/")) {
    throw new Error(`url should end with /, got ${url}`);
  }

  assertSpecifierMetaMap(specifierMetaMap);

  if (typeof predicate !== "function") {
    throw new TypeError(`predicate must be a function, got ${predicate}`);
  }

  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
url, specifierMetaMap, predicate`);
  } // for full match we must create an object to allow pattern to override previous ones


  let fullMatchMeta = {};
  let someFullMatch = false; // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname

  const partialMatchMetaArray = [];
  Object.keys(specifierMetaMap).forEach(specifier => {
    const meta = specifierMetaMap[specifier];
    const {
      matched,
      index
    } = applySpecifierPatternMatching({
      specifier,
      url
    });

    if (matched) {
      someFullMatch = true;
      fullMatchMeta = { ...fullMatchMeta,
        ...meta
      };
    } else if (someFullMatch === false && index >= url.length) {
      partialMatchMetaArray.push(meta);
    }
  });

  if (someFullMatch) {
    return Boolean(predicate(fullMatchMeta));
  }

  return partialMatchMetaArray.some(partialMatchMeta => predicate(partialMatchMeta));
};

const urlToMeta = ({
  url,
  specifierMetaMap,
  ...rest
} = {}) => {
  assertUrlLike(url);
  assertSpecifierMetaMap(specifierMetaMap);

  if (Object.keys(rest).length) {
    throw new Error(`received more parameters than expected.
--- name of unexpected parameters ---
${Object.keys(rest)}
--- name of expected parameters ---
url, specifierMetaMap`);
  }

  return Object.keys(specifierMetaMap).reduce((previousMeta, specifier) => {
    const {
      matched
    } = applySpecifierPatternMatching({
      specifier,
      url
    });

    if (matched) {
      return { ...previousMeta,
        ...specifierMetaMap[specifier]
      };
    }

    return previousMeta;
  }, {});
};

exports.applySpecifierPatternMatching = applySpecifierPatternMatching;
exports.metaMapToSpecifierMetaMap = metaMapToSpecifierMetaMap;
exports.normalizeSpecifierMetaMap = normalizeSpecifierMetaMap;
exports.urlCanContainsMetaMatching = urlCanContainsMetaMatching;
exports.urlToMeta = urlToMeta;

//# sourceMappingURL=main.cjs.map