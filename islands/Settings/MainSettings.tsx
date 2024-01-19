import { useState } from "preact/hooks";
import { Database } from "@models/database.ts";
import { JSX } from "preact/jsx-runtime";

type Modify<T, R> = Omit<T, keyof R> & R;

type Default_SettingsMain = Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
type SettingsMain = Modify<
  Default_SettingsMain,
  {
    email_contact: {
      recipient: string;
      sender: string;
    };
    email_administrator: {
      recipient: string;
      sender: string;
    };
    email_logging: {
      recipient: string;
      sender: string;
    };
    email_user_creator: {
      recipient: string;
      sender: string;
    };
  }
>;
type SettingsAPIs = Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type Default_SettingsMisc = Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];
type SettingsMisc = Modify<
  Default_SettingsMisc,
  {
    website_language: 'fr' | 'en';
  }>;

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc];

export default function MainSettings(props: { mainSettings: mainSettings }) {
  const [emails, setEmails] = useState(props.mainSettings[0]);
  const [apis, setAPIs] = useState<SettingsAPIs>(props.mainSettings[1]);
  const [misc, setMisc] = useState<SettingsMisc>(props.mainSettings[2]);

  const updateState = (setState: (value: any) => void, key: string, value: string) => {
    setState({
      ...setState,
      [key]: value,
    });
  }

  const testApiButton = (api: string): JSX.Element => {
    return <button onClick={() => testApi(api)}>Test</button>
  }

  const testApi = (api: string) => {
    return
  }

  return (
    <>
      <section>
        <div>
          <div>Envoi mails</div>
          <div>correspondant</div>
          <div>expéditeur</div>
        </div>

        <div>
          <div>Contact</div>
          <div>
            <input value={emails.email_contact.recipient ?? ""}></input>
          </div>
          <div>
            <input value={emails.email_contact.sender ?? ""}></input>
          </div>
        </div>

        <div>
          <div>Administrateur</div>
          <div>
            <input value={emails.email_administrator.recipient ?? ""}></input>
          </div>
          <div>
            <input value={emails.email_administrator.sender ?? ""}></input>
          </div>
        </div>

        <div>
          <div>Logging</div>
          <div>
            <input value={emails.email_logging.recipient ?? ""}></input>
          </div>
          <div>
            <input value={emails.email_logging.sender ?? ""}></input>
          </div>
        </div>

        <div>
          <div>Création utilisateur</div>
          <div>
            <input value={emails.email_user_creator.recipient ?? ""}></input>
          </div>
          <div>
            <input value={emails.email_user_creator.sender ?? ""}></input>
          </div>
        </div>

        <div>
          <div>Adresse mail d'envoi par défaut</div>
          <div>
            <input value={emails.email_default_sender ?? ""}></input>
          </div>
        </div>
      </section>

      <section>
        <p>Clés API</p>
        <div>
          <p>Spotify</p>
          <input value={apis.api_spotify ?? ""}></input>
          <button>Test</button>
        </div>

        <div>
          <p>Soundcloud</p>
          <input value={apis.api_soundcloud ?? ""}></input>
          <button>Test</button>
        </div>

        <div>
          <p>Deezer</p>
          <input value={apis.api_deezer ?? ""}></input>
          <button>Test</button>
        </div>

        <div>
          <p>Youtube Music</p>
          <input value={apis.api_youtube_music ?? ""}></input>
          <button>Test</button>
        </div>
        <div>
          <p>Amazon Music</p>
          <input value={apis.api_amazon_music ?? ""}></input>
          <button>Test</button>
        </div>
        <div>
          <p>Tidal</p>
          <input value={apis.api_tidal ?? ""}></input>
          <button>Test</button>
        </div>
      </section>

      <section>
        <p>Paramètres généraux du site</p>
        <div>
          <p>Titre</p>
          <input value={misc.website_title ?? ""}></input>
        </div>
        <div>
          <p>URL du site</p>
          <input value={misc.website_url ?? ""}></input>
        </div>
        <div>
          <p>Icon</p>
          <input type={'file'} value={misc.website_icone ?? ""}></input>
        </div>
        <div>
          <p>Mot-clés</p>
          <input type={'text'} value={misc.website_keywords ?? ""}></input>
        </div>  
        <div>
          <p>Langue</p>
          <select value={misc.website_language ?? ""}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>
    </>
  );
}
