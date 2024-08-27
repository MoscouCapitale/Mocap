type AddMediaZoneProps = {
  /** File types that are accepted */
  accept?: string;
  /** Whether the zone is an input or a button */
  isInput?: boolean;
  handleFileUpload: (e: Event) => void;
  bgImage?: string;
};

// TODO: use it everywhere
export default function AddMediaZone({ accept, isInput, handleFileUpload, bgImage }: AddMediaZoneProps) {
  return (
    <div className="relative overflow-hidden">
      {isInput ? (
        <input className="opacity-0 cursor-pointer absolute left-0 w-full top-0 bottom-0 z-10" type="file" accept={accept} onChange={handleFileUpload}></input>
      ) : (
        <button className="opacity-0 cursor-pointer absolute left-0 w-full top-0 bottom-0 z-10" onClick={handleFileUpload}></button>
      )}
      <div class="w-[200px] h-[200px] rounded-lg border border-text_grey justify-center items-center gap-2.5 inline-flex z-0">
        {bgImage ? (
          <img src={bgImage} class="w-full h-full object-cover rounded-lg" />
        ) : (
          <>
            <div class="absolute break-all w-[238px] text-text text-opacity-10 text-[127px] z-0 leading-[110px]">media</div>
            <div class="text-center text-text text-2xl">+</div>
          </>
        )}
      </div>
    </div>
  );
}
