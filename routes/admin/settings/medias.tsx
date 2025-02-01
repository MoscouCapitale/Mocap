import { Handlers, RouteContext } from "$fresh/server.ts";

import { Toast } from "@hooks/toast.tsx";
import { Button, LabeledToolTip, ToasterWrapper } from "@islands/UI";
import { getSettingsInput, settingPostHandler } from "@utils/settings.tsx";

type HandlerType = {
  toast: Toast | null;
};

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const toast = await settingPostHandler(req, "medias");
    return ctx.render({ toast });
  },
};

export default async function MediasSettings(req: Request, ctx: RouteContext) {
  const Input = await getSettingsInput("medias");

  const toast = ctx.data?.toast;

  return (
    <>
      <form className="flex flex-col gap-14 justify-start" method="POST" enctype="multipart/form-data">
        <table className="table-auto border-collapse settings-table">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <LabeledToolTip label="Taille des médias" text="La taille maximale des médias en Mo" />
              </td>
              <td>
                <Input name="media_max_size_mb" />
              </td>
            </tr>
            <tr>
              <td>
                <LabeledToolTip label="Format des médias" text="La taille maximale des images, en hauteur" />
              </td>
              <td>
                <Input name="media_max_size_height" />
              </td>
            </tr>
            {/* <tr>
              <td>
                <LabeledToolTip label="Auto-optimisation" text="Gestion automatique de la qualité (recommandé)" />
              </td>
              <td>
                <Input name="media_auto_optimize" />
              </td>
            </tr> */}
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
