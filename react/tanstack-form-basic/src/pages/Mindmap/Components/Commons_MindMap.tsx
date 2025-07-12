// 🔹 Reusable hoverable menu item
export const MenuItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    style={{
      cursor: "pointer",
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    {icon}
    <span>{label}</span>
    {active && (
      <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
    )}
  </div>
);

// 🔹 Simple divider
export const Divider = () => (
  <div style={{ height: "1px", backgroundColor: "#eee", margin: "4px 0" }} />
);

// 🔹 Simple label
export const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginBottom: "4px"
  }}>{children}</label>
);