import supa from '@services/client.ts';
import { FreshContext } from "$fresh/server.ts";

export const handler = (_req: Request, _ctx: FreshContext): Response => {
    console.log("req", _req)
    console.log("ctx", _ctx)
    // const { data, error } = await supa.auth.signUp({
    //     email: 'example@email.com',
    //     password: 'example-password',
    //     options: {
    //       emailRedirectTo: 'https//example.com/welcome'
    //     }
    //   })
};