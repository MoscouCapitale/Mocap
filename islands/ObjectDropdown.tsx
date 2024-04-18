import Dropdown from "@islands/Dropdown.tsx";
import { useEffect, useState } from "preact/hooks";
import { ConfirmationModalProps, DropdownItem } from "@models/App.ts";
import { MediaAttributesModifiableAttributes, MediaSettingsAttributes } from "@models/Medias.ts";
import { IconPlus, IconTrash } from "@utils/icons.ts";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import { renderMediaInputs } from "@utils/inputs.tsx";
import Button from "@islands/Button.tsx";
import ConfirmationModal from "@islands/ConfirmationModal.tsx";

type ObjectDropdownProps = {
  table: string;
  currentItem: {
    id: number;
    label?: string;
  };
  changeCurrentItem: (item: any) => void;
};

export default function ObjectDropdown({ table, currentItem, changeCurrentItem }: ObjectDropdownProps) {
  // const [rawItems, setRawItems] = useState<MediaSettingsAttributes[]>();
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>();
  const [itemDetail, setItemDetail] = useState<MediaSettingsAttributes>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<ConfirmationModalProps | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  function createEmptyItem(type: string): MediaSettingsAttributes {
    switch (type) {
      case "cta":
        return {
          id: 0,
          label: "",
          url: "",
        };
      case "controls":
        return {
          id: 0,
          name: "",
          play: false,
          progress: false,
          duration: false,
          volume: false,
        };
      case "object_fit":
        return {
          id: 0,
          value: "best",
        };
      default:
        return {
          id: 0,
          value: "best",
        };
    }
  }

  const convertItemToDropdownItem = (item: MediaSettingsAttributes): DropdownItem => {
    // @ts-ignore - Yes, they does not exist on some types, but this is the whole point : if they do, use them.
    const itemLabel = item.label || item.value || item.name || "default";
    return {
      id: item.id,
      label: (
        <div className="w-full inline-flex items-center justify-between gap-3 ">
          {itemLabel}
          {Object.keys(MediaAttributesModifiableAttributes).includes(table) && (
            <button className="group gap-[3px] inline-flex top-0 right-0 p-2 rounded-bl" onClick={() => setItemDetail(item)}>
              {Array.from({ length: 3 }).map(() => (
                <span className={`block w-2 h-2 rounded-full border-2 border-text group-hover:border-main`} />
              ))}
            </button>
          )}
        </div>
      ),
      // @ts-ignore - Yes, they does not exist on some types, but this is the whole point : if they do, use them.
      value: item.value || item.id,
      isActive: item.id === currentItem.id,
      onClick: () => selectItem(item),
    };
  };

  const selectItem = (item: MediaSettingsAttributes) => {
    changeCurrentItem(item);
  };

  const upsertAttribute = () => {
    setUpdating(true);
    if (itemDetail?.id) {
      fetch(`/api/content/attributes/${table}`, { method: "PUT", body: JSON.stringify(itemDetail) })
        .then((res) => res.json())
        .then((data: MediaSettingsAttributes[]) => {
          setItemDetail(undefined);
          dropdownItems && setDropdownItems(dropdownItems.map((item) => (item.id === data[0].id ? convertItemToDropdownItem(data[0]) : item)));
          selectItem(data[0]);
        });
    }
    setUpdating(false);
  };

  const deleteAttribute = () => {
    setShowConfirmationModal({
      message: "Êtes-vous sûr de vouloir supprimer cet attribut ? Cette action est irréversible.",
      onConfirm: () => {
        itemDetail?.id &&
          fetch(`/api/content/attributes/${table}`, { method: "PUT", body: JSON.stringify(itemDetail) }).then(() => {
            setItemDetail(undefined);
            setDropdownItems(dropdownItems?.filter((item) => item.id !== itemDetail.id));
            selectItem(createEmptyItem(table));
          });
        setShowConfirmationModal(null);
      },
      onCancel: () => {
        setShowConfirmationModal(null);
      },
    });
  };

  useEffect(() => {
    fetch(`/api/content/attributes/${table}`)
      .then((res) => res.json())
      .then((data: MediaSettingsAttributes[]) => {
        // setRawItems(data);
        setDropdownItems(data.map((item) => convertItemToDropdownItem(item)));
      });
  }, []);

  useEffect(() => {
    if (dropdownItems && dropdownItems.find((item) => item.isActive)?.id !== currentItem.id) {
      setDropdownItems(dropdownItems.map((item) => ({ ...item, isActive: item.id === currentItem.id })));
    }
  }, [currentItem]);

  return (
    <>
      {dropdownItems && (
        <Dropdown
          items={dropdownItems}
          additionalItem={
            Object.keys(MediaAttributesModifiableAttributes).includes(table)
              ? {
                  id: 0,
                  label: <IconPlus color="white" />,
                  value: "add",
                  onClick: () => setItemDetail(createEmptyItem(table)),
                }
              : undefined
          }
          activeInDropdown
        />
      )}
      {itemDetail && (
        <InpagePopup closePopup={() => setItemDetail(undefined)}>
          <div class="w-full flex flex-col gap-5">
            {renderMediaInputs(itemDetail, (k, v) => {
              console.log("updating ", k, ' with ', v);
              setItemDetail({ ...itemDetail, [k]: v })})}
            <div class="text-text flex align-center gap-4">
              <Button text={`${updating ? "..." : "Modifier"}`} onClick={upsertAttribute} className={{ wrapper: "grow justify-center" }} />{" "}
              <IconTrash className={"text-error cursor-pointer"} onClick={deleteAttribute} />
            </div>
          </div>
        </InpagePopup>
      )}
      {showConfirmationModal && (
        <ConfirmationModal message={showConfirmationModal.message} onConfirm={showConfirmationModal.onConfirm} onCancel={showConfirmationModal.onCancel} />
      )}
    </>
  );
}
