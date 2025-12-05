import { appConfig } from '@src/configs'
import fs from 'fs'
import path from 'path'
import * as util from 'util'
import Winston from 'winston'

/**
 * @typedef {Object} LogArgHash with message and other properties
 * @property {string} wrap to wrap the log message
 * @property {(Object | number | string)} klass name of the class or constructor
 * @property {(Object | number | string)} message message to log
 * @property {(Object | number | string)} context context of the log
 * @property {(Object | number | string)} metadata extra metadata for the log
 * @property {(Object | number | string)} exception exception for the log
 * @property {(Object | number | string)} fault fault for the log
 */

const logDirectory = 'logs'

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

const winston = Winston.createLogger({
  transports: [
    new Winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error', handleExceptions: true }),
    new Winston.transports.File({ filename: path.join(logDirectory, 'combined.log'), handleExceptions: true }),
    new Winston.transports.Console({ handleExceptions: true })
  ],
  exitOnError: false,
  format: Winston.format.combine(
    Winston.format.colorize(),
    Winston.format.label({ label: appConfig.app.name }),
    Winston.format.timestamp(),
    Winston.format.printf((info) => {
      let msg = `Process: ${process.pid} ${info.timestamp} [${info.label}] ${info.level}: `
      info = typeof info.message === 'object' ? info.message : info

      msg += info.logTitle ? `${info.logTitle} Message: ${info.message || 'No Message'} ` : info.message || 'No Message '
      msg += info.class ? `class: ${typeof info.class === 'object' ? util.inspect(info.class) : info.class} ` : ''
      msg += info.context ? `context: ${typeof info.context === 'object' ? util.inspect(info.context) : info.context} ` : ''
      msg += info.metadata ? `metadata: ${typeof info.metadata === 'object' ? util.inspect(info.metadata) : info.metadata} ` : ''
      msg += info.exceptionBacktrace ? `exceptionBacktrace: ${typeof info.exceptionBacktrace === 'object' ? util.inspect(info.exceptionBacktrace) : info.exceptionBacktrace} ` : ''
      msg += info.fault ? `fault: ${typeof info.fault === 'object' ? util.inspect(info.fault) : info.fault} ` : ''
      return msg
    })
  )
})

/**
 * @param {string} logType type of the Log error, info, debug
 * @param {string} logTitle title of the Log
 * @param {LogArgHash} [argHash={}] object with message and other properties
 * @returns {undefined}
 */
function log (logType, logTitle, argHash = {}) {
  const allArgs = Object.assign({ logTitle }, argHash)
  const logMessage = buildMessage(allArgs)
  writeToLog(logType, logTitle, logMessage, argHash)
}

/**
 * @param {string} logType type of the Log error, info, debug
 * @param {string} logTitle title of the Log
 * @param {(string| object)} logTitle Title of the Log
 * @param {LogArgHash} [argHash={}] object with message and other properties
 * @returns {undefined}
 */
function writeToLog (logType, logTitle, logMessage, argHash = {}) {
  if (argHash && argHash.wrap === 'start') {
    winston[logType](generateWrapStr(logTitle, 'START'))
  } else if (argHash && argHash.wrap === 'end') {
    winston[logType](generateWrapStr(logTitle, 'END'))
  } else {
    winston[logType](logMessage)
  }
}

/**
 * @param {string} logTitle title of the Log
 * @param {string} wrapWord Wrapping word
 * @returns {string}
 */
function generateWrapStr (logTitle, wrapWord) {
  return `${wrapWord}${'='.repeat(15)}${logTitle.toUpperCase()}${'='.repeat(15)}${wrapWord}`
}

/**
 * @param {LogArgHash} logAttrs object with message and other properties
 * @returns {Object}
 */
function buildMessage (logAttrs) {
  const msg = { logTitle: logAttrs.logTitle }
  if (logAttrs.klass) { msg.class = logAttrs.klass.name }
  if (logAttrs.message) { msg.message = logAttrs.message }
  if (logAttrs.context) { msg.context = logAttrs.context }
  if (logAttrs.metadata) { msg.metadata = logAttrs.metadata }
  if (logAttrs.exception) { msg.exceptionBacktrace = logAttrs.exception.stack }
  if (logAttrs.fault) { msg.fault = logAttrs.fault }
  return msg
}

/**
 * @param {string} logTitle
 * @param {LogArgHash} argHash
 */
function info (logTitle, argHash = {}) {
  log('info', logTitle, argHash)
}

/**
 * @param {string} logTitle
 * @param {LogArgHash} argHash
 */
function debug (logTitle, argHash = {}) {
  log('debug', logTitle, argHash)
}

/**
 * @param {string} logTitle
 * @param {LogArgHash} argHash
 */
function error (logTitle, argHash = {}) {
  log('error', logTitle, argHash)
}

export const Logger = {
  info,
  debug,
  error
}
