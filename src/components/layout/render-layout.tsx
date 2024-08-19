import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import { Header } from './header';
import { Sidebar, SidebarRight } from './sidebar';

export const RenderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60} className="flex">
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden">
          <Header />
          {children}
        </main>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <SidebarRight />
    </ResizablePanelGroup>
  );
};
