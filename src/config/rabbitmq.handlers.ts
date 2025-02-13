export interface RabbitMQHandlers {
  queue: string;
  handler: (msg: string) => void;
}

export const rabbitMQHandlers: RabbitMQHandlers[] = [];
