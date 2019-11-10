import { assert } from "@dmail/assert"
import { isPlainObject } from "../src/isPlainObject.js"

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
