import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "@/validation/form.validation";

export type FormValues = z.infer<typeof formSchema>;

export default function ComplexForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      address: { street: "", city: "" },
      friends: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "friends",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert("Form gửi thành công!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">📋 Thông Tin Người Dùng</h2>

      <div>
        <label className="block font-bold mb-1">Tên</label>
        <input {...register("name")} className="border p-2 w-full" />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-bold mb-1">Tuổi</label>
        <input type="number" {...register("age", { valueAsNumber: true })} className="border p-2 w-full" />
        {errors.age && <p className="text-red-600">{errors.age.message}</p>}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-xl font-semibold">🏠 Địa chỉ</legend>
        <div>
          <label className="block font-bold mb-1">Đường</label>
          <input {...register("address.street")} className="border p-2 w-full" />
          {errors.address?.street && <p className="text-red-600">{errors.address.street.message}</p>}
        </div>
        <div>
          <label className="block font-bold mb-1">Thành phố</label>
          <input {...register("address.city")} className="border p-2 w-full" />
          {errors.address?.city && <p className="text-red-600">{errors.address.city.message}</p>}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xl font-semibold">👯 Bạn bè</legend>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <input {...register(`friends.${index}.name`)} className="border p-2 w-full" placeholder={`Tên bạn ${index + 1}`} />
              {errors.friends?.[index]?.name && <p className="text-red-600 text-sm mt-1">{errors.friends[index]?.name?.message}</p>}
            </div>

            <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded">
              Xoá
            </button>
          </div>
        ))}
        {(errors.friends as any)?.message && <p className="text-red-600">{(errors.friends as any).message}</p>}
        <button type="button" onClick={() => append({ name: "" })} className="bg-blue-500 text-white px-3 py-1 rounded">
          + Thêm bạn
        </button>
      </fieldset>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Gửi
      </button>
    </form>
  );
}
