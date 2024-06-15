import { useEffect, useRef } from "preact/hooks"

export default function useRenderCount() {
    const count = useRef<number>(1)
    useEffect(() => {
        count.current++})
    return count.current
}