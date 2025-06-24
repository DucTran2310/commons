import InputField from "@/components/Form/InputField";
import PasswordCriteria from "@/components/Form/PasswordCriteria";
import { validateConfirmPassword, validateEmail, validateName, validatePassword } from "@/utils/validate";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

export default function RegisterForm() {
  const [passwordPreview, setPasswordPreview] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 1000));
      alert(`✅ Đăng ký thành công cho ${value.name}`);
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const isValid = await form.validate("submit");
        if (!isValid) {
          return;
        }
        await form.handleSubmit();
      }}
      className="max-w-md mx-auto mt-14 p-8 bg-white rounded-2xl shadow-xl space-y-6 border border-gray-200 font-sans"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700">Đăng ký tài khoản</h2>

      {/* Name Field */}
      <form.Field name="name" validators={{ onChange: validateName, onBlur: validateName }}>
        {(field) => <InputField field={field} label="Tên" placeholder="Nguyễn Văn A" />}
      </form.Field>

      <form.Field name="email" validators={{ onChange: validateEmail, onBlur: validateEmail }}>
        {(field) => <InputField field={field} label="Email" type="email" placeholder="you@example.com" />}
      </form.Field>

      <form.Field name="password" validators={{ onChange: validatePassword, onBlur: validatePassword }}>
        {(field) => (
          <InputField field={field} label="Mật khẩu" type="password" placeholder="********" onChangeExtra={setPasswordPreview}>
            <PasswordCriteria password={passwordPreview} />
          </InputField>
        )}
      </form.Field>

      <form.Field name="confirmPassword" validators={{ onChange: validateConfirmPassword, onBlur: validateConfirmPassword }}>
        {(field) => <InputField field={field} label="Xác nhận mật khẩu" type="password" placeholder="********" />}
      </form.Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={form.state.isSubmitting}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        {form.state.isSubmitting ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </form>
  );
}
