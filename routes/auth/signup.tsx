import SignupForm from "@islands/SignupForm.tsx";
import { Handlers } from "$fresh/server.ts";

import {
  verifyEmailIntegrity,
  verifyPasswordIntegrity,
  verifySamePassword,
} from "@utils/login.ts";

type formDatas = {
  email: string;
  password: string;
  confirmpassword: string;
};

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const formData: formDatas = {
      email: form.get("email")?.toString() as string,
      password: form.get("password")?.toString() as string,
      confirmpassword: form.get("confirmpassword")?.toString() as string
    }
    
    if (!formData.email || !verifyEmailIntegrity(formData.email)) return ctx.render();
    if (!formData.password || !verifyPasswordIntegrity(formData.password)) return ctx.render();
    if (!formData.confirmpassword || !verifySamePassword(formData.password, formData.confirmpassword)) return ctx.render();

    let res = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    console.log("res", res);
    return ctx.render({});
  },
};

export default function Signup() {
  return <SignupForm/>;
}
