import { FreshContext } from "$fresh/server.ts";

type handleErrorStatusProps = {
  status: number;
  code?: string;
  email?: string;
  res: Response;
  ctx: FreshContext;
};

export const handleErrorStatus = async (
  { status, code, email, res, ctx }: handleErrorStatusProps,
): Promise<Response> => {
  const renderObj = {
    type: "default",
    additional_data: {
      email: email,
    },
    error: {
      message: "",
    },
  };

  switch (status) {
    case 400:
      renderObj.error.message = "Les identifiants saisis sont incorrects.";
      break;
    case 422: // otp_disabled AuthApiError: Signups not allowed for otp : You cannot signin with email not saved
      renderObj.type = "signup";
      renderObj.error.message =
        "Cette adresse email n'est pas enregistrée, veuillez vous inscrire.";
      break;
    case 429:
      renderObj.error.message =
        "Merci d'attendre quelques secondes avant de réessayer.";
      break;
    case 500:
    default:
      renderObj.error.message = "Une erreur est survenue, veuillez réessayer plus tard.";
      break;
  }

  const render = await ctx.render(renderObj);
  return new Response(render.body, {
    headers: res.headers,
  });
};
