import { IconDeviceHeartMonitor } from "@utils/icons.ts";

export default function AdminPanelButton() {
  return (
    <a className={`group/main absolute top-3 right-3 w-10 h-10 hidden md:flex items-center justify-center z-50`} href="/admin/pages">
      <IconDeviceHeartMonitor class="text-text opacity-20 group-hover/main:opacity-100 transition-all" size={30} />
    </a>
  );
}
