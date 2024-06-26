import { SMTPClient } from "https://deno.land/x/denomailer@1.4.0/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: Deno.env.get("SMTP_HOST") || "smtp.example.com",
    port: parseInt(Deno.env.get("SMTP_PORT") || "25"),
    tls: false,
    auth: {
      username: Deno.env.get("SMTP_USER") || "user",
      password: Deno.env.get("SMTP_PASS") || "pass",
    },
  },
});

type SendEmailType = {
  from?: string;
  to: string;
  subject: string;
  content?: string;
  html?: string;
};

const sendEMail = async (
  { from, to, subject, content, html }: SendEmailType,
) => {
  const sendEmail = await client.send({
    from: from ?? "noreply@example.com",
    to,
    subject,
    content: "auto",
    html,
  });
  await client.close();
  return sendEmail;
};

export { sendEMail };