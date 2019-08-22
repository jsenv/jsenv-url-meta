import { assert } from "@dmail/assert"
import { urlMatch } from "../../index.js"

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///abc" })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///Za" })
  const expected = {
    matched: false,
    index: 10,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///aZ" })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///ZZa" })
  const expected = {
    matched: false,
    index: 11,
    patternIndex: 10,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///aZZ" })
  const expected = {
    matched: false,
    index: 8,
    patternIndex: 8,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///ZaZ" })
  const expected = {
    matched: true,
    index: 11,
    patternIndex: 11,
  }
  assert({ actual, expected })
}

{
  const actual = urlMatch({ pattern: "file:///*a*", url: "file:///ZZaZZ" })
  const expected = {
    matched: true,
    index: 13,
    patternIndex: 11,
  }
  assert({ actual, expected })
}
