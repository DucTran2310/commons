import type { FormValues } from "@/hooks/useUserForm";
import { Box, Typography } from "@mui/material";

export default function StepPreview({ data }: { data: FormValues }) {
  return (
    <Box className="space-y-4">
      <Typography variant="h6">👤 Thông tin cơ bản</Typography>
      <p><strong>Tên:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>

      <Typography variant="h6">🏠 Địa chỉ</Typography>
      <p><strong>Thành phố:</strong> {data.address.city}</p>
      <p><strong>Đường:</strong> {data.address.street}</p>

      <Typography variant="h6">👯 Bạn bè</Typography>
      {data.friends.map((friend, idx) => (
        <p key={idx}>• {friend.name}</p>
      ))}
    </Box>
  );
}