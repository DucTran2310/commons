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
