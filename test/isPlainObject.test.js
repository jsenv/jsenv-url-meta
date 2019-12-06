import { assert } from "@jsenv/assert"
import { isPlainObject } from "../src/internal/isPlainObject.js"

{
  const actual = isPlainObject({})
  const expected = true
  assert({ actual, expected })
}

{
  const actual = isPlainObject(null)
  const expected = false
  assert({ actual, expected })
}

{
  const actual = isPlainObject([])
  const expected = false
  assert({ actual, expected })
}

{
  const actual = isPlainObject("whatever")
  const expected = false
  assert({ actual, expected })
}
