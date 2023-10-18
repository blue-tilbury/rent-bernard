import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

type SortBy = "new" | "old" | "low" | "high";

export const SelectBox = () => {
  const [sortBy, setSortBy] = useState<SortBy>("new");

  const handleChange = (event: SelectChangeEvent<typeof sortBy>) => {
    setSortBy(event.target.value as SortBy);
    // TODO: call the sort api
  };

  return (
    <div>
      <FormControl sx={{ p: 1, minWidth: 192 }} size="small">
        <Select value={sortBy} onChange={handleChange}>
          <MenuItem value="new">Posted: newest</MenuItem>
          <MenuItem value="old">Posted: oldest</MenuItem>
          <MenuItem value="low">Price: lowest</MenuItem>
          <MenuItem value="high">Price: highest</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
