import ContentLayout from "@/layouts/ContentLayout";
import SidebarLayout from "@/layouts/SideBarLayout";

const MainLayout = () => {
  return (
    <div className="flex h-[100vh] dark:bg-gray-800 dark:text-gray-100">
      <SidebarLayout />
      <ContentLayout />
    </div>
  );
};

export default MainLayout;
