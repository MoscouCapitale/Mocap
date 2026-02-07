import { Toaster } from "@components/UI/Toast/Toaster.tsx";
import { MNodeProvider } from "@contexts/MNodeContext.tsx";
import BrickSidebar from "./BrickSidebar.tsx";
import MCanva from "./ContentWrapper.tsx";

export default function MCPageWRapper() {
  return (
    <MNodeProvider>
      <>
        <div className="w-full h-full grow flex gap-8">
          <MCanva />
          <BrickSidebar />
        </div>
        <Toaster />
      </>
    </MNodeProvider>
  );
}
