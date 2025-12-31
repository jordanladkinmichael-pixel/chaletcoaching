import { inngest } from "../client";

// Minimal Hello World function for sanity checks
export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "Hello World" },
  { event: "test/hello.world" },
  async ({ step }) => {
    return await step.run("say-hello", async () => {
      return { message: "Hello from Inngest!" };
    });
  }
);

