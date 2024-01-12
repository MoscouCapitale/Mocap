import { Database } from "@models/database.ts";
import { Handlers, FreshContext, PageProps } from "$fresh/server.ts";
import { retrieveMain } from "@services/settings.ts";
import MainInputs from "@islands/Settings/MainInputs.tsx";

type SettingsMain = Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
type SettingsAPIs = Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type SettingsMisc = Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc]; 

export const handler: Handlers<mainSettings> = {
  async GET(req: Request, ctx: FreshContext) {
    const mainSettings: mainSettings = await retrieveMain();
    return ctx.render({ mainSettings });
  },
};

export default function Settings({ data }: PageProps<Record<string, mainSettings>>) {
  const { mainSettings } = data;
  return (
    <main className={"flex-col justify-center items-start gap-14 inline-flex"}>
      <MainInputs {...mainSettings} />
    </main>
  )
}
