import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.text();

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return new Response("Server configuration error", { status: 500 });
    }

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const user = evt.data;

      const clerkUserId = user.id;
      const email = user.email_addresses?.[0]?.email_address ?? null;

      if (!clerkUserId || !email) {
        return new Response(
          JSON.stringify({ success: false, message: "Missing user data" }),
          { status: 400 },
        );
      }

      console.log("Creating user:", clerkUserId, email);

      try {
        const result = await ctx.runMutation(
          api.functions.mutations.createUser,
          {
            clerk_user_id: clerkUserId,
            email,
            role: "user",
            status: "pending",
            name: `${user.first_name} ${user.last_name}` || "New User",
          },
        );

        console.log("User created successfully:", result);
        return new Response(JSON.stringify({ success: true, result }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Failed to create user:", error);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Failed to create user",
            error: error instanceof Error ? error.message : String(error),
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Event processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }),
});

export default http;
