import Dropdown from "@islands/Dropdown.tsx";
import { useCallback, useEffect, useState } from "preact/hooks";
import { ConfirmationModalProps, DropdownItem } from "@models/App.ts";
import { MediaSettingsAttributes } from "@models/Medias.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { IconPlus, IconTrash } from "@utils/icons.ts";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import { renderMediaInputs } from "@utils/inputs.tsx";
import Button from "@islands/Button.tsx";
import ConfirmationModal from "@islands/ConfirmationModal.tsx";
import ContextualDots from "@islands/UI/ContextualDots.tsx";

type ObjectDropdownProps = {
  table: string;
  currentItem: number | number[];
  changeCurrentItem: (item: any) => void;
  allowZero?: boolean;
  multiInput?: boolean;
};

export default function ObjectDropdown({ table, currentItem, changeCurrentItem, allowZero, multiInput }: ObjectDropdownProps) {
  // const [rawItems, setRawItems] = useState<MediaSettingsAttributes[]>();
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>();
  // TODO: any because it was tied to medias, it should be universal (media, brick, settings, etc.)
  const [itemDetail, setItemDetail] = useState<any>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<ConfirmationModalProps | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [refetchItems, setRefetchItems] = useState<boolean>(true);

  // TODO: any because it was tied to medias, it should be universal (media, brick, settings, etc.)
  function createEmptyItem(type: string): any {
    switch (type) {
      case "cta":
        return {
          label: "",
          url: "",
        };
      case "controls":
        return {
          name: "",
          play: false,
          progress: false,
          duration: false,
          volume: false,
        };
      case "object_fit":
        return {
          value: "best",
        };
      case "platforms":
        return {
          name: "",
          url: "",
          platform: {},
        };
      case "platform":
        return {
          name: "",
          icon: "",
        };
      case "tracklist":
      case "track":
        return {
          name: "",
          artist: [{}],
          platforms: [{}],
        };
      case "artist":
        return {
          name: "",
          url: "",
        };
      default:
        return {
          value: "best",
        };
    }
  }

  const convertItemToDropdownItem = useCallback((item: MediaSettingsAttributes, multiSelect?: boolean): DropdownItem => {
    // @ts-ignore - Yes, they does not exist on some types, but this is the whole point : if they do, use them.
    const itemLabel = item.label || item.value || item.name || "default";
    return {
      id: item.id,
      label: (
        <div className="w-full inline-flex items-center justify-between gap-3 ">
          {itemLabel}
          {DatabaseAttributes[table]?.modifiable && (
            <ContextualDots onClick={() => setItemDetail(item)} />
          )}
        </div>
      ),
      // @ts-ignore - Yes, they does not exist on some types, but this is the whole point : if they do, use them.
      value: item.value || item.id,
      isActive: Array.isArray(currentItem) ? currentItem.includes(item.id) : item.id === currentItem,
      onClick: () => selectItem(item),
    };
  }, [currentItem]);

  const selectItem = (item: MediaSettingsAttributes) => {
    changeCurrentItem(item);
  };

  const updateItemDetail = (k: any, v: any) => {
    if (!itemDetail) return;
    setItemDetail((prev: any) => {
      const prevVal = (prev as any)[k];
      let newValue = v;
      if (DatabaseAttributes[k]?.multiple) {
        if (prevVal.find((e: any) => e.id === v.id)) newValue = [...prevVal.filter((e: any) => e.id !== v.id)];
        else newValue = [...prevVal.filter((v: any) => v.name), v] || [{}];
      }
      return { ...prev, [k]: newValue };
    });
  };

  const upsertAttribute = () => {
    setUpdating(true);
    Object.keys(itemDetail).forEach(key => {
      if (itemDetail[key] && typeof itemDetail[key] === "object" && itemDetail[key].id) itemDetail[key] = itemDetail[key].id;
    });
    fetch(`/api/content/attributes/${table}`, { method: "PUT", body: JSON.stringify(itemDetail) })
      .finally(() => {
        setUpdating(false);
        setRefetchItems(true);
      });
  };

  const deleteAttribute = () => {
    setShowConfirmationModal({
      message: "Êtes-vous sûr de vouloir supprimer cet attribut ? Cette action est irréversible.",
      onConfirm: () => {
        itemDetail?.id &&
          fetch(`/api/content/attributes/${table}`, { method: "DELETE", body: JSON.stringify(itemDetail) })
            .then(() => {
              setItemDetail(undefined);
              setDropdownItems(dropdownItems?.filter((item) => item.id !== itemDetail.id));
              selectItem(createEmptyItem(table));
            })
            .finally(() => setRefetchItems(true));
        setShowConfirmationModal(null);
      },
      onCancel: () => {
        setShowConfirmationModal(null);
      },
    });
  };

  useEffect(() => {
    if (refetchItems) {
      fetch(`/api/content/attributes/${table}`)
        .then((res) => (res.status !== 204 ? res.json() : []))
        .then((data: MediaSettingsAttributes[]) => {
          setDropdownItems(data.map((item) => convertItemToDropdownItem(item)));
        })
        .finally(() => setRefetchItems(false));
    }
  }, [refetchItems]);

  useEffect(() => {
    if (Array.isArray(currentItem)) {
      // @ts-ignore - Is is a number[], so it IS an array of numbers
      setDropdownItems(dropdownItems?.map((item) => ({ ...item, isActive: currentItem.includes(item.id) })));
    } else {
      if (dropdownItems && dropdownItems.find((item) => item.isActive)?.id !== currentItem) {
        setDropdownItems(dropdownItems.map((item) => ({ ...item, isActive: item.id === currentItem })));
      }
    }
  }, [currentItem]);

  return (
    <>
      {(allowZero || dropdownItems) && (
        <Dropdown
          items={dropdownItems || []}
          additionalItem={
            DatabaseAttributes[table]?.modifiable
              ? {
                  id: 0,
                  label: <IconPlus color="white" />,
                  value: "add",
                  onClick: () => setItemDetail(createEmptyItem(table)),
                }
              : undefined
          }
          activeInDropdown
          multiSelect={Array.isArray(currentItem)}
        />
      )}
      {itemDetail && (
        <InpagePopup isOpen={itemDetail} closePopup={() => setItemDetail(undefined)}>
          <div class="w-full flex flex-col gap-5">
            {renderMediaInputs(itemDetail, updateItemDetail)}
            <div class="text-text flex align-center gap-4">
              <Button
                text={`${updating ? "Enregistrement..." : `${itemDetail.id ? "Modifier" : "Créer"}`}`}
                onClick={upsertAttribute}
                className={{ wrapper: "grow justify-center" }}
              />{" "}
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
