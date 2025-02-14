export interface RabbitMQHandlers {
  queue: string;
  handler: (msg: unknown) => void;
}

export const rabbitMQHandlers: RabbitMQHandlers[] = [
  {
    queue: "teste",
    handler: (message: unknown) => {
      console.log("===============> HANDLER", message);
    },
  },
];
