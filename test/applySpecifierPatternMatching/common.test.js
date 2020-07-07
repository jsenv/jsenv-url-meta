import { assert } from "@jsenv/assert"
import { applySpecifierPatternMatching } from "../../index.js"

// any file
{
  const specifier = "file:///**/"
  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///.git/dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }
}

// only root files
{
  const specifier = "file:///*"
  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/foo/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }
}

// only files inside directory
{
  const specifier = "file:///*/**"
  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/foo/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }
}

// only files inside directory starting with .
{
  const specifier = "file:///**/.*/*"
  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///.git/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/.git/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///dir/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applySpecifierPatternMatching({
      specifier,
      url: "file:///.file.js",
    })
    const expected = false
    assert({ actual, expected })
  }
}
