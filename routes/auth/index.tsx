import AuthForm from "@islands/AuthForm.tsx";
import { FormType, NewUser, UserRole, UserStatus } from "@models/Authentication.ts";
import { authDefine } from "@utils/app.ts";
import { verifyEmailIntegrity } from "@utils/login.ts";
import { ClientResponseError } from "pocketbase";
import { isEmailAvailable } from "@utils/auth.ts";

export const handler = authDefine.handlers({
  // When accessing the /auth route
  GET: (ctx) => {
    const req = ctx.req;
    const params = new URL(req.url).searchParams;

    // Retrieve, from the url, the error code
    const error_code = params.get("error_code");
    const error_message = params.get("error_message");

    if (error_code) {
      return { data: { type: "default", error: { message: error_message } } };
    }

    /** If we just done an action, we display a message. Primarily used for OTP sign up, when you just
     * confirmed your email and are redirected to the sign in page, waiting to be approved by an admin. */
    const actionDone = params.get("action_done");
    if (actionDone) {
      return {
        data: {
          type: "action_done",
          additional_data: {
            message: actionDone,
          },
        },
      };
    }

    // Get the user from the current session
    if (ctx.state.user) return ctx.redirect("/admin/pages", 303);

    // if (error) {
    //   switch (error.status) {
    //     case 403:
    //       return {
    //         data: {
    //           type: "default",
    //           error: { message: "Votre session a expiré, merci de vous ré-authentifier." },
    //         },
    //       };
    //     case 500:
    //     default:
    //       return { data: { type: "default" } };
    //   }
    // }

    // If no error, render the default page (login form)
    return { data: { type: "default" } };
  },
  POST: async (ctx) => {
    const { req, state: { pb } } = ctx;
    const form = await req.formData();
    const url = new URL(req.url);
    const redirectURL = url.searchParams.get("redirect") ?? "/admin/pages";

    const authType = form.get("authtype")?.toString() || "signin";

    const { email, password, confirmpassword } = {
      email: form.get("email")?.toString() || "",
      password: form.get("password")?.toString() || "",
      confirmpassword: form.get("confirmpassword")?.toString() || "",
    };

    if (!email || verifyEmailIntegrity(email) !== "") {
      return { data: { type: "default", error: "Invalid email" } };
    }

    const emailAvailable = await isEmailAvailable(email);

    const returnError = (message: string) => ({
      data: {
        type: authType,
        additional_data: { email },
        error: { message },
      },
    });

    console.log("Authing", {
      authType,
      emailAvailable
    })

    if (authType === "signin" && emailAvailable) {
      const resp = returnError("Cette adresse email n'est pas enregistrée, veuillez vous inscrire.");
      resp.data.type = "signup";
      return resp;
    }

    if (authType === "signup") {
      // Validate infos
      if (!emailAvailable) return returnError("This email is not available");
      if (!password) return returnError("This field must be set");
      if (password !== confirmpassword) return returnError("The password does not match");

      const userObject: NewUser = {
        email,
        password,
        passwordConfirm: confirmpassword,
        // TODO: manage status
        status: UserStatus.RQST,
        role: UserRole.ADMIN,
        // TODO: check following fields
        emailVisibility: true,
        // verified: true, // TODO: use verified or rqst status ? validation_values_mismatch error
      };

      console.log("userObject", userObject);

      try {
        const newUser = await pb.collection("users").create(userObject);
        console.log("newUser");
        console.dir(newUser, { depth: null, color: true });
        if (!newUser.id) throw new Error('internal error');
      } catch (e) {
        if (e instanceof ClientResponseError) {
          console.log(e.response);
          //TODO: frontend check for this & better manage all possible errors
          return returnError("Password must be at least 8 characters");
        }
        return returnError("An unexpected error occured");
      }
    }

    try {
      const { token, record } = await pb.collection("users").authWithPassword(email, password);
      pb.authStore.save(token, record)
      return new Response(null, {
        status: 303,
        headers: {
          "set-cookie": pb.authStore.exportToCookie(),
          location: redirectURL,
        },
      });
    } catch (e) {
      if (e instanceof ClientResponseError) {
        console.error(e.response);
      }
      if (e instanceof ClientResponseError && e.status === 400) return returnError("Email or password is invalid");
      return returnError("An unexpected error occured");
    }

  },
});

export default authDefine.page(({ data }) => {
  return (
    <>
      <AuthForm data={data as FormType} />

      <a className="text-text_grey text-sm absolute bottom-2 right-2 transition-all hover:text-text" href="/auth/resetpassword">
        Mot de passe oublié ?
      </a>
    </>
  );
});
