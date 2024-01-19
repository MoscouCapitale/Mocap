export default function ConfirmationModal(props: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className={"fixed z-50 top-0 left-0 w-screen h-screen bg-background bg-opacity-80 flex justify-center items-center"}>
      <div className={"bg-background rounded-[10px] p-10 flex-col justify-center items-center gap-5 inline-flex"}>
        <div className={"text-text text-base"}>{props.message}</div>
        <div className={"w-full flex-row justify-center items-center gap-5 inline-flex"}>
          <button className={"bg-primary rounded-[5px] text-text text-base font-semibold px-5 py-2"} onClick={props.onConfirm}>
            Confirmer
          </button>
          <button className={"bg-background rounded-[5px] text-text text-base font-semibold px-5 py-2"} onClick={props.onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}