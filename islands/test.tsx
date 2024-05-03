import { useToast } from "@hooks/toast.tsx"

export default function TestIsland() {
    const { toast } = useToast()
 
    return (
      <button
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
        }}
      >
        Show Toast
      </button>
    )
  }