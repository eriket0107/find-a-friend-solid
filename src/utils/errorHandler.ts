import { FastifyReply } from 'fastify';
import { logger } from './logger';

export const errorHandler = ({
  error,
  reply,
  code = 400,
  message,
  file,
}: {
  error: unknown
  reply: FastifyReply
  code?: number
  message?: string
  file: string
}) => {
  let errorMessage;

  if (error instanceof Error) {
    errorMessage = message || error.message;
    reply.log.error(error, message);
    console.log('[ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', {
      file,
      error: errorMessage,
    });

    logger(file).error({ message, error, file, code });
    reply.status(code).send({ error: errorMessage });
    throw error;
  } else {
    reply.log.error(error, message);
    console.error('Add some tool to track errors');
  }
};