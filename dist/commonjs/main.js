'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var applySpecifierPatternMatching = function applySpecifierPatternMatching() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var specifier = _ref.specifier,
      url = _ref.url,
      rest = _objectWithoutProperties(_ref, ["specifier", "url"]);

  assertUrlLike(specifier, "specifier");
  assertUrlLike(url, "url");

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\nspecifier, url"));
  }

  return applyPatternMatching(specifier, url);
};

var applyPatternMatching = function applyPatternMatching(pattern, string) {
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
      return pass({
        patternIndex: patternIndex + 1,
        index: string.length
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
    var matchAttempt = applyPatternMatching(pattern, remainingString);

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
      bestMatch = _objectSpread({}, bestMatch, {
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

var metaMapToSpecifierMetaMap = function metaMapToSpecifierMetaMap(metaMap) {
  if (!isPlainObject(metaMap)) {
    throw new TypeError("metaMap must be a plain object, got ".concat(metaMap));
  }

  if (arguments.length <= 1 ? 0 : arguments.length - 1) {
    throw new Error("received more arguments than expected.\n--- number of arguments received ---\n".concat(1 + (arguments.length <= 1 ? 0 : arguments.length - 1), "\n--- number of arguments expected ---\n1"));
  }

  var specifierMetaMap = {};
  Object.keys(metaMap).forEach(function (metaKey) {
    var specifierValueMap = metaMap[metaKey];

    if (!isPlainObject(specifierValueMap)) {
      throw new TypeError("metaMap value must be plain object, got ".concat(specifierValueMap, " for ").concat(metaKey));
    }

    Object.keys(specifierValueMap).forEach(function (specifier) {
      var metaValue = specifierValueMap[specifier];

      var meta = _defineProperty({}, metaKey, metaValue);

      specifierMetaMap[specifier] = specifier in specifierMetaMap ? _objectSpread({}, specifierMetaMap[specifier], {}, meta) : meta;
    });
  });
  return specifierMetaMap;
};

var assertSpecifierMetaMap = function assertSpecifierMetaMap(value) {
  if (!isPlainObject(value)) {
    throw new TypeError("specifierMetaMap must be a plain object, got ".concat(value));
  } // we could ensure it's key/value pair of url like key/object or null values

};

var normalizeSpecifierMetaMap = function normalizeSpecifierMetaMap(specifierMetaMap, url) {
  assertSpecifierMetaMap(specifierMetaMap);
  assertUrlLike(url, "url");

  if (arguments.length <= 2 ? 0 : arguments.length - 2) {
    throw new Error("received more arguments than expected.\n--- number of arguments received ---\n".concat(2 + (arguments.length <= 2 ? 0 : arguments.length - 2), "\n--- number of arguments expected ---\n2"));
  }

  var specifierMetaMapNormalized = {};
  Object.keys(specifierMetaMap).forEach(function (specifier) {
    var specifierResolved = String(new URL(specifier, url));
    specifierMetaMapNormalized[specifierResolved] = specifierMetaMap[specifier];
  });
  return specifierMetaMapNormalized;
};

var urlCanContainsMetaMatching = function urlCanContainsMetaMatching(_ref) {
  var url = _ref.url,
      specifierMetaMap = _ref.specifierMetaMap,
      predicate = _ref.predicate,
      rest = _objectWithoutProperties(_ref, ["url", "specifierMetaMap", "predicate"]);

  assertUrlLike(url, "url"); // the function was meants to be used on url ending with '/'

  if (!url.endsWith("/")) {
    throw new Error("url should end with /, got ".concat(url));
  }

  assertSpecifierMetaMap(specifierMetaMap);

  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function, got ".concat(predicate));
  }

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\nurl, specifierMetaMap, predicate"));
  } // for full match we must create an object to allow pattern to override previous ones


  var fullMatchMeta = {};
  var someFullMatch = false; // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname

  var partialMatchMetaArray = [];
  Object.keys(specifierMetaMap).forEach(function (specifier) {
    var meta = specifierMetaMap[specifier];

    var _applySpecifierPatter = applySpecifierPatternMatching({
      specifier: specifier,
      url: url
    }),
        matched = _applySpecifierPatter.matched,
        index = _applySpecifierPatter.index;

    if (matched) {
      someFullMatch = true;
      fullMatchMeta = _objectSpread({}, fullMatchMeta, {}, meta);
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
      specifierMetaMap = _ref.specifierMetaMap,
      rest = _objectWithoutProperties(_ref, ["url", "specifierMetaMap"]);

  assertUrlLike(url);
  assertSpecifierMetaMap(specifierMetaMap);

  if (Object.keys(rest).length) {
    throw new Error("received more parameters than expected.\n--- name of unexpected parameters ---\n".concat(Object.keys(rest), "\n--- name of expected parameters ---\nurl, specifierMetaMap"));
  }

  return Object.keys(specifierMetaMap).reduce(function (previousMeta, specifier) {
    var _applySpecifierPatter = applySpecifierPatternMatching({
      specifier: specifier,
      url: url
    }),
        matched = _applySpecifierPatter.matched;

    if (matched) {
      return _objectSpread({}, previousMeta, {}, specifierMetaMap[specifier]);
    }

    return previousMeta;
  }, {});
};

exports.applySpecifierPatternMatching = applySpecifierPatternMatching;
exports.metaMapToSpecifierMetaMap = metaMapToSpecifierMetaMap;
exports.normalizeSpecifierMetaMap = normalizeSpecifierMetaMap;
exports.urlCanContainsMetaMatching = urlCanContainsMetaMatching;
exports.urlToMeta = urlToMeta;
//# sourceMappingURL=main.js.map
