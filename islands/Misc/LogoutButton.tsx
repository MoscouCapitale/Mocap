import { IconLogout } from "@utils/icons.ts";

export default function LogoutButton() {
  return (
    <IconLogout
      className="text-error hover:cursor-pointer"
      onClick={() => {
        fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).then((res) => {
          if (res.status == 200) {
            window.location.href = "/";
          }
        });
      }}
    />
  );
}
