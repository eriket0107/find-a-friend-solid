import { RabbitMQHandlers } from "@/config/rabbitmq.handlers";
import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672";

export class RabbitMQ {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private async connect(): Promise<Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log("✅ Connected to RabbitMQ");
    }
    return this.channel!;
  }

  async publish(queue: string, message: unknown): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel!.assertQueue(queue, { durable: true });
    this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Message sent to queue "${queue}":`, message);
  }

  async consume(
    queue: string,
    callback: (msg: unknown) => void,
  ): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel!.assertQueue(queue, { durable: true });

    this.channel!.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        this.channel!.ack(msg);
      }
    });

    console.log(`🎧 Listening for messages on "${queue}"`);
  }
  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      console.log("❌ Channel closed");
    }

    if (this.connection) {
      await this.connection.close();
      console.log("❌ Connection closed");
    }
  }

  async startListening(handlers: RabbitMQHandlers[]): Promise<void> {
    console.log("🎧 Starting to listen for messages...");
    for (const { queue, handler } of handlers) {
      await this.consume(queue, (message: unknown) => {
        console.log(`Received message from queue "${queue}":`, message);
        handler(message);
        setTimeout(async () => {
          await this.close();
        }, 5000);
      });

      console.log(`🎧 Listening for messages on "${queue}"`);
    }
  }
}
