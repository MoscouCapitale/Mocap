import { FreshContext } from "fresh";
import { verifyPasswordIntegrity, verifySamePassword } from "@utils/login.ts";
import { handleErrorStatus } from "@services/authErrors.ts";
import { setAuthCookie } from "@services/supabase.ts";
import { defaultUserMetadatas, FormResponse, FormType } from "@models/Authentication.ts";

export const handleSignInOTP = async (
  supa: any, //FIXME: SupabaseClient
  redirectURL: string | null,
  email: string,
  origin: string,
): Promise<FormResponse> => {
  const { error } = await supa.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${origin}/auth/callback${redirectURL ? `?redirect=${redirectURL}` : ""}`,
      shouldCreateUser: false,
    },
  });

  error && console.log("====== signin otp error: \n\n", error);
  if (error) return handleErrorStatus({ status: error.status ?? 500, email });

  return {
    data: {
      type: "default",
      additional_data: {
        message: "Un lien de connexion a été envoyé à votre adresse email",
      },
    },
  };
};

export const handleSignInPassword = async (
  supa: any, //FIXME: SupabaseClient
  redirectURL: string | null,
  email: string,
  password: string,
): Promise<FormResponse> => {
  const { data, error } = await supa.auth.signInWithPassword({ email, password });

  error && console.log("====== signin password error: \n\n", error);
  if (error || !data.session) return handleErrorStatus({ status: error?.status ?? 500, email });

  const session = data.session;
  if (session.access_token && session.refresh_token) {
    const user = await supa.auth.getUser(session.access_token);
    if (!user.error) {
      const resp = new Response("", {
        status: 303,
        headers: {
          Location: redirectURL || "/admin/pages",
        },
      });

      setAuthCookie(resp, session.refresh_token, session.access_token);

      return resp;
    }
  }

  return handleErrorStatus({ status: 500, email });
};

export const handleSignUp = async (
  // deno-lint-ignore no-explicit-any
  supa: any,
  email: string,
  password: string,
  confirmpassword: string,
  origin: string,
): Promise<FormResponse> => {
  if (!password || verifyPasswordIntegrity(password)) {
    return {
      data: {
        type: "signup",
        additional_data: {
          email: email,
          password: password,
        },
        error: {
          message: "This password is not strong enough",
        },
      },
    };
  }
  if (!confirmpassword || verifySamePassword(password, confirmpassword)) {
    return {
      data: {
        type: "signup",
        additional_data: {
          email: email,
          password: password,
        },
        error: {
          message: "The passwords do not match",
        },
      },
    };
  }

  /** Signup the user.
   *
   * Additionnaly, create the default metadatas for the user. It will be used to store some values, preferences, etc.
   *
   * Redirects not to callback, because on signup, by default, the user does not log in, he waits for an admin to validate his account.
   */
  const { error } = await supa.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${origin}/auth?action_done=${encodeURIComponent(
        "Merci pour votre inscription ! Un administrateur recevra votre demande sous peu. Vous recevrez un email de confirmation une fois votre compte validé.",
      )}`,
      data: defaultUserMetadatas,
    },
  });

  if (!error) {
    return {
      data: {
        type: "action_done",
        additional_data: {
          message: `Un email de confirmation a été envoyé à ${email}. Vous pouvez fermer cette page.`,
        },
      },
    };
  }

  console.log("====== signup error: \n\n", error);

  return handleErrorStatus({ status: error.status ?? 500, email });
};
