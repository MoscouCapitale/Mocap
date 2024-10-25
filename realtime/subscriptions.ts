import { supabase as supa } from "@services/supabase.ts";
import { sendUserRequestNotification } from "@utils/users.ts";

// const channel = supa
//   .channel("users_requests")
//   .on("postgres_changes", {
//     event: "INSERT",
//     schema: "public",
//     table: "Users",
//     // @ts-ignore - Payload does not have a type
//   }, (payload) => {
//     sendUserRequestNotification(payload.new.id)
//   })
//   .subscribe();



export default function declareSubscription() {
  // return channel;
}