import np from 'number-precision'
np.enableBoundaryChecking(false)

export class NumberPrecision {
  static #precision = 2

  static round (number) {
    return np.round(number, this.#precision)
  }

  static plus () {
    return this.round(np.plus(...arguments))
  }

  static divide () {
    return this.round(np.divide(...arguments))
  }

  static minus () {
    return this.round(np.minus(...arguments))
  }

  static times () {
    return this.round(np.times(...arguments))
  }
}
