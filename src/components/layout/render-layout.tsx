import { Header } from "./header";
import { Sidebar, SidebarRight } from "./sidebar";

export const RenderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
      <SidebarRight />
    </div>
  );
};
