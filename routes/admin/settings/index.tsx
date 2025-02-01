import { Handlers, RouteContext } from "$fresh/server.ts";

import { Toast } from "@hooks/toast.tsx";
import { Button, LabeledToolTip, ToasterWrapper } from "@islands/UI";
import { getSettingsInput, settingPostHandler } from "@utils/settings.tsx";

type HandlerType = {
  toast: Toast | null;
};

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const toast = await settingPostHandler(req, "main");
    return ctx.render({ toast });
  },
};

export default async function MainSettings(req: Request, ctx: RouteContext) {
  const Input = await getSettingsInput("main");

  const toast = ctx.data?.toast;

  return (
    <>
      <form className="flex flex-col gap-14 justify-start" method="POST" enctype="multipart/form-data">
        {/* Emails TODO: support it */}
        {/* <table className="table-auto border-collapse w-full settings-table">
        <thead>
          <tr>
            <th className="underline text-left">Email sending</th>
            <th className="text-text_grey text-sm text-left">Recipient</th>
            <th className="text-text_grey text-sm text-left">Sender</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contact</td>
            <td>
              <Input name="email_contact_recipient" />
            </td>
            <td>
              <Input name="email_contact_sender" />
            </td>
          </tr>
          <tr>
            <td>Admin</td>
            <td>
              <Input name="email_admin_recipient" />
            </td>
            <td>
              <Input name="email_admin_sender" />
            </td>
          </tr>
          <tr>
            <td>Logging</td>
            <td>
              <Input name="email_logging_recipient" />
            </td>
            <td>
              <Input name="email_logging_sender" />
            </td>
          </tr>
          <tr>
            <td>User creation</td>
            <td>
              <Input name="email_usercreate_recipient" />
            </td>
            <td>
              <Input name="email_usercreate_sender" />
            </td>
          </tr>
          <tr>
            <td>Default</td>
            <td>
              <Input name="email_default_sender" />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table> */}

        {/* APIs keys  TODO: support it */}
        {/* <table className="table-auto border-collapse settings-table">
        <thead>
          <tr>
            <th className="underline text-left" colSpan={2}>
              API keys
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Spotify</td>
            <td>
              <Input name="api_spotify" />
            </td>
          </tr>
          <tr>
            <td>Soundcloud</td>
            <td>
              <Input name="api_soundcloud" />
            </td>
          </tr>
          <tr>
            <td>Deezer</td>
            <td>
              <Input name="api_deezer" />
            </td>
          </tr>
          <tr>
            <td>YouTube Music</td>
            <td>
              <Input name="api_youtube_music" />
            </td>
          </tr>
          <tr>
            <td>Amazon Music</td>
            <td>
              <Input name="api_amazon_music" />
            </td>
          </tr>
          <tr>
            <td>Tidal</td>
            <td>
              <Input name="api_tidal" />
            </td>
          </tr>
        </tbody>
      </table> */}

        {/* Misc */}
        <table className="table-auto border-collapse settings-table">
          <thead>
            <tr>
              <th className="underline text-left" colSpan={2}>
                Paramètres généraux
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Titre du site</td>
              <td>
                <Input name="website_title" />
              </td>
            </tr>
            <tr>
              <td>
                <LabeledToolTip label="Icône" text="Recommandé PNG, taille x48 (ex 48x48px, 96x96px, 144x144px...)" />
              </td>
              <td>
                <Input name="website_icon" />
              </td>
            </tr>
            <tr>
              <td>
                <LabeledToolTip label="Mot-clés" text="Séparés par des ;" />
              </td>
              <td>
                <Input name="website_keywords" />
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
