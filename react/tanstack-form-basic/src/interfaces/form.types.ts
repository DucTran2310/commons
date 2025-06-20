import type { FieldApi } from "@tanstack/react-form";

export type AnyField = FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
export interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}