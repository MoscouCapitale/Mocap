import { Toaster } from "@islands/UI/Toast/Toaster.tsx"
import TestIsland from "@islands/test.tsx";

export default function Test(){
  return (<div>
    <h1>Test page</h1>
    <TestIsland/>
    <Toaster />
  </div>);
};