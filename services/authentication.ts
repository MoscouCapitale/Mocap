import { FreshContext } from "$fresh/server.ts";
import { verifyPasswordIntegrity, verifySamePassword } from "@utils/login.ts";
import { handleErrorStatus } from "@services/authErrors.ts";

export const handleSignIn = async (
  // deno-lint-ignore no-explicit-any
  supa: any,
  redirectURL: string | null,
  email: string,
  origin: string,
  res: Response,
  ctx: FreshContext,
): Promise<Response> => {
  const { error } = await supa.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${origin}/auth/callback${
        redirectURL ? `?redirect=${redirectURL}` : ""
      }`,
      shouldCreateUser: false,
    },
  });

  error && console.log("====== signin error: \n\n\n\n", error);
  if (error) return handleErrorStatus({ status: error.status, email, res, ctx });

  const render = await ctx.render({
    type: "default",
    additional_data: {
      message: "Un lien de connexion a été envoyé à votre adresse email",
    },
  });
  return new Response(render.body, {
    headers: res.headers,
  });
};

export const handleSignUp = async (
  // deno-lint-ignore no-explicit-any
  supa: any,
  email: string,
  password: string,
  confirmpassword: string,
  origin: string,
  res: Response,
  ctx: FreshContext,
): Promise<Response> => {
  if (!password || !verifyPasswordIntegrity(password)) {
    const render = await ctx.render({
      type: "signup",
      additional_data: {
        email: email,
        password: password,
      },
      error: {
        message: "This password is not strong enough",
      },
    });
    return new Response(render.body, {
      headers: res.headers,
    });
  }
  if (!confirmpassword || !verifySamePassword(password, confirmpassword)) {
    const render = await ctx.render({
      type: "signup",
      additional_data: {
        email: email,
        password: password,
      },
      error: {
        message: "The passwords do not match",
      },
    });
    return new Response(render.body, {
      headers: res.headers,
    });
  }

  const { error } = await supa.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (!error) {
    const render = await ctx.render({
      type: "action_done",
      additional_data: {
        message: `A confirmation link has been sent to ${email}`,
      },
    });
    return new Response(render.body, {
      headers: res.headers,
    });
  }
  console.log("====== unwanted signup error: \n\n\n\n", error);
  const render = await ctx.render({
    type: "signup",
    additional_data: email,
    error: { message: error.message },
  });
  return new Response(render.body, {
    headers: res.headers,
  });
};
