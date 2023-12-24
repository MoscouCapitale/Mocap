import supa from "@services/client.ts";
import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async POST(req: Request, _ctx: FreshContext) {
    const body = await req.json();
    const { email, password } = body;
    const { data, error } = await supa.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "http://localhost:8000/",
      },
    });
    if (error) {
      console.log("ERROR:: ",error);
      return new Response(error.message, { status: 400 });
    }
    console.log('data:\n\n', data);
    return new Response(JSON.stringify(data), { status: 200 });
  },
};
