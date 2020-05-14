/**
 * Return array of values that meets conditions of request.
 * All input arrays are sorted in ascending order.
 * @param {Array.<Number>} available
 * @param {Array.<Number|String>} allowed
 * @param {Array.<Number|String>} preferred
 * @return {Array.<Number>}
 */
const attempt = (available, allowed, preferred) => {
  const accessible = intersection(available, allowed)
  if (accessible.length === 0 || accessible.length === 1) return accessible

  const res = new Set()

  if (preferred[0] === 'any') {
    for (const el of accessible) {
      if (el < preferred[1]) {
        res.add(el)
      }
    }
    for (const el of preferred.slice(1)) {
      res.add(closest(el, 0, accessible.length - 1, accessible))
    }
    return [...res]
  }

  if (preferred[preferred.length - 1] === 'any') {
    for (const el of preferred.slice(0, preferred.length - 1)) {
      res.add(closest(el, 0, accessible.length - 1, accessible))
    }
    for (const el of accessible) {
      if (el > preferred[preferred.length - 2]) {
        res.add(el)
      }
    }
    return [...res]
  }

  const anyIndex = preferred.indexOf('any')
  if (anyIndex !== -1) {
    for (const el of preferred.slice(0, anyIndex)) {
      res.add(closest(el, 0, accessible.length - 1, accessible))
    }
    for (const el of accessible) {
      if (el > preferred[anyIndex - 1] && el < preferred[anyIndex + 1]) {
        res.add(el)
      }
    }
    for (const el of preferred.slice(anyIndex + 1)) {
      res.add(closest(el, 0, accessible.length - 1, accessible))
    }
    return [...res]
  }

  for (const el of preferred) {
    res.add(closest(el, 0, accessible.length - 1, accessible))
  }
  return [...res]
}

/**
 * Return intersection of two sorted arrays using binary search.
 * Second array can contain special element 'any' which matches with any (some constraints described below) element
 * from the first array.
 * Assumed if 'any' present array contains at least one more number.
 * If 'any' is first, all numbers from 1-st array smaller then second member of 2-nd array is returned.
 * If 'any' is last, all numbers from 1-st array bigger then penultimate member of 2-nd array is returned.
 * If 'any' between numbers behavior is similar.
 * @param {Array.<Number>} arr - sorted array
 * @param {Array.<Number|String>} arrWithAny - sorted array (may contain 'any')
 * @return {Array.<Number>}
 */
const intersection = (arr, arrWithAny) => {
  const res = []
  if (arrWithAny[0] === 'any') {
    for (const el of arr) {
      if (
        el < arrWithAny[1] ||
        // pass startIndex as 1 to avoid 'any' in binary search
        includes(el, 1, arrWithAny.length - 1, arrWithAny)
      ) {
        res.push(el)
      }
    }
    return res
  }

  if (arrWithAny[arrWithAny.length - 1] === 'any') {
    for (const el of arr) {
      if (
        el > arrWithAny[arrWithAny.length - 2] ||
        // pass endIndex as lenght - 2 to avoid 'any' in binary search
        includes(el, 0, arrWithAny.length - 2, arrWithAny)
      ) {
        res.push(el)
      }
    }
    return res
  }

  const anyIndex = arrWithAny.indexOf('any')
  if (anyIndex !== -1) {
    const arrWithoutAny = [
      ...arrWithAny.slice(0, anyIndex),
      ...arrWithAny.slice(anyIndex + 1)
    ]
    for (const el of arr) {
      if ((el > arrWithAny[anyIndex - 1] && el < arrWithAny[anyIndex + 1]) ||
        includes(el, 0, arrWithoutAny.length - 1, arrWithoutAny)
      ) {
        res.push(el)
      }
    }
    return res
  }

  for (const el of arr) {
    if (includes(el, 0, arrWithAny.length - 1, arrWithAny)) {
      res.push(el)
    }
  }
  return res
}

/**
 * Checks whether the sorted array contains value in given boundaries.
 * Uses binary search.
 * @param {Number} value
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @param {Array<Number>} array - array sorted in ascending order
 * @return {Boolean}
 */
const includes = (value, startIndex, endIndex, array) => {
  if (startIndex > endIndex) {
    return false
  }

  const middleIndex = Math.round((startIndex + endIndex) / 2)
  if (array[middleIndex] === value) {
    return true
  }

  if (array[middleIndex] < value) {
    return includes(value, middleIndex + 1, endIndex, array)
  }

  if (array[middleIndex] > value) {
    return includes(value, startIndex, middleIndex - 1, array)
  }
}

/**
 * Return closest (in fact not always, read below) value to given in the sorted array.
 * First try return value, then try return closest **bigger** value, and then closest smaller.
 * @param {Number} value
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @param {Array.<Number>} array
 * @return {Number}
 */
const closest = (value, startIndex, endIndex, array) => {
  if (value < array[0]) {
    return array[0]
  }

  if (value > array[array.length - 1]) {
    return array[array.length - 1]
  }

  const middleIndex = Math.round((startIndex + endIndex) / 2)
  if (array[middleIndex] === value) {
    return array[middleIndex]
  }

  if (array[middleIndex] < value) {
    if (array[middleIndex + 1] > value) {
      return array[middleIndex + 1]
    }
    return closest(value, middleIndex + 1, endIndex, array)
  }

  if (array[middleIndex] > value) {
    if (array[middleIndex - 1] < value) {
      return array[middleIndex]
    }
    return closest(value, startIndex, middleIndex - 1, array)
  }
}

module.exports = { attempt, closest, intersection, includes }
