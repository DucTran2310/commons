import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchemaStep } from "@/validation/form.validation";
import { z } from "zod";

export type FormValues = z.infer<typeof userSchemaStep>;

export const useUserForm = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(userSchemaStep),
    defaultValues: {
      name: "",
      email: "",
      address: { city: "", street: "" },
      friends: [{ name: "" }],
    },
    mode: "onTouched",
  });

  const fieldArray = useFieldArray({
    control: methods.control,
    name: "friends",
  });

  return { ...methods, ...fieldArray };
};
