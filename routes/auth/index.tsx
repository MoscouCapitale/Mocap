import AuthForm from '@islands/AuthForm.tsx'
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { FormType } from '@models/Authentication.ts'

export const handler: Handlers<FormType> = {
    async GET(req: Request, ctx: FreshContext){
        const url = new URL(req.url);
        const query = url.searchParams;
        const action = query.get("action")
        const email = query.get("email")
        if (action && email) return ctx.render({
            type: 'signup',
            additional_data: email
        })
        return ctx.render({type: 'default'})
    },
    async POST(req: Request, ctx: FreshContext){
        return ctx.render({})
    }
};

export default function AuthPage({data}: PageProps<FormType>){
    return (
        <AuthForm {...data} />
    )
}