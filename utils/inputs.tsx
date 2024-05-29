import { JSX } from "preact/jsx-runtime";
import ObjectDropdown from "@islands/ObjectDropdown.tsx";
import { defaultPrivateFields } from "@models/Medias.ts";
import AddMediaZone from "@islands/Misc/AddMediaZone.tsx";
import { DatabaseAttributes, DatabaseAttributesKeys } from "@models/App.ts";

/**
 * Take as input an object, and return all fields as inputs.
 *
 * @param {Record<string, any>} obj - The object to be rendered as inputs.
 * @returns {JSX.Element} The rendered inputs.
 */
export const renderMediaInputs = (
  obj: Record<string, any>,
  onInputChange: (k: any, v: any) => void,
  modifiableAttributes?: Record<string, string>,
  onAddMediaClick?: () => void
): JSX.Element => {
  return (
    <>
      {Object.entries(obj).map(([key, value]) => {
        if (defaultPrivateFields.includes(key)) {
          return null;
        }
        if (!modifiableAttributes) {
          return (
            <div key={key} class="flex flex-col gap-2">
              <label>{key}</label>
              {renderInput(key, value, onInputChange)}
            </div>
          );
        }
        if (Object.keys(modifiableAttributes).includes(key)) {
          if (key === "media")
            return (
              <div key={key} class="flex flex-col gap-2">
                {/* <label>{modifiableAttributes[key as keyof typeof modifiableAttributes]}</label> */}
                <AddMediaZone handleFileUpload={() => onAddMediaClick && onAddMediaClick()} bgImage={value?.public_src || undefined} />
              </div>
            );
          return (
            <div key={key} class="flex flex-col gap-2">
              <label>{modifiableAttributes[key as keyof typeof modifiableAttributes]}</label>
              {renderInput(key, value, onInputChange)}
            </div>
          );
        }
      })}
    </>
  );
};

// TODO: change anys
const renderInput = (key: string, value: any, inputChange: (k: any, v: any) => void): JSX.Element => {
  let inputType = "object";
  switch (typeof value) {
    case "string":
      inputType = "text";
      break;
    case "number":
      inputType = "number";
      break;
    case "boolean":
      inputType = "checkbox";
      break;
  }
  // TODO: should we keep '||'
  if (DatabaseAttributesKeys.includes(key) || inputType === "object") {
    if (DatabaseAttributes[key].multiple || (Array.isArray(value) && typeof value[0] === "object")){
      const validatedValue = Array.isArray(value) ? value : [value]
      return (
        <ObjectDropdown table={key} currentItem={validatedValue.map((val: any) => val.id) || -1} changeCurrentItem={(v) => inputChange(key, v)} allowZero multiInput />
      );}
    return <ObjectDropdown table={key} currentItem={value.id || typeof value === 'number' && value || -1} changeCurrentItem={(v) => inputChange(key, v)} allowZero />;
  }
  return (
    <input
      type={inputType}
      className={`bg-background text-[15px] rounded px-[5px] py-[3px] border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0`}
      value={value}
      checked={typeof value === "boolean" ? value : undefined}
      onChange={(e) => {
        const elVal = typeof value === "boolean" ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;
        inputChange(key, castValue(elVal, typeof value));
      }}
    />
  );
};

const castValue = (value: any, type: string): any => {
  switch (type) {
    case "number":
      return parseInt(value);
    default:
      return value;
  }
};
