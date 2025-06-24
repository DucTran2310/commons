import ContentLayout from "@/layouts/ContentLayout";
import SidebarLayout from "@/layouts/SideBarLayout";

const MainLayout = () => {
  return (
    <div className="flex h-[100vh]">
      <SidebarLayout />
      <ContentLayout />
    </div>
  );
};

export default MainLayout;
