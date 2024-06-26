"use client"

import { VNode, JSX, Fragment } from "preact";
import { ToastAction } from "@components/UI/Toast/Toast.tsx"
import { Toaster } from "@components/UI/Toast/Toaster.tsx"
import { useToast } from "@hooks/toast.tsx"

function ToastDemoBase() {
  const { toast } = useToast()

  return (
    <button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ) as VNode<typeof ToastAction> & JSX.SignalLike<string|undefined>,
          // <ToastAction />'s type is not VNode<typeof ToastAction> but VNode<any>,
          // and somehow preact requires type SignalLike<string|undefined>. (nikogoli)
        })
      }}
    >
      Add to calendar
    </button>
  )
}


export default function TestIsland(){
  return (
    <Fragment>
      <ToastDemoBase />
      <Toaster />
    </Fragment>
  )
}