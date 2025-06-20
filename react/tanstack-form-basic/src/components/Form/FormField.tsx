import type { AnyField } from '@/interfaces/form.types';
import { TextField } from '@mui/material';
import React from 'react';

const FormField = ({
  field,
  label,
  select,
  children,
}: {
  field: AnyField;
  label: string;
  select?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <TextField
      label={label}
      select={select}
      fullWidth
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.isTouched && !!field.state.meta.errors.length}
      helperText={
        field.state.meta.isTouched && field.state.meta.errors?.[0]
      }
      aria-invalid={field.state.meta.errors.length > 0}
    >
      {select ? children : null}
    </TextField>
  );
}

export default FormField