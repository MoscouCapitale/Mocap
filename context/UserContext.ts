import { useContext, useMemo } from "preact/hooks";
import { createContext, h } from "preact";
import { useSignal } from "@preact/signals";

type Props = {
    children: h.JSX.Element;
};

export const UserContext = createContext<{ user: any }>({ user: {} });

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }: Props){

    const currentUser = useSignal<any>({});
    // const userId = useSignal<string>(""); // Commented out as it's not used

    const value = useMemo( () => ({
        user: currentUser,
    }), [
        currentUser,
    ] );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}