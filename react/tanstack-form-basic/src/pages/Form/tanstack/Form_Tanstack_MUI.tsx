import FormField from "@/components/Form/FormField";
import { userSchema } from "@/validation/form.validation";
import { Alert, Box, Button, MenuItem, Snackbar, Typography } from "@mui/material";
import { useField, useForm } from "@tanstack/react-form";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";

// Field validator
function useZodFieldValidator(schema: z.ZodTypeAny) {
  const validate = (value: { value: unknown }) => {
    const result = schema.safeParse(value.value);
    return result.success ? undefined : [result.error.issues[0]?.message];
  };
  return useMemo(() => ({ onChange: validate, onBlur: validate }), []);
}

export default function UserProfileForm() {
  const [alert, setAlert] = useState({ open: false, type: "success" as "success" | "error", message: "" });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert({ open: true, type, message });
    timeoutRef.current = setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      country: "",
      address: { street: "", city: "" },
      friends: [{ name: "" }],
    },
    onSubmit: async ({ value }) => {
      showAlert("success", "Gửi thành công ✅");
    },
    onSubmitInvalid: async () => {
      console.log("VVVERROR");
      Object.keys(form.state.values).forEach((key) => {
        form.setFieldMeta(key as any, (old) => ({ ...old, touched: true }));
      });

      // ✅ Thêm đoạn này cho từng bạn
      form.getFieldValue("friends").forEach((_, index) => {
        form.setFieldMeta(`friends[${index}].name`, (old) => ({
          ...old,
          touched: true,
        }));
      });

      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        (firstError as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
      showAlert("error", "Vui lòng kiểm tra lỗi ❌");
    },
  });

  const countryField = useField({ form, name: "country" });
  const friendsField = useField({ form, name: "friends" });
  const country = countryField.state.value;
  const friends = friendsField.state.value;

  // ✅ Đây là phần sửa quan trọng
  const nameValidator = useZodFieldValidator(userSchema.shape.name);
  const emailValidator = useZodFieldValidator(userSchema.shape.email);
  const genderValidator = useZodFieldValidator(userSchema.shape.gender);
  const countryValidator = useZodFieldValidator(userSchema.shape.country);
  const streetValidator = useZodFieldValidator(userSchema.shape.address.shape.street);
  const cityValidator = useZodFieldValidator(userSchema.shape.address.shape.city);
  const friendNameValidator = useZodFieldValidator(userSchema.shape.friends.element.shape.name);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await Promise.all(
            Object.keys(form.state.values).map(
              (key) => form.validateField(key as any, "submit"), // ✅ thêm cause
            ),
          );

          form.validateField("address.street", "submit");
          form.validateField("address.city", "submit");

          // Ép validate từng friend
          form.getFieldValue("friends").forEach((_, index) => {
            form.validateField(`friends[${index}].name`, "submit"); // ✅ thêm cause
          });

          // 👉 3. Gọi handleSubmit để chạy tiếp submit hoặc onSubmitInvalid
          form.handleSubmit();
        }}
        className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-lg space-y-6"
      >
        <Typography variant="h4" align="center" fontWeight="bold">
          Thông Tin Người Dùng
        </Typography>

        <form.Field name="name" validators={nameValidator}>
          {(field) => <FormField field={field} label="Tên" />}
        </form.Field>

        <form.Field name="email" validators={emailValidator}>
          {(field) => <FormField field={field} label="Email" />}
        </form.Field>

        <form.Field name="gender" validators={genderValidator}>
          {(field) => (
            <FormField field={field} label="Giới tính" select>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </FormField>
          )}
        </form.Field>

        <form.Field name="country" validators={countryValidator}>
          {(field) => (
            <FormField field={field} label="Quốc gia" select>
              <MenuItem value="vietnam">Việt Nam</MenuItem>
              <MenuItem value="us">Mỹ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </FormField>
          )}
        </form.Field>

        {country === "vietnam" && (
          <Box className="space-y-4">
            <Typography variant="h6">Địa chỉ</Typography>
            <form.Field name="address.street" validators={streetValidator}>
              {(field) => <FormField field={field} label="Tên đường" />}
            </form.Field>
            <form.Field name="address.city" validators={cityValidator}>
              {(field) => <FormField field={field} label="Thành phố" />}
            </form.Field>
          </Box>
        )}

        <Box className="space-y-2">
          <Typography variant="h6">Danh sách bạn bè</Typography>
          {friends.map((_, index) => (
            <form.Field key={index} name={`friends[${index}].name` as const} validators={friendNameValidator}>
              {(field) => (
                <Box className="flex gap-2 items-center">
                  <FormField field={field} label={`Bạn ${index + 1}`} />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const updated = friends.filter((_, i) => i !== index);
                      form.setFieldValue("friends", updated);
                    }}
                  >
                    Xoá
                  </Button>
                </Box>
              )}
            </form.Field>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const updated = [...form.getFieldValue("friends"), { name: "" }];
              form.setFieldValue("friends", updated);
              const newIndex = updated.length - 1;

              // ✅ Đánh dấu field mới là "touched"
              form.setFieldMeta(`friends[${newIndex}].name`, (prev) => ({
                ...prev,
                touched: true,
              }));
            }}
          >
            + Thêm bạn
          </Button>
        </Box>

        <Button type="submit" variant="contained" fullWidth>
          Gửi Form
        </Button>
      </form>

      <Snackbar open={alert.open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={alert.type} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
