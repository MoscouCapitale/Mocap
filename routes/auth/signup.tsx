import SignupForm from "../../components/authentication/SignupForm.tsx";
import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";
import { InputError } from "@models/Form.ts";

type formDatas = {
  email: string;
  password: string;
  confirmpassword: string;
};

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    return ctx.render({ query });
  },

  async POST(req, ctx) {
    const form = await req.formData();

    if (form.get("password")?.toString() !== form.get("confirmpassword")?.toString()) {
        return ctx.render({ error: true, field: "password", message: "Passwords don't match" });
    }

    return await ctx.render();
  },
};

export default function Signup(data?: PageProps<InputError>) {
  return <SignupForm {...data}/>;
}
