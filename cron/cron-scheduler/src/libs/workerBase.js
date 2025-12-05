import { Logger } from '@src/libs/logger'
import _ from 'lodash'
import { sequelize } from '@src/database'
/**
 * @class WorkerBase
 * @classdesc Service Base class for creating services for business logic
 * and perform some task and log them properly
 * @hideconstructor
 */
export class WorkerBase {
  #_args = {}
  #_context = {}
  #_errors = {}
  #_success = false
  #_result = null

  constructor () {
    this.#_args = arguments[0]
    this.#_context = arguments[1]
    this.#_errors = {}
    this.#_success = false
    this.#_result = null
    this.#validateServiceInputs()
    this.#_context = sequelize
  }

  /** @type {App.Context} */
  get context () {
    return this.#_context
  }

  /** @type {object} */
  get args () {
    return this.#_args
  }

  /** @type {any} */
  get result () {
    return this.#_result
  }

  /** @type {Array} */
  get errors () {
    return this.#_errors
  }

  /** @type {boolean} */
  get success () {
    return this.#_success
  }

  /** @readonly */
  get log () {
    return {
      info: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor
        Logger.info(logTitle, argHash)
      },
      debug: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor
        Logger.debug(logTitle, argHash)
      },
      error: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor
        Logger.error(logTitle, argHash)
      }
    }
  }

  /**
   *
   *
   * @param {string} attribute
   * @param {*} errorMessage
   * @return {undefined}
   */
  addError (attribute, errorMessage) {
    // check if attribute is in pascal case
    if (attribute !== _.startCase(_.camelCase(attribute)).replace(/ /g, '')) throw new Error(`${attribute} should be pascal cased in addError()`)

    const errors = this.#_errors[this.constructor.name] = this.#_errors[this.constructor.name] || {}
    if (!errors[attribute]) {
      _.extend(errors, { [attribute]: `${_.startCase(attribute)} ${errorMessage}` })
    } else {
      errors[attribute] = errors[attribute] instanceof Array ? errors[attribute] : [errors[attribute]]
      errors[attribute].push(`${_.startCase(attribute)} ${errorMessage}`)
    }
    Logger.debug('Custom Validation Failed', { klass: this.constructor, message: errorMessage, context: { attribute }, userCtx: this.context, fault: this.errors })
  }

  async #tryExecuting () {
    if (_.size(this.errors)) return

    try {
      this.#_result = await this.run()
      this.#_success = !_.size(this.errors)
    } catch (error) {
      Logger.error('Exception raised in Service', { klass: this.constructor, message: error.message, context: this.args, exception: error, userCtx: this.context })
      throw error
    }
  }

  async #validateServiceInputs () {
    const schema = this.constraints
    if (schema) {
      const valid = schema(this.#_args)
      if (!valid) {
        const validationErrors = schema.errors
        const errors = validationErrors.map(error => error.message)
        _.extend(this.errors, { [this.constructor.name]: errors })
        Logger.debug('Service input Validation Failed', { klass: this.constructor, message: 'Validation Failed', context: this.args, userCtx: this.context, fault: this.errors })
      }
    }
  }

  // STATIC METHODS
  /**
   * Throw errors while validation inputs
   */
  static async run () {
    Logger.info(`Service Started: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'start' })
    const args = arguments
    const instance = new this(...args)
    await instance.#tryExecuting()
    if (_.size(instance.errors)) throw instance.errors
    Logger.info(`Service Finished: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'end' })
    return instance.result
  }

  /**
   * Collect errors while validation inputs with a success response, decorate them later
   */
  static async execute () {
    Logger.info(`Service Started: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'start' })
    const args = arguments
    const instance = new this(...args)
    await instance.#tryExecuting()
    Logger.info(`Service Finished: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'end' })
    return instance
  }
}
