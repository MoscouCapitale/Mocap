import { useEffect, useState } from "preact/hooks";
import { User } from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";

export default function RequestButton(props: { user: any; text: string; accept: boolean }) {
  const { user, text, accept } = props;

  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    const res = await fetch("/admin/requests", {
      method: accept ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    setLoading(false);
  };

  return (
    <div class={`px-2.5 py-[5px] ${accept ? "bg-success" : "bg-error"} rounded-[5px] flex-col justify-center items-start gap-2 inline-flex`}>
      <button onClick={handleRequest} class={`text-text text-base font-semibold`}>
        {loading ? <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-text_grey"></div> : text}
      </button>
    </div>
  );
}
