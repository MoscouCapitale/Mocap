export default function UserRevokeAccount() {
  return (
    <form
      class="min-w-[300px] flex-col justify-center items-start gap-[5px] inline-flex"
      onSubmit={() => confirm("Êtes-vous sûr de vouloir révoquer votre compte ? C`ette action est irréversible.")}
      method="POST"
    >
      <input type="hidden" name="action" value="revoke" />
      <div class="text-text_grey text-xs font-normal">Danger zone</div>
      <div class="w-full p-2.5 rounded-[5px] border-dashed border border-error flex-col justify-center items-start gap-2.5 flex">
        <input
          class="px-2.5 py-[5px] bg-error rounded-[3px] justify-start items-center gap-2.5 inline-flex"
          value={"Révoquer le compte"}
          type="submit"
        />
      </div>
    </form>
  );
}
