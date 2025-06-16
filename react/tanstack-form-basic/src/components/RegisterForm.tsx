import { useForm } from '@tanstack/react-form';
import type { FormValues } from '../interfaces/form.types';
import { validateConfirmPassword, validateEmail, validateName, validatePassword } from '../utils/validate';

export default function RegisterForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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
        const isValid = await form.validate();
        if (!isValid) return;
        await form.handleSubmit();
      }}
      className="max-w-md mx-auto mt-14 p-8 bg-white rounded-2xl shadow-xl space-y-6 border border-gray-200 font-sans"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700">
        Đăng ký tài khoản
      </h2>

      {/* Name Field */}
      <form.Field
        name="name"
        validators={{
          onChange: validateName,
          onBlur: validateName,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label className="block font-medium">Tên</label>
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Nguyễn Văn A"
              className={`w-full border ${
                field.state.meta.errors[0]
                  ? 'border-red-400'
                  : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {field.state.meta.errors[0] && (
              <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onChange: validateEmail,
          onBlur: validateEmail,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="you@example.com"
              className={`w-full border ${
                field.state.meta.errors[0]
                  ? 'border-red-400'
                  : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {field.state.meta.errors[0] && (
              <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password Field */}
      <form.Field
        name="password"
        validators={{
          onChange: validatePassword,
          onBlur: validatePassword,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label className="block font-medium">Mật khẩu</label>
            <input
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="********"
              className={`w-full border ${
                field.state.meta.errors[0]
                  ? 'border-red-400'
                  : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {field.state.meta.errors[0] && (
              <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Confirm Password */}
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: validateConfirmPassword,
          onBlur: validateConfirmPassword,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label className="block font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="********"
              className={`w-full border ${
                field.state.meta.errors[0]
                  ? 'border-red-400'
                  : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {field.state.meta.errors[0] && (
              <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={form.state.isSubmitting}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        {form.state.isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  );
}