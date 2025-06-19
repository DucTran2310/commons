import ContentLayout from './ContentLayout'
import SidebarLayout from './SideBarLayout'

const MainLayout = () => {
  return (
    <div className="flex">
      <SidebarLayout />
      <ContentLayout />
    </div>
  )
}

export default MainLayout