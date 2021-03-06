var _defineProperty = (function (obj, key, value) {
  // Shortcircuit the slow defineProperty path when possible.
  // We are trying to avoid issues where setters defined on the
  // prototype cause side effects under the fast path of simple
  // assignment. By checking for existence of the property with
  // the in operator, we can optimize most of this overhead away.
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
});

function _objectSpread (target) {
  for (var i = 1; i < arguments.length; i++) {
    // eslint-disable-next-line prefer-rest-params
    var source = arguments[i] === null ? {} : arguments[i];

    if (i % 2) {
      // eslint-disable-next-line no-loop-func
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      // eslint-disable-next-line no-loop-func
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
} // This function is different to "Reflect.ownKeys". The enumerableOnly
// filters on symbol properties only. Returned string properties are always
// enumerable. It is good to use in objectSpread.

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }); // eslint-disable-next-line prefer-spread

    keys.push.apply(keys, symbols);
  }

  return keys;
}

var objectWithoutPropertiesLoose = (function (source, excluded) {
  if (source === null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key;
  var i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
});

var _objectWithoutProperties = (function (source, excluded) {
  if (source === null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key;
  var i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
});

var assertUrlLike = function assertUrlLike(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "url";

  if (typeof value !== "string") {
    throw new TypeError("".concat(name, " must be a url string, got ").concat(value));
  }

  if (isWindowsPathnameSpecifier(value)) {
    throw new TypeError("".concat(name, " must be a url but looks like a windows pathname, got ").concat(value));
  }

  if (!hasScheme(value)) {
    throw new TypeError("".concat(name, " must be a url and no scheme found, got ").concat(value));
  }
};

var isWindowsPathnameSpecifier = function isWindowsPathnameSpecifier(specifier) {
  var firstChar = specifier[0];
  if (!/[a-zA-Z]/.test(firstChar)) return false;
  var secondChar = specifier[1];
  if (secondChar !== ":") return false;
  var thirdChar = specifier[2];
  return thirdChar === "/" || thirdChar === "\\";
};

var hasScheme = function hasScheme(specifier) {
  return /^[a-zA-Z]+:/.test(specifier);
};

var applyPatternMatching = function applyPatternMatching() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var pattern = _ref.pattern,
      url = _ref.url,
      rest = _objectWithoutProperties(_ref, ["pattern", "url"]);

  assertUrlLike(pattern, "pattern");
  assertUrlLike(url, "url");

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\npattern, url"));
  }

  return applyMatching(pattern, url);
};

var applyMatching = function applyMatching(pattern, string) {
  var patternIndex = 0;
  var index = 0;
  var remainingPattern = pattern;
  var remainingString = string; // eslint-disable-next-line no-constant-condition

  while (true) {
    // pattern consumed and string consumed
    if (remainingPattern === "" && remainingString === "") {
      // pass because string fully matched pattern
      return pass({
        patternIndex: patternIndex,
        index: index
      });
    } // pattern consumed, string not consumed


    if (remainingPattern === "" && remainingString !== "") {
      // fails because string longer than expected
      return fail({
        patternIndex: patternIndex,
        index: index
      });
    } // from this point pattern is not consumed
    // string consumed, pattern not consumed


    if (remainingString === "") {
      // pass because trailing "**" is optional
      if (remainingPattern === "**") {
        return pass({
          patternIndex: patternIndex + 2,
          index: index
        });
      } // fail because string shorted than expected


      return fail({
        patternIndex: patternIndex,
        index: index
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
        patternIndex: patternIndex,
        index: index
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
          patternIndex: patternIndex,
          index: string.length
        });
      }

      var skipResult = skipUntilMatch({
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
        var slashIndex = remainingString.indexOf("/");

        if (slashIndex > -1) {
          return fail({
            patternIndex: patternIndex,
            index: index + slashIndex
          });
        }

        return pass({
          patternIndex: patternIndex,
          index: string.length
        });
      } // the next char must not the one expected by remainingPattern[0]
      // because * is greedy and expect to skip one char


      if (remainingPattern[0] === remainingString[0]) {
        return fail({
          patternIndex: patternIndex - "*".length,
          index: index
        });
      }

      var _skipResult = skipUntilMatch({
        pattern: remainingPattern,
        string: remainingString,
        skippablePredicate: function skippablePredicate(remainingString) {
          return remainingString[0] !== "/";
        }
      });

      if (!_skipResult.matched) {
        return fail({
          patternIndex: patternIndex + _skipResult.patternIndex,
          index: index + _skipResult.index
        });
      }

      return pass({
        patternIndex: pattern.length,
        index: string.length
      });
    }

    if (remainingPattern[0] !== remainingString[0]) {
      return fail({
        patternIndex: patternIndex,
        index: index
      });
    } // consumes next char


    remainingPattern = remainingPattern.slice(1);
    remainingString = remainingString.slice(1);
    patternIndex += 1;
    index += 1;
    continue;
  }
};

var skipUntilMatch = function skipUntilMatch(_ref2) {
  var pattern = _ref2.pattern,
      string = _ref2.string,
      _ref2$skippablePredic = _ref2.skippablePredicate,
      skippablePredicate = _ref2$skippablePredic === void 0 ? function () {
    return true;
  } : _ref2$skippablePredic;
  var index = 0;
  var remainingString = string;
  var bestMatch = null; // eslint-disable-next-line no-constant-condition

  while (true) {
    var matchAttempt = applyMatching(pattern, remainingString);

    if (matchAttempt.matched) {
      bestMatch = matchAttempt;
      break;
    }

    var skippable = skippablePredicate(remainingString);
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
      bestMatch = _objectSpread(_objectSpread({}, bestMatch), {}, {
        index: string.length
      });
      break;
    }

    continue;
  }

  return bestMatch;
};

var pass = function pass(_ref3) {
  var patternIndex = _ref3.patternIndex,
      index = _ref3.index;
  return {
    matched: true,
    index: index,
    patternIndex: patternIndex
  };
};

var fail = function fail(_ref4) {
  var patternIndex = _ref4.patternIndex,
      index = _ref4.index;
  return {
    matched: false,
    index: index,
    patternIndex: patternIndex
  };
};

var normalizeStructuredMetaMap = function normalizeStructuredMetaMap(structuredMetaMap, url) {
  assertUrlLike(url, "url");

  if (arguments.length <= 2 ? 0 : arguments.length - 2) {
    throw new Error("received more arguments than expected.\n--- number of arguments received ---\n".concat(2 + (arguments.length <= 2 ? 0 : arguments.length - 2), "\n--- number of arguments expected ---\n2"));
  }

  var structuredMetaMapNormalized = {};
  Object.keys(structuredMetaMap).forEach(function (metaProperty) {
    var metaValueMap = structuredMetaMap[metaProperty];
    var metaValueMapNormalized = {};
    Object.keys(metaValueMap).forEach(function (pattern) {
      var metaValue = metaValueMap[pattern];
      var specifierResolved = String(new URL(pattern, url));
      metaValueMapNormalized[specifierResolved] = metaValue;
    });
    structuredMetaMapNormalized[metaProperty] = metaValueMapNormalized;
  });
  return structuredMetaMapNormalized;
};

var nativeTypeOf = function nativeTypeOf(obj) {
  return typeof obj;
};

var customTypeOf = function customTypeOf(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? nativeTypeOf : customTypeOf;

var isPlainObject = function isPlainObject(value) {
  if (value === null) {
    return false;
  }

  if (_typeof(value) === "object") {
    if (Array.isArray(value)) {
      return false;
    }

    return true;
  }

  return false;
};

var structuredMetaMapToMetaMap = function structuredMetaMapToMetaMap(structuredMetaMap) {
  if (!isPlainObject(structuredMetaMap)) {
    throw new TypeError("structuredMetaMap must be a plain object, got ".concat(structuredMetaMap));
  }

  if (arguments.length <= 1 ? 0 : arguments.length - 1) {
    throw new Error("received more arguments than expected.\n--- number of arguments received ---\n".concat(1 + (arguments.length <= 1 ? 0 : arguments.length - 1), "\n--- number of arguments expected ---\n1"));
  }

  var metaMap = {};
  Object.keys(structuredMetaMap).forEach(function (metaProperty) {
    var metaValueMap = structuredMetaMap[metaProperty];

    if (!isPlainObject(metaValueMap)) {
      throw new TypeError("metaValueMap must be plain object, got ".concat(metaValueMap, " for ").concat(metaProperty));
    }

    Object.keys(metaValueMap).forEach(function (pattern) {
      var metaValue = metaValueMap[pattern];

      var meta = _defineProperty({}, metaProperty, metaValue);

      metaMap[pattern] = pattern in metaMap ? _objectSpread(_objectSpread({}, metaMap[pattern]), meta) : meta;
    });
  });
  return metaMap;
};

var urlCanContainsMetaMatching = function urlCanContainsMetaMatching(_ref) {
  var url = _ref.url,
      structuredMetaMap = _ref.structuredMetaMap,
      predicate = _ref.predicate,
      rest = _objectWithoutProperties(_ref, ["url", "structuredMetaMap", "predicate"]);

  assertUrlLike(url, "url"); // the function was meants to be used on url ending with '/'

  if (!url.endsWith("/")) {
    throw new Error("url should end with /, got ".concat(url));
  }

  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function, got ".concat(predicate));
  }

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\nurl, structuredMetaMap, predicate"));
  }

  var metaMap = structuredMetaMapToMetaMap(structuredMetaMap); // for full match we must create an object to allow pattern to override previous ones

  var fullMatchMeta = {};
  var someFullMatch = false; // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname

  var partialMatchMetaArray = [];
  Object.keys(metaMap).forEach(function (pattern) {
    var meta = metaMap[pattern];

    var _applyPatternMatching = applyPatternMatching({
      pattern: pattern,
      url: url
    }),
        matched = _applyPatternMatching.matched,
        index = _applyPatternMatching.index;

    if (matched) {
      someFullMatch = true;
      fullMatchMeta = _objectSpread(_objectSpread({}, fullMatchMeta), meta);
    } else if (someFullMatch === false && index >= url.length) {
      partialMatchMetaArray.push(meta);
    }
  });

  if (someFullMatch) {
    return Boolean(predicate(fullMatchMeta));
  }

  return partialMatchMetaArray.some(function (partialMatchMeta) {
    return predicate(partialMatchMeta);
  });
};

var urlToMeta = function urlToMeta() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var url = _ref.url,
      structuredMetaMap = _ref.structuredMetaMap,
      rest = _objectWithoutProperties(_ref, ["url", "structuredMetaMap"]);

  assertUrlLike(url);

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\nurl, structuredMetaMap"));
  }

  var metaMap = structuredMetaMapToMetaMap(structuredMetaMap);
  return Object.keys(metaMap).reduce(function (previousMeta, pattern) {
    var _applyPatternMatching = applyPatternMatching({
      pattern: pattern,
      url: url
    }),
        matched = _applyPatternMatching.matched;

    if (matched) {
      var meta = metaMap[pattern];
      return _objectSpread(_objectSpread({}, previousMeta), meta);
    }

    return previousMeta;
  }, {});
};

export { applyPatternMatching, normalizeStructuredMetaMap, urlCanContainsMetaMatching, urlToMeta };

//# sourceMappingURL=main.js.map