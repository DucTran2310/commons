import { Check, X } from "lucide-react";

export const passwordCriteriaList = [
  { label: "Tối thiểu 8 ký tự", test: (v: string) => v.length >= 8 },
  { label: "Chứa chữ hoa", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Chứa chữ thường", test: (v: string) => /[a-z]/.test(v) },
  { label: "Chứa số", test: (v: string) => /[0-9]/.test(v) },
  { label: "Chứa ký tự đặc biệt", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function PasswordCriteria({ password }: { password: string }) {
  return (
    <ul className="space-y-1 text-sm mt-2">
      {passwordCriteriaList.map((item) => {
        const passed = item.test(password);
        return (
          <li key={item.label} className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-red-500"}`}>
            {passed ? <Check size={16} /> : <X size={16} />}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
