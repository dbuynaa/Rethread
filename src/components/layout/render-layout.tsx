import Header from "@/components/layout/header/header";
import Sidebar from "@/components/layout/sidebar/sidebar";

export const RenderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};
