import { useEffect, useMemo, useState } from "preact/hooks";
import { BricksType } from "@models/Bricks.ts";
import Dropdown from "@islands/Dropdown.tsx";
import CreateBrickBar from "@islands/pages/CreateBrickBar.tsx";
import { DropdownItem } from "@models/App.ts";

type BrickSidebarProps = {};

// Default is the value of the key of BricksType.Single
const defaultBrick = BricksType.Album

function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}

export default function BrickSidebar({}: BrickSidebarProps) {
  const [bricksDDItems, setBricksDDItems] = useState(
    Object.entries(BricksType).map(([key, val]: [string, BricksType]) => {
      return { id: key, value: val, label: val, isActive: val === defaultBrick, onClick: () => onItemClick(val) };
    })
  );
  const [createBrickType, setCreateBrickType] = useState<BricksType>(defaultBrick);
  const [userBricks, setUserBricks] = useState<DropdownItem[]>([]);

  useEffect(() => {
    const savedBricksTable = getKeyByValue(BricksType, createBrickType)
    savedBricksTable && fetch(`/api/brick/getUserBricks/${savedBricksTable}`)
      .then((res) => res.json())
      .then((data) => setUserBricks(data));
  }, [createBrickType]);

  const onItemClick = (val: BricksType) => {
    setCreateBrickType(val);
    setBricksDDItems(
      bricksDDItems.map((brick) => {
        brick.isActive = brick.value === val;
        return brick;
      })
    );
  };

  const onBrickClick = (brick: any) => {
    setUserBricks((prev) => prev.map((b) => ({ ...b, isActive: b.id === brick.id })));
  };

  return (
    <div class="w-[200px] h-full flex-col justify-start items-start gap-6 inline-flex">
      <div class="w-full flex flex-col gap-2">
        <Dropdown items={bricksDDItems} activeInDropdown={true} />
        <Dropdown
          items={userBricks.map((b: any) => ({ id: b.id, label: b.name, value: b.id, onClick: () => onBrickClick(b), isActive: b.isActive }))}
          activeInDropdown={true}
          additionalItem={{ id: "create", label: "Créer une nouvelle brique", value: "create", onClick: () => onBrickClick({ id: null })}}
        />
      </div>
      <CreateBrickBar
        brickType={createBrickType}
        brickData={userBricks.filter((b) => b.isActive)[0] || {id: -1}}
      />
    </div>
  );
}
