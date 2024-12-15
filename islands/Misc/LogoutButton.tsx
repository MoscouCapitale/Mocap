import { IconLogout } from "@utils/icons.ts";
import ky from "ky";

export default function LogoutButton() {
  return (
    <IconLogout
      className="text-error hover:cursor-pointer"
      onClick={() => {
        ky.post("/api/auth/logout").then(() => window.location.href = "/");
      }}
    />
  );
}
