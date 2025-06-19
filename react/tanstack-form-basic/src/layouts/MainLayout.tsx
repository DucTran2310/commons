import ContentLayout from "@/layouts/ContentLayout";
import SidebarLayout from "@/layouts/SideBarLayout";

const MainLayout = () => {
  return (
    <div className="flex">
      <SidebarLayout />
      <ContentLayout />
    </div>
  );
};

export default MainLayout;
