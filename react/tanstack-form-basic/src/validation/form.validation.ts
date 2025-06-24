import { z } from "zod";

// ✅ Zod schema
export const userSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  gender: z.string().nonempty("Chọn giới tính"),
  country: z.string().nonempty("Chọn quốc gia"),
  address: z.object({
    street: z.string().min(2, "Tên đường ít nhất 2 ký tự"),
    city: z.string().min(2, "Tên thành phố ít nhất 2 ký tự"),
  }),
  friends: z.array(
    z.object({
      name: z.string().min(2, "Tên bạn ít nhất 2 ký tự"),
    }),
  ),
});

export const formSchema = z.object({
  name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
  age: z.number().min(1, "Tuổi phải lớn hơn 0").max(100, "Tuổi phải nhỏ hơn 100"),
  address: z.object({
    street: z.string().min(1, "Đường là bắt buộc"),
    city: z.string().min(1, "Thành phố là bắt buộc"),
  }),
  friends: z
    .array(
      z.object({
        name: z.string().min(1, "Tên bạn là bắt buộc"),
      }),
    )
    .min(1, "Phải có ít nhất 1 bạn"),
});

export const userSchemaStep = z.object({
  name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  address: z.object({
    city: z.string().min(1, "Bắt buộc"),
    street: z.string().min(1, "Bắt buộc"),
  }),
  friends: z.array(z.object({ name: z.string().min(1, "Tên bạn là bắt buộc") })).min(1, "Cần ít nhất 1 bạn"),
});
