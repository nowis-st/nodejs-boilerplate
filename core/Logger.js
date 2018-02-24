// =============================================================================
// Logger
// @author: Simon Tannai <simon.tannai@keyrus.com> <tannai.simon@gmail.com>
// @license: UNLICENCED
// =============================================================================
const path = require('path')
const winston = require('winston')
const WinstonDailyRotateFile = require('winston-daily-rotate-file')
const fs = require('fs')
const os = require('os')
const cls = require('continuation-local-storage')
const uuidv4 = require('uuid/v4')
const pjson = require(path.join(__dirname, '..', '..', 'package.json'))

const NS_ENUM = {
  NS: 'NS',
  SPAN: 'SPAN',
  REQ_PARAMS: 'REQ_PARAMS',
  REQ_QUERY: 'REQ_QUERY',
  USER_ID: 'USER_ID',
}

const blacklistHeader = [
  'authorization',
  'cookie',
]

class Logger {

  /**
   * Construct logger object
   * @param  {String} filename The name of the logger / file
   * @return {Object}          Returns logger object
   */
  constructor(fileName) {
    /**
     * Winston module
     * @type {Object}
     */
    this.winston = winston

    /**
     * Path to the log folder
     * @type {String}
     */
    this.logPath = path.join(__dirname, '..', 'logs')

    /**
     * File System module
     * @type {Object}
     */
    this.fs = fs

    /**
     * Current Hostname (in swarm )
     * @type String
     */
    this.hostname = os.hostname()

    // If directory does not exists
    if (!this.fs.existsSync(this.logPath)) {
      // Create the directory
      this.fs.mkdirSync(this.logPath)
    }

    this.filename = fileName

    return Object.assign(this.getLogger(), {
      getTransport: this.getTransport,
      getExpressMiddlewareOfTracing: this.getExpressMiddlewareOfTracing,
      getExpressMiddlewareOfApi: this.getExpressMiddlewareOfApi,
      getInNameSpace: this.getInNameSpace,
      getExpressMiddlewareOfRoute: this.getExpressMiddlewareOfRoute,
    })
  }

  /**
   * Get transports configuration object
   * @return {Object}          Returns transports configuration object
   */
  getTransport() {
    let transport = {}

    if (process.env.NODE_ENV !== 'development' || this.filename === 'solr-iods') {
      try {
        transport = new WinstonDailyRotateFile({
          colorize: false,
          timestamp: true,
          datePattern: '-yyyy-MM-dd.log',
          filename: path.join(this.logPath, this.filename),
          maxFiles: 5,
          // 100Mb
          maxsize: 104857600,
          json: true,
          stringify: true,
          prettyPrint: true,
          level: 'debug',
        })
      } catch (e) {
        console.log(e)

        process.exit(1)
      }
    } else {
      transport = new (winston.transports.Console)({
        level: 'debug',
        colorize: true,
        timestamp: true,
        json: false,
        stringify: true,
      })
    }

    return transport
  }

  /**
   * Get logger object
   * @return {Object}          Returns logger object
   */
  getLogger() {
    return new this.winston.Logger({
      level: 'debug',
      transports: [this.getTransport()],
      json: true,
      stringify: true,
      rewriters: [
        (level, msg, meta) => {
          return Object.assign(meta, {
            app: this.filename,
            hostname: this.hostname,
            NODE_ENV: process.env.NODE_ENV,
            reqUuid: this.getInNameSpace(NS_ENUM.SPAN),
            traceId: uuidv4(),
            userId: this.getInNameSpace(NS_ENUM.USER_ID),
            version: pjson.version,
          })
        },
      ],
    })
  }

  /**
  * Get a value stored in the "localThread" (you must be in a Http request to have it)
  * @return {Object}          Returns value
  */
  getInNameSpace(paramName) {
    return cls.getNamespace(NS_ENUM.NS) ? cls.getNamespace(NS_ENUM.NS).get(paramName) : undefined
  }

  /**
   * Get express middleware configuration for tracing all log in a request
   * @return {Object}          Returns express middleware
   */
  getExpressMiddlewareOfTracing() {
    const nsInit = cls.createNamespace(NS_ENUM.NS)
    return (req, res, next) => {
      nsInit.run(() => {
        nsInit.bindEmitter(req)
        nsInit.bindEmitter(res)
        nsInit.set(NS_ENUM.SPAN, uuidv4())
        nsInit.set(NS_ENUM.REQ_PARAMS, req.params)
        next()
      })
    }
  }

  /**
   * Get express middleware configuration for login request object
   * @return {Object}          Returns express middleware
   */
  getExpressMiddlewareOfApi() {
    return (req, res, next) => {
      if (req.url === '/health') {
        return next()
      }

      const header = Object.assign({}, req.headers)
      blacklistHeader.forEach((headerName) => {
        delete header[headerName]
      })

      req._logged_data = {
        app: this.filename,
        hostname: this.hostname,
        NODE_ENV: process.env.NODE_ENV,
        startTime: (new Date()),
        method: req.method,
        url: req.url,
        header,
        reqUuid: this.getInNameSpace(NS_ENUM.SPAN),
      }

      const end = res.end

      res.end = (chunk, encoding) => {
        Object.assign(req._logged_data, {
          responseTime: (new Date()) - req._logged_data.startTime,
          statusCode: res.statusCode,
          reqParams: this.getInNameSpace(NS_ENUM.REQ_PARAMS),
          reqQuery: this.getInNameSpace(NS_ENUM.REQ_QUERY),
          userId: this.getInNameSpace(NS_ENUM.USER_ID),
          version: pjson.version,
        })

        res.end = end

        this.log('info', 'ApiStats', req._logged_data)

        res.end(chunk, encoding)
      }

      next()
    }
  }

  /**
   * Get express middleware configuration for handling url param and query param for log
   * @return {Object}          Returns express middleware
   */
  getExpressMiddlewareOfRoute() {
    const nsInit = cls.getNamespace(NS_ENUM.NS)
    return (req, res, next) => {
      nsInit.set(NS_ENUM.REQ_QUERY, req.query)
      nsInit.set(NS_ENUM.REQ_PARAMS, req.params)
      nsInit.set(NS_ENUM.USER_ID, req.headers.user)
      next()
    }
  }
}

module.exports = Logger
