import LoginForm from "@components/authentication/LoginForm.tsx"

export default function Signin() {

    const submitLoginInfo = (email: string, password: string) => {
    }

    return (
        <LoginForm submitLoginInfo={submitLoginInfo}/>
    )
};