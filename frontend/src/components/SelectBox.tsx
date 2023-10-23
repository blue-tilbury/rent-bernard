import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { SortType } from "../pages/Search";
import { Order, SortBy } from "../types/room.type";

type SelectBoxProps = {
  handleSelect(sortBy: string, order: string, sortType: SortType): void;
  sortType: SortType;
};

export const SelectBox = ({ handleSelect, sortType }: SelectBoxProps) => {
  const handleChange = (e: SelectChangeEvent<typeof sortType>) => {
    const val = e.target.value as SortType;

    switch (val) {
      case "new":
        handleSelect(SortBy.UPDATED_AT, Order.DESC, val);
        break;
      case "old":
        handleSelect(SortBy.UPDATED_AT, Order.ASC, val);
        break;
      case "low":
        handleSelect(SortBy.PRICE, Order.ASC, val);
        break;
      case "high":
        handleSelect(SortBy.PRICE, Order.DESC, val);
        break;
    }
  };

  return (
    <FormControl sx={{ p: 1, minWidth: 192 }} size="small">
      <Select value={sortType} onChange={handleChange}>
        <MenuItem value="new">Posted: newest</MenuItem>
        <MenuItem value="old">Posted: oldest</MenuItem>
        <MenuItem value="low">Price: lowest</MenuItem>
        <MenuItem value="high">Price: highest</MenuItem>
      </Select>
    </FormControl>
  );
};
