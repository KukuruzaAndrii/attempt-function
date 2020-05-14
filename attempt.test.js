const { describe, test, expect } = require('@jest/globals')

const { attempt, includes, intersection, closest } = require('./attempt.js')
describe('attempt', () => {
  test('given tests', () => {
    expect(attempt(
      [240, 360, 720],
      [360, 720],
      [1080])).toEqual([720]) // good try :)
    expect(attempt(
      [240, 720],
      [360, 720],
      [1080])).toEqual([720])
    expect(attempt(
      [240],
      [360, 720],
      [1080])).toEqual([])
    expect(attempt(
      [240, 360, 720],
      [240, 360, 720, 1080],
      [240, 360])).toEqual([240, 360])
    expect(attempt(
      [240, 720],
      [240, 360, 720, 1080],
      [240, 360])).toEqual([240, 720])
    expect(attempt(
      [240, 720],
      [240, 360, 1080],
      [240, 360])).toEqual([240])
    expect(attempt(
      [720],
      [240, 360, 1080],
      [240, 360])).toEqual([])
    expect(attempt(
      [240, 360],
      [240, 360],
      [720, 1080])).toEqual([360])
    expect(attempt(
      [240, 360, 720],
      [360, 'any'],
      [360, 720])).toEqual([360, 720])
    expect(attempt(
      [240, 360, 720],
      [240, 360, 720],
      ['any', 720])).toEqual([240, 360, 720])
    expect(attempt(
      [240, 360, 720],
      [360, 1080],
      ['any', 720])).toEqual([360])
    expect(attempt(
      [240, 360, 720],
      [1080],
      ['any', 720])).toEqual([])
  })

  test('my tests - without any', () => {
    expect(attempt(
      [240, 360, 720],
      [240, 360],
      [710])).toEqual([360])
    expect(attempt(
      [240, 360, 720],
      [240, 360, 720],
      [710])).toEqual([720])
    expect(attempt(
      [240, 360, 720],
      [240, 360, 720],
      [730])).toEqual([720])
    expect(attempt(
      [360, 720, 1080],
      [240, 720, 1080],
      [500, 800])).toEqual([720, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [240, 360, 720, 1080],
      [500, 800])).toEqual([720, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [240, 360, 720, 1080],
      [500, 1500])).toEqual([720, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [240, 360, 720, 1080],
      [360, 800])).toEqual([360, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [240, 360, 720, 1080],
      [1200, 1300])).toEqual([1080])
  })

  test('my tests - any at start allowed', () => {
    expect(attempt(
      [240, 360, 720, 1080],
      ['any', 1090],
      [720, 1080])).toEqual([720, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      ['any', 1080],
      [360, 720, 1080])).toEqual([360, 720, 1080])
    expect(attempt(
      [1080],
      ['any', 1080],
      [360, 720, 1080])).toEqual([1080])
  })

  test('my tests - any at end allowed', () => {
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 'any'],
      [720, 1080])).toEqual([720, 1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 'any'],
      [360])).toEqual([360])
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 'any'],
      [360, 720, 1080])).toEqual([360, 720, 1080])
  })

  test('my tests - any in the middle allowed', () => {
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 'any', 2000],
      [720, 1080])).toEqual([720, 1080])
    expect(attempt(
      [240, 360],
      [360, 'any', 2000],
      [720, 1080])).toEqual([360])
    expect(attempt(
      [240, 360, 720, 1444],
      [360, 'any', 1080],
      [720, 1080])).toEqual([720])
  })

  test('my tests - any at start preferred', () => {
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 720],
      ['any', 720])).toEqual([360, 720])
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 460, 1080],
      ['any', 360, 720, 1080])).toEqual([360, 1080])
    expect(attempt(
      [1080, 1444],
      [1080, 1444],
      ['any', 1080])).toEqual([1080])
    expect(attempt(
      [1080, 1444],
      [1080, 1444],
      ['any', 360])).toEqual([1080])
  })

  test('my tests - any at end preferred', () => {
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 1080],
      [720, 'any'])).toEqual([1080])
    expect(attempt(
      [240, 360, 720, 1080],
      [360, 720, 1080],
      [360, 'any'])).toEqual([360, 720, 1080])
    expect(attempt(
      [240, 360, 720, 1080, 1444],
      [360, 1080, 1444],
      [1600, 'any'])).toEqual([1444])
  })

  test('my tests - any in the middle preferred', () => {
    expect(attempt(
      [240, 360, 720, 1080, 1444],
      [360, 720, 1444],
      [360, 'any', 1080])).toEqual([360, 720, 1444])
    expect(attempt(
      [240, 360],
      [240, 360, 2000],
      [360, 'any', 1080])).toEqual([360])
    expect(attempt(
      [240, 360, 720, 1444],
      [240, 360, 1080],
      [720, 'any', 1080])).toEqual([360])
  })
})

test('includes', () => {
  expect(includes(1, 0, 0, [3])).toBeFalsy()
  expect(includes(1, 0, 0, [1])).toBeTruthy()
  expect(includes(1, 0, 1, [1, 2])).toBeTruthy()
  expect(includes(1, 0, 1, [11, 22])).toBeFalsy()
  expect(includes(1, 0, 2, [1, 2, 3])).toBeTruthy()
  expect(includes(3, 0, 2, [1, 2, 3])).toBeTruthy()
  expect(includes(2, 0, 2, [1, 2, 3])).toBeTruthy()
  expect(includes(23, 0, 2, [4, 20, 30])).toBeFalsy()
})

test('intersection', () => {
  expect(intersection([1, 2, 3], [2, 3])).toEqual([2, 3])
  expect(intersection([2, 3], [1, 2, 3])).toEqual([2, 3])
  expect(intersection([1, 20, 30], [4, 20, 23, 30])).toEqual([20, 30])
  expect(intersection([1, 2, 3], [43])).toEqual([])
  expect(intersection([1, 2, 3], [])).toEqual([])
  expect(intersection([], [1, 2, 3])).toEqual([])
  expect(intersection([1, 4, 7, 10, 13], [1, 3, 5, 7, 9])).toEqual([1, 7])
  expect(intersection([240, 360, 720], [360, 'any'])).toEqual([360, 720])
  expect(intersection([240, 360, 720], [240, 360, 'any'])).toEqual([240, 360, 720])
  expect(intersection([240, 360, 720], ['any', 360])).toEqual([240, 360])
  expect(intersection([100, 240, 360, 720], ['any', 720])).toEqual([100, 240, 360, 720])
  expect(intersection([100, 240, 360, 720], ['any', 360])).toEqual([100, 240, 360])
  expect(intersection([240, 360, 720], [350, 'any'])).toEqual([360, 720])
  expect(intersection([240, 360, 720], [240, 370, 'any'])).toEqual([240, 720])
  expect(intersection([240, 360, 720], ['any', 390])).toEqual([240, 360])
  expect(intersection([100, 240, 360, 720], ['any', 710])).toEqual([100, 240, 360])
  expect(intersection([100, 240, 360, 720], ['any', 730])).toEqual([100, 240, 360, 720])
  expect(intersection([100, 240, 360, 720], [100, 'any', 720])).toEqual([100, 240, 360, 720])
  expect(intersection([100, 240, 360, 720], [240, 'any', 730])).toEqual([240, 360, 720])
  expect(intersection([100, 240, 360, 720], [250, 'any', 710])).toEqual([360])
})

test('closest', () => {
  expect(closest(5, 0, 0, [10])).toBe(10)
  expect(closest(5, 0, 0, [5])).toBe(5)
  expect(closest(5, 0, 0, [1])).toBe(1)
  expect(closest(5, 0, 1, [15, 100])).toBe(15)
  expect(closest(5, 0, 1, [1, 100])).toBe(100)
  expect(closest(5, 0, 1, [4, 100])).toBe(100)
  expect(closest(5, 0, 1, [5, 100])).toBe(5)
  expect(closest(5, 0, 1, [1, 5])).toBe(5)
  expect(closest(5, 0, 1, [1, 3])).toBe(3)
  expect(closest(1, 0, 2, [5, 10, 100])).toBe(5)
  expect(closest(5, 0, 2, [5, 10, 100])).toBe(5)
  expect(closest(6, 0, 2, [5, 10, 100])).toBe(10)
  expect(closest(10, 0, 2, [5, 10, 100])).toBe(10)
  expect(closest(11, 0, 2, [5, 10, 100])).toBe(100)
  expect(closest(100, 0, 2, [5, 10, 100])).toBe(100)
  expect(closest(105, 0, 2, [5, 10, 100])).toBe(100)
  expect(closest(105, 0, 2, [25, 100, 1000])).toBe(1000)
  expect(closest(26, 0, 5, [1, 25, 100, 200, 500, 1000])).toBe(100)
})
