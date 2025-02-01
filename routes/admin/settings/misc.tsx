import { Handlers, RouteContext } from "$fresh/server.ts";

import { Toast } from "@hooks/toast.tsx";
import { Button, LabeledToolTip, ToasterWrapper } from "@islands/UI";
import { getSettingsInput, settingPostHandler } from "@utils/settings.tsx";

type HandlerType = {
  toast: Toast | null;
};

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const toast = await settingPostHandler(req, "misc");
    return ctx.render({ toast });
  },
};

export default async function MiscSettings(req: Request, ctx: RouteContext) {
  const Input = await getSettingsInput("misc");

  const toast = ctx.data?.toast;

  return (
    <>
      <form className="flex flex-col gap-14 justify-start" method="POST" enctype="multipart/form-data">
        <table className="table-auto border-collapse settings-table">
          <thead></thead>
          <tbody>
            <tr>
              <td>PDF politique de confidentialité</td>
              <td>
                <Input name="terms_file" />
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
