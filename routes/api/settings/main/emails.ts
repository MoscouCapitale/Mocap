import { FreshContext, Handlers } from "$fresh/server.ts";
import { Database } from "@models/database.ts";
import { supabase as sup } from "@services/supabase.ts";

export const handler: Handlers<
  Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"] | []
> = {
  async GET() {
    const res = await sup.from("Website_Settings_Main_Emails").select(`
    *,
    email_administrator:Mail_Pairing!website_settings_email_administrator_fkey (*),
    email_contact:Mail_Pairing!website_settings_email_contact_fkey (*),
    email_logging:Mail_Pairing!website_settings_email_logging_fkey (*),
    email_user_creator:Mail_Pairing!website_settings_email_user_creator_fkey (*)
  `);
    return new Response(JSON.stringify(res.data), {
      headers: { "content-type": "application/json" },
    });
  },

  async PUT(req: Request) {
    const body = await req.json();
    let emails = body.emails;
    const relations = [
      "email_administrator",
      "email_contact",
      "email_logging",
      "email_user_creator",
    ];
    const promises = relations.map(async (relation) => {
      const res = await sup.from("Mail_Pairing")
        .select()
        .eq("email_sender", emails[relation].email_sender)
        .eq("email_recipient", emails[relation].email_recipient);
      if (!res.data || res.data.length === 0) {
        const { id, ...rest } = emails[relation];
        const insert = await sup.from("Mail_Pairing").insert(rest).select();
        emails[relation] = insert.data ? insert.data[0].id : 0;
      } else {
        emails[relation] = res.data[0].id;
      }
    });
    await Promise.all(promises);
    emails = { ...emails, modified_at: new Date().toISOString() };
    const fetchedEmails = await sup.from("Website_Settings_Main_Emails")
      .select()
      .eq("id", emails.id);
    let res;
    if (fetchedEmails.data && fetchedEmails.data.length > 0) { // extrem case, if no data
      res = await sup
        .from("Website_Settings_Main_Emails")
        .update(emails)
        .eq("id", emails.id);
    } else {
      res = await sup
        .from("Website_Settings_Main_Emails")
        .insert(emails)
        .select();
    }
    return new Response(JSON.stringify(res.status === 204 || res.status === 201 ? 200 : 500), {
      headers: { "content-type": "application/json" },
    });
  },
};
