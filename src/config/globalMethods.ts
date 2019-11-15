import Logger from './logger'

export const logger = Logger;

export function sendError(message: string) {
  logger.error(message);
  throw new Error(message);
}