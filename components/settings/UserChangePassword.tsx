import { User } from "@models/Authentication.ts";

export default function UserChangePassword(user: User) {
  return (
    <form class="flex-col justify-center items-start gap-5 inline-flex">
      <div class="text-text_grey text-xs ">Changer de mot de passe</div>
      <div class="justify-center items-center gap-10 inline-flex">
        <div class="text-text">Mot de passe actuel</div>
        <input class="w-[200px] bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0" type="password"></input>
      </div>
      <div class="justify-center items-center gap-10 inline-flex">
        <div class="text-text">Nouveau mot de passe</div>
        <input class="w-[200px] bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0" type="password"></input>
      </div>
      <div class="justify-center items-center gap-10 inline-flex">
        <div class="text-text">Confirmer nouveau mot de passe</div>
        <input class="w-[200px] bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0" type="password"></input>
      </div>
      <input class="px-2.5 py-[5px] bg-main rounded text-text font-bold border-2 border-main hover:bg-background transition-colors" type="submit" value="Change de mot de passe"></input>
    </form>
  );
}
