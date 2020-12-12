import { assert } from "@jsenv/assert"
import { applyPatternMatching } from "@jsenv/url-meta"

// any file
{
  const pattern = "file:///**/"
  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///.git/dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }
}

// only root files
{
  const pattern = "file:///*"
  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/foo/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }
}

// only files inside directory
{
  const pattern = "file:///*/**"
  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/foo/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }
}

// only files inside directory starting with .
{
  const pattern = "file:///**/.*/*"
  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///.git/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/.git/file.js",
    })
    const expected = true
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///dir/file.js",
    })
    const expected = false
    assert({ actual, expected })
  }

  {
    const { matched: actual } = applyPatternMatching({
      pattern,
      url: "file:///.file.js",
    })
    const expected = false
    assert({ actual, expected })
  }
}
