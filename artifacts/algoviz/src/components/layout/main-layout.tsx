import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SidebarProvider style={style}>
        <div className="flex h-screen w-full overflow-hidden relative">
          
          {/* Subtle background glow effect */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

          <AppSidebar />
          
          <div className="flex flex-col flex-1 relative z-10 w-full">
            <header className="flex h-14 items-center gap-4 px-4 lg:px-6 border-b border-border/40 bg-background/50 backdrop-blur-md shrink-0">
              <SidebarTrigger data-testid="button-sidebar-toggle" className="text-muted-foreground hover:text-foreground" />
              <div className="flex-1" />
              <div className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Interactive Mode
              </div>
            </header>
            <main className="flex-1 overflow-auto p-4 lg:p-6 w-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
