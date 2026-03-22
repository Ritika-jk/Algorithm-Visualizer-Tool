import { Link, useLocation } from "wouter";
import { 
  BarChart2, 
  Search, 
  Share2, 
  Layers, 
  Home,
  CheckCircle2,
  SlidersHorizontal,
  Lock
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAlgorithmsWithFallback } from "@/hooks/use-algorithms-data";
import { useLocalProgress } from "@/hooks/use-local-progress";

export function AppSidebar() {
  const [location] = useLocation();
  const { data } = useAlgorithmsWithFallback();
  const { progress } = useLocalProgress();

  const algorithms = data.algorithms || [];
  
  const getIconForCategory = (category: string) => {
    switch(category) {
      case 'sorting': return BarChart2;
      case 'searching': return Search;
      case 'graph': return Share2;
      case 'dsa-pattern': return SlidersHorizontal;
      case 'cipher': return Lock;
      default: return Layers;
    }
  };

  const CATEGORY_LABELS: Record<string, string> = {
    'sorting': 'Sorting',
    'searching': 'Searching',
    'dsa-pattern': 'DSA Patterns',
    'graph': 'Graph',
    'cipher': 'Ciphers & Hashing',
  };

  const categories = Array.from(new Set(algorithms.map(a => a.category)));

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-3 font-display text-xl font-bold text-primary tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            AlgoViz
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/"}>
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {categories.map(category => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="capitalize text-xs font-semibold tracking-wider text-muted-foreground/70">
              {CATEGORY_LABELS[category] || category.replace(/-/g, ' ')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {algorithms.filter(a => a.category === category).map((algo) => {
                  const Icon = getIconForCategory(algo.category);
                  const isActive = location === `/algorithm/${algo.id}`;
                  const isCompleted = progress[algo.id]?.completed;
                  
                  return (
                    <SidebarMenuItem key={algo.id}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={algo.name}>
                        <Link href={`/algorithm/${algo.id}`} className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span>{algo.name}</span>
                          </div>
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
