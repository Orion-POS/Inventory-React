import { Search } from "@carbon/icons-react"
import { Input, InputAdornment, TextField, TextFieldProps } from "@mui/material"
import React from "react"

const SearchField: React.FC<TextFieldProps> = () => {

  return (
    <div>
      <TextField variant="outlined" size="small" InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        )
      }} />
    </div>
  )
}

export default SearchField