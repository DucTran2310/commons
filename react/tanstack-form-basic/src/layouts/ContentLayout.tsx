import { Outlet } from "react-router-dom";

const ContentLayout = () => {
  return (
    <main className="flex-1 p-4 overflow-y-scroll">
      <Outlet />
    </main>
  );
};

export default ContentLayout;
