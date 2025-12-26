import { Inngest } from "inngest";

// Инициализация Inngest клиента
export const inngest = new Inngest({
  id: "chaletcoaching",
  name: "Chaletcoaching",
  eventKey: process.env.CHALETCOACHING_INNGEST_EVENT_KEY,
});

