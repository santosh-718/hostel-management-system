import {
  TextField,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (
    value: string,
  ) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <TextField
      size="small"
      placeholder="Search..."
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value,
        )
      }
      sx={{
        width: 300,
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
            >
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}