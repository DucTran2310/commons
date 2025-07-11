import { FieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

type InputFieldProps = {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  type?: string;
  placeholder?: string;
  onChangeExtra?: (val: string) => void;
  children?: ReactNode;
};

export default function InputField({ field, label, type = "text", placeholder = "", onChangeExtra, children }: InputFieldProps) {
  const error = field.state.meta.errors[0];

  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(e.target.value);
          onChangeExtra?.(e.target.value);
        }}
        placeholder={placeholder}
        className={`w-full border ${
          error ? "border-red-400" : "border-gray-300"
        } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
      />
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
