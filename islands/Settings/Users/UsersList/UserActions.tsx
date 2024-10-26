import { User, UserStatus } from "@models/Authentication.ts";

type ConfirmationModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type UserActionsProps = {
  user: User;
  onChangeStatus: (status: UserStatus) => void;
};

export default function UserActions({
  user,
  onChangeStatus,
}: UserActionsProps) {
  return (
    <>
      <div
        className={"p-[15px] bg-black rounded-[10px] border border-text_grey bg-background flex-col justify-center items-start gap-[15px] inline-flex "}
      >
        <div class="px-2.5 py-1.5 bg-warning rounded-[10px] justify-center items-center gap-2.5 inline-flex">
          {user.user_metadata.status === UserStatus.ACTV && (
            <button
              class="text-text font-semibold"
              onClick={() => {
                if (
                  globalThis.confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur ?")
                ) {
                  onChangeStatus(UserStatus.BLCK);
                }
              }}
            >
              Bloquer l&apos;utilisateur
            </button>
          )}
          {user.user_metadata.status === UserStatus.BLCK && (
            <button
              class="text-text font-semibold"
              onClick={() => {
                if (
                  globalThis.confirm("Êtes-vous sûr de vouloir débloquer cet utilisateur ?")
                ) {
                  onChangeStatus(UserStatus.ACTV);
                }
              }}
            >
              D&eacute;bloquer l&apos;utilisateur
            </button>
          )}
        </div>
        <div class="px-2.5 py-1.5 bg-error rounded-[10px] justify-center items-center gap-2.5 inline-flex">
          {/* add confirmation modal on click */}
          <button
            class="text-text font-semibold"
            onClick={() => {
              if (
                globalThis.confirm("Êtes-vous sûr de vouloir révoquer cet utilisateur ? Cette action est irréversible.")
              ) {
                onChangeStatus(UserStatus.BANN);
              }
            }}
          >
            Révoquer l&apos;utilisateur
          </button>
        </div>
      </div>
    </>
  );
}
