import type { AnyField } from "@/interfaces/form.types";

export const validateName = ({ value }: { value: string }) => (!value ? "Tên là bắt buộc" : undefined);

export const validateEmail = ({ value }: { value: string }) => (!/^\S+@\S+\.\S+$/.test(value) ? "Email không hợp lệ" : undefined);

export const validatePassword = ({ value }: { value: string }) => {
  const errors: string[] = [];

  if (value.length < 8) {
    errors.push("Tối thiểu 8 ký tự");
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("Chứa ít nhất 1 chữ hoa");
  }
  if (!/[a-z]/.test(value)) {
    errors.push("Chứa ít nhất 1 chữ thường");
  }
  if (!/[0-9]/.test(value)) {
    errors.push("Chứa ít nhất 1 số");
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push("Chứa ít nhất 1 ký tự đặc biệt");
  }
  // Có thể mở rộng thêm blacklist/mật khẩu phổ biến

  return errors.length > 0 ? errors.join(", ") : undefined;
};

export const validateConfirmPassword = ({ value, fieldApi }: { value: string; fieldApi: AnyField }) => {
  const password = fieldApi.form.getFieldValue("password");
  return value !== password ? "Mật khẩu không khớp" : undefined;
};
