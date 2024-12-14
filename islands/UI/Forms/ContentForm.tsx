import { Input as BaseInput, Modal } from "@islands/UI";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import AddButton from "@islands/collection/AddButton.tsx";
import { Media, MediaType } from "@models/Medias.ts";

export type ContentFormValue = { [key: FormField["name"]]: FormFieldValue };

type ContentFormProps = {
  form: FormField[];
  initialData: ContentFormValue;
  setDatas?: (value: ContentFormValue) => void;
};

export default function ContentForm({
  form,
  initialData,
  setDatas,
}: ContentFormProps) {
  const [formData, setFormData] = useState<ContentFormValue>(initialData);
  const [openMediaCollectionForField, setOpenMediaCollectionForField] = useState<FormField["name"] | null>(null);

  useEffect(() => setFormData(initialData), [initialData]);

  const getFieldFromName = (name: FormField["name"]) => form.find((f) => f.name === name);

  const getFileTypeFromName = (name: FormField["name"]): [string, MediaType][] => {
    const field = getFieldFromName(name);
    if (Array.isArray(field?.inputConfig?.filetype) && field.inputConfig.filetype.length > 0) {
      return field.inputConfig.filetype.map((f) => [f, f as MediaType]);
    } else {
      return Object.entries(MediaType);
    }
  };

  const onValueChange = useCallback(
    (value: FormFieldValue, name: FormField["name"]) => {
      if (formData && Object.keys(formData).includes(name)) {
        setFormData((prev) => {
          const newVal = {
            ...prev,
            [name]: value,
          };
          if (setDatas) setDatas(newVal);
          return newVal;
        });
      }
    },
    [formData],
  );

  /** Custom dependency trigger for the Input element.
   * 
   * This is a hack with React, in which I can only select a few attributes of a state to create a dependency.
   * Here If the id change (so the form is changing element), or if the media changes (on CollectionGrid select),
   * or simply if the form structure changes.
   */
  const inputDependencies = useMemo(() =>
    JSON.stringify({
      id: formData.id,
      media: formData.media,
      audio: formData.audio,
      keys: Object.keys(formData),
    }), [formData]);

  const Input = useCallback(({ name }: { name: FormField["name"] }) => {
    const field = getFieldFromName(name);
    if (!field || !formData) return <></>;
    if (field.inputConfig?.onClickInput) {
      field.inputConfig.onClickInput = () => setOpenMediaCollectionForField(name);
    }
    let defaultValue = formData[name] ?? "";
    // On a select field (with options), we need to convert the value to string to match the options in the select
    if (field.options && Array.isArray(defaultValue)) defaultValue = defaultValue.map((v: any) => String(v.id));
    return (
      <BaseInput
        field={{
          defaultValue,
          ...field,
        }}
        onChange={(v) => onValueChange(v, field.name)}
      />
    );
  }, [inputDependencies]);

  const mediaClickHandler = useCallback((media: Media) => {
    if (!openMediaCollectionForField) return;
    onValueChange(media, openMediaCollectionForField);
    setOpenMediaCollectionForField(null);
  }, [formData, openMediaCollectionForField]);

  return (
    <>
      {form.map((row, index) => <Input key={index} name={row.name} />)}
      <Modal
        openState={{ isOpen: !!openMediaCollectionForField, setIsOpen: () => setOpenMediaCollectionForField(null) }}
      >
        <div class="w-full overflow-auto min-h-[0] flex-col justify-start items-start gap-10 inline-flex">
          {getFileTypeFromName(openMediaCollectionForField ?? "").map((
            [_, val]: [string, MediaType],
          ) => (
            <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
              <div class="text-text font-bold">{val}</div>
              <CollectionGrid
                onMediaClick={mediaClickHandler}
                fetchingRoute={val as MediaType}
                mediaSize={150}
              />
            </div>
          ))}
          {/* TODO: add support to upload media here. For now nested modals are working properly */}
          <AddButton position="absolute top-3 right-7" />
        </div>
      </Modal>
    </>
  );
}
