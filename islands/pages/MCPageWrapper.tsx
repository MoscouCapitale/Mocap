import CWrapper from "@islands/pages/ContentWrapper.tsx";
import BrickSidebar from "@islands/pages/BrickSidebar.tsx";
import { MNodeProvider } from "@contexts/MNodeContext.tsx";

export default function MCPageWRapper() {
  return (
    <MNodeProvider>
      <div className={"w-full h-full grow flex gap-8"}>
        <CWrapper />
        <BrickSidebar />
      </div>
    </MNodeProvider>
  );
};
