type EmailMatrixType = {
  email_administrator: Email;
  email_contact: Email;
  email_default_sender: string;
  email_logging: Email;
  email_user_creator: Email;
};

type Email = {
  id: number;
  email_recipient: string;
  email_sender: string;
};

export default function EmailMatrix(props: { data: EmailMatrixType }) {
  const data = props.data;
  return (
    <table className={"border-separate border-spacing-x-8 border-spacing-y-2 border-l-0 ml-[-2rem]"}>
      <thead>
        <tr>
          <td className={"underline"}>Envoi mails</td>
          <td className={"text-text_grey"}>Correspondant</td>
          <td className={"text-text_grey"}>Expéditeur</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Contact</td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_contact.email_recipient}
            ></input>
          </td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_contact.email_sender}
            ></input>
          </td>
        </tr>
        <tr>
          <td>Administrateur</td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_administrator.email_recipient}
            ></input>
          </td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_administrator.email_sender}
            ></input>
          </td>
        </tr>
        <tr>
          <td>Création utilisateur</td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_user_creator.email_recipient}
            ></input>
          </td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_user_creator.email_sender}
            ></input>
          </td>
        </tr>
        <tr>
          <td>Logs</td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_logging.email_recipient}
            ></input>
          </td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_logging.email_sender}
            ></input>
          </td>
        </tr>
        <tr>
          <td>Expéditeur par défaut</td>
          <td>
            <input
              className={
                "w-60 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              }
              type={"email"}
              value={data.email_default_sender}
            ></input>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
