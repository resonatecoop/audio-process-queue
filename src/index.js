#!/usr/bin/env node

import yargs from 'yargs'
import Queue from 'bull'
import winston from 'winston'
import convertAudioJob from './jobs/convert-audio'
import audioDurationJob from './jobs/audio-duration'

const REDIS_CONFIG = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1',
  password: process.env.REDIS_PASSWORD
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'audio-process-queue' },
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    })
  ]
})

const queueOptions = {
  redis: REDIS_CONFIG
}

yargs // eslint-disable-line
  .command('run [name]', 'starts audio processing queue', (yargs) => {
    yargs
      .positional('name', {
        type: 'string',
        describe: 'queue name',
        default: 'convert-audio'
      })
  }, (argv) => {
    audioQueue(argv.name)
    audioDurationQueue()
  })
  .help()
  .argv

function audioQueue (name) {
  const queue = new Queue(name, queueOptions)

  logger.info(`Redis connection to: ${queueOptions.redis.host}:${queueOptions.redis.port}`)

  queue.process(convertAudioJob)

  logger.info('Queue processing started')

  queue.on('error', (err) => {
    logger.error(err)
  })

  queue.on('failed', (job, err) => {
    logger.error(err)
  })

  queue.on('paused', () => {
    logger.info('job paused')
  })

  queue.on('resumed', (job) => {
    logger.info('job resumed')
  })

  queue.on('cleaned', (jobs, type) => {
    logger.info('job cleaned')
  })

  queue.on('drained', () => {
    logger.info('job drained')
  })

  queue.on('removed', (job) => {
    logger.info('job removed')
  })
}

function audioDurationQueue () {
  const queue = new Queue('audio-duration', queueOptions)

  queue.process(audioDurationJob)

  logger.info('Audio duration queue started')

  queue.on('error', (err) => {
    logger.error(err)
  })

  queue.on('failed', (job, err) => {
    logger.error(err)
  })

  queue.on('paused', () => {
    logger.info('job paused')
  })

  queue.on('resumed', (job) => {
    logger.info('job resumed')
  })

  queue.on('cleaned', (jobs, type) => {
    logger.info('job cleaned')
  })

  queue.on('drained', () => {
    logger.info('job drained')
  })

  queue.on('removed', (job) => {
    logger.info('job removed')
  })
}
