interface IItemProps {
  type: string;
  name: string;
  icon: string | undefined;
  icon_size: number | undefined;
  icon_mipmaps: number | undefined;
  subgroup: string | undefined;
  order: string | undefined;
  stack_size: number | undefined;
  place_as_tile: ItemAsTile | undefined;
  pictures: [Picture] | undefined;
  fuel_category: string | undefined;
  fuel_value: string | undefined;
}

interface Picture {
  size: number;
  filename: string;
  scale: number;
  mipmap_count: number;
}

export class Item {
  type: string | undefined = undefined;
  name: string | undefined = undefined;
  icon: string | undefined = undefined;
  icon_size: number | undefined = undefined;
  icon_mipmaps: number | undefined = undefined;
  subgroup: string | undefined = undefined;
  order: string | undefined = undefined;
  stack_size: number | undefined = undefined;
  place_as_tile: ItemAsTile | undefined = undefined;
  pictures: [Picture] | [] = [];
  fuel_category: string | undefined = undefined;
  fuel_value: string | undefined = undefined;

  constructor(props: IItemProps) {
    this.type = props.type;
    this.name = props.name;
    this.icon = props.icon;
    this.icon_size = props.icon_size;
    this.icon_mipmaps = props.icon_mipmaps;
    this.subgroup = props.subgroup;
    this.order = props.order;
    this.stack_size = props.stack_size;
    this.fuel_category = props.fuel_category;
    this.fuel_value = props.fuel_value;
  }

  isFuel() {
    return this.fuel_value !== undefined;
  }
}

interface IItemAsTileProps {
  result: string;
  condition_size: number;
  condition: [string];
}

export class ItemAsTile {
  constructor(props: IItemAsTileProps) {}
}
