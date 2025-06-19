import { Outlet } from "react-router-dom";

const ContentLayout = () => {
  return (
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  );
};

export default ContentLayout;
