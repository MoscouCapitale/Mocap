import { Handlers, RouteContext } from "$fresh/server.ts";

import { Toast } from "@hooks/toast.tsx";
import { Button, LabeledToolTip, ToasterWrapper } from "@islands/UI";
import { getSettingsInput, settingPostHandler } from "@utils/settings.tsx";

type HandlerType = {
  toast: Toast | null;
};

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const toast = await settingPostHandler(req, "styles");
    return ctx.render({ toast });
  },
};

export default async function StylesSettings(req: Request, ctx: RouteContext) {
  const Input = await getSettingsInput("styles");

  const toast = ctx.data?.toast;

  return (
    <>
      <form className="flex flex-col gap-14 justify-start" method="POST" enctype="multipart/form-data">
        {/* Colors */}
        <table className="table-auto border-collapse settings-table">
          <thead>
            <tr>
              <th className="underline text-left" colSpan={2}>
                Couleurs
              </th>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
              <td>
                <LabeledToolTip label="Couleurs auto" text="Génère automatique 2 couleurs principales en fonction des briques." />
              </td>
              <td>
                <Input name="style_color_auto" />
              </td>
            </tr> */}
            <tr>
              <td>
                <LabeledToolTip label="Couleur principale" text="Boutons, bordures, soulignage..." />
              </td>
              <td>
                <Input name="style_color_main" />
              </td>
            </tr>
            <tr>
              <td>
                <LabeledToolTip label="Couleur secondaire" text="Textes, liens, fonds..." />
              </td>
              <td>
                <Input name="style_color_secondary" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Fonts */}
        <table className="table-auto border-collapse settings-table">
          <thead>
            <tr>
              <th className="underline text-left" colSpan={2}>
                Polices
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* <p>Main font</p> */}
                <LabeledToolTip label="Police principale" text="Titres, paragraphes..." />
              </td>
              <td>
                <Input name="style_font_main" />
              </td>
            </tr>
            <tr>
              <td>
                <p>Police secondaire</p>
              </td>
              <td>
                <Input name="style_font_secondary" />
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          type="submit"
          className={{
            wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]",
          }}
        >
          Sauvegarder
        </Button>
      </form>
      <ToasterWrapper content={toast} />
    </>
  );
}
