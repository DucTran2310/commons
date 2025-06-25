import { Box, Button, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useUserForm } from "@/hooks/useUserForm";
import StepPreview from "@/components/Form/StepPreview";

const steps = ["Thông tin cơ bản", "Địa chỉ", "Bạn bè", "Xem lại"];

export default function UserFormWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    append,
    remove,
    fields,
    getValues,
    reset,
  } = useUserForm();

  const onSubmit = (data: any) => {
    alert(`🎉 Gửi thành công: ${JSON.stringify(data, null, 2)}`);
    reset();
    setActiveStep(0);
  };

  const handleNext = async () => {
    let valid = false;
    if (activeStep === 0) {
      valid = await trigger(["name", "email"]);
    } else if (activeStep === 1) {
      valid = await trigger(["address.city", "address.street"]);
    } else if (activeStep === 2) {
      valid = await trigger("friends");
    } else {
      valid = true;
    }

    if (valid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <Typography variant="h4" fontWeight="bold">
        📋 Quản lý người dùng
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (activeStep < steps.length - 1) {
            await handleNext();
          } else {
            // Bước cuối mới thực sự submit
            handleSubmit(onSubmit)();
          }
        }}
        className="space-y-6"
      >
        {activeStep === 0 && (
          <Box className="space-y-4">
            <TextField label="Tên" fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
            <TextField label="Email" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
          </Box>
        )}

        {activeStep === 1 && (
          <Box className="space-y-4">
            <TextField
              label="Thành phố"
              fullWidth
              {...register("address.city")}
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message}
            />
            <TextField
              label="Đường"
              fullWidth
              {...register("address.street")}
              error={!!errors.address?.street}
              helperText={errors.address?.street?.message}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box className="space-y-4">
            {fields.map((field, index) => (
              <Box key={field.id} className="flex gap-2 items-center">
                <TextField
                  label={`Tên bạn ${index + 1}`}
                  fullWidth
                  {...register(`friends.${index}.name` as const)}
                  error={!!errors.friends?.[index]?.name}
                  helperText={errors.friends?.[index]?.name?.message}
                />
                <Button color="error" onClick={() => remove(index)}>
                  Xoá
                </Button>
              </Box>
            ))}
            <Button variant="outlined" onClick={() => append({ name: "" })}>
              + Thêm bạn
            </Button>
            {typeof errors.friends?.message === "string" && <Typography className="text-red-600 text-sm">{errors.friends.message}</Typography>}
          </Box>
        )}

        {activeStep === 3 && <StepPreview data={getValues()} />}

        <Box className="flex justify-between mt-6">
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined">
              Quay lại
            </Button>
          )}

          <Button type="submit" variant="contained">
            {activeStep < steps.length - 1 ? "Tiếp tục" : "Gửi Form"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
