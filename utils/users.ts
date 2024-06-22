import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { sendEMail } from "@services/emailer.ts";

export const sendUserRequestNotification = async (userId: string) => {
  const { data, error } = await supa.auth.admin.getUserById(userId);

  const badRes = evaluateSupabaseResponse(data, error);
  if (badRes) return badRes;

  const { data: adminEmail } = await supa.from("Website_Settings_Main_Emails")
    .select("email_user_creator(*)");

  const emailData = {
    sender: adminEmail[0].email_user_creator.email_sender,
    recipient: adminEmail[0].email_user_creator.email_recipient,
    userMail: data.user.email,
    userRequestDate: new Date(data.user.created_at).toLocaleString(),
  };

  // TODO: Why is this crashing the app on build ?
  // error: Uncaught (in promise) TimedOut: Une tentative de connexion a échoué car le parti connecté n’a pas répondu convenablement au-delà d’une certaine durée ou une connexion établie a échoué car l’hôte de connexion n’a pas répondu. (os error 10060)
  //     this.conn = await Deno.connect({
  //                 ^
  //   at async Object.connect (ext:deno_net/01_net.js:587:55)
  //   at async SMTPConnection.#connect (https://deno.land/x/denomailer@1.4.0/client/basic/connection.ts:48:19)
  //   at async https://deno.land/x/denomailer@1.4.0/client/basic/client.ts:54:7
  
  // await sendEMail({
  //   from: emailData.sender,
  //   to: emailData.recipient,
  //   subject: "You have a new request",
  //   html: `<p>You have a new request. Please check your account.</p><p>Requester: ${emailData.userMail}</p><p>Request date: ${emailData.userRequestDate}</p>`,
  // });

  console.log(`Send email to ${emailData.recipient} for new request of ${emailData.userMail}`);
};
