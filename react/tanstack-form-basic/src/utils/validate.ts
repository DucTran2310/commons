import type { FieldApi } from "@tanstack/react-form";
import type { FormValues } from "../interfaces/form.types";

export const validateName = ({ value }: { value: string }) =>
  !value ? "Tên là bắt buộc" : undefined;

export const validateEmail = ({ value }: { value: string }) =>
  !/^\S+@\S+\.\S+$/.test(value) ? "Email không hợp lệ" : undefined;

export const validatePassword = ({ value }: { value: string }) =>
  value.length < 6 ? "Mật khẩu phải ≥ 6 ký tự" : undefined;

export const validateConfirmPassword = ({
  value,
  fieldApi,
}: {
  value: string;
  fieldApi: FieldApi<FormValues, "confirmPassword", string>;
}) => {
  const password = fieldApi.form.getFieldValue("password");
  return value !== password ? "Mật khẩu không khớp" : undefined;
};
