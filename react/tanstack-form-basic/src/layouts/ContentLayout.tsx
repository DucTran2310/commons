import { Outlet } from "react-router-dom";

const ContentLayout = () => {
  return (
    <main className="flex-1 flex items-center justify-center p-4 overflow-y-scroll bg-white dark:bg-gray-800 text-black dark:text-gray-100">
      <Outlet />
    </main>
  );
};

export default ContentLayout;
