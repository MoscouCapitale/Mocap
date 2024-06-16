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
    case 422:
      renderObj.type = "signup";
      renderObj.error.message =
        "Cette adresse email n'est pas enregistrée, veuillez vous inscrire.";
      break;
    case 429:
      renderObj.error.message =
        "Merci d'attendre 60 secondes avant de réessayer de vous connecter.";
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
