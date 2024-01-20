import ConfirmationModal from "@islands/ConfirmationModal.tsx";
import { useState } from "preact/hooks";
import { UserAdminActions } from "@models/User.ts";

type ConfirmationModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function UserActions(props: { user: any; onBlockUnblock: (action: UserAdminActions) => void; onRevoke: () => void }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState<ConfirmationModalProps | null>(null);
  return (
    <>
      <div
        className={
          "absolute top-[200%] p-[15px] bg-neutral-950 rounded-[10px] z-50 border border-text_grey bg-background flex-col justify-center items-start gap-[15px] inline-flex "
        }
      >
        <div class="px-2.5 py-1.5 bg-warning rounded-[10px] justify-center items-center gap-2.5 inline-flex">
          {props.user.user_metadata.is_authorised && (
            <button
              class="text-text font-semibold"
              onClick={() =>
                setShowConfirmationModal({
                  message: "Êtes-vous sûr de vouloir bloquer cet utilisateur ?",
                  onConfirm: () => {
                    props.onBlockUnblock("block");
                    setShowConfirmationModal(null);
                  },
                  onCancel: () => {
                    setShowConfirmationModal(null);
                  },
                })
              }
            >
              Bloquer l&apos;utilisateur
            </button>
          )}
          {!props.user.user_metadata.is_authorised && (
            <button
              class="text-text font-semibold"
              onClick={() =>
                setShowConfirmationModal({
                  message: "Êtes-vous sûr de vouloir débloquer cet utilisateur ?",
                  onConfirm: () => {
                    props.onBlockUnblock("unblock");
                    setShowConfirmationModal(null);
                  },
                  onCancel: () => {
                    setShowConfirmationModal(null);
                  },
                })
              }
            >
              D&eacute;bloquer l&apos;utilisateur
            </button>
          )}
        </div>
        <div class="px-2.5 py-1.5 bg-error rounded-[10px] justify-center items-center gap-2.5 inline-flex">
          {/* add confirmation modal on click */}
          <button
            class="text-text font-semibold"
            onClick={() =>
              setShowConfirmationModal({
                message: "Êtes-vous sûr de vouloir révoquer cet utilisateur ? \nCette action est irréversible !",
                onConfirm: () => {
                  props.onRevoke();
                  setShowConfirmationModal(null);
                },
                onCancel: () => {
                  setShowConfirmationModal(null);
                },
              })
            }
          >
            Révoquer l&apos;utilisateur
          </button>
        </div>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal message={showConfirmationModal.message} onConfirm={showConfirmationModal.onConfirm} onCancel={showConfirmationModal.onCancel} />
      )}
    </>
  );
}
