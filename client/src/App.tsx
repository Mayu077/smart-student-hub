import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Activities from "@/pages/activities";
import Portfolio from "@/pages/portfolio";
import { GlassmorphismCard } from "@/components/glassmorphism-card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  StickyNote, 
  UserCircle, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun 
} from "lucide-react";
import { Link, useLocation } from "wouter";

function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, current: location === "/" },
    { name: "Courses", href: "/courses", icon: BookOpen, current: location === "/courses" },
    { name: "Schedule", href: "/schedule", icon: Calendar, current: location === "/schedule" },
    { name: "Activities", href: "/activities", icon: ClipboardList, current: location === "/activities" },
    { name: "Notes", href: "/notes", icon: StickyNote, current: location === "/notes" },
    { name: "Portfolio", href: "/portfolio", icon: UserCircle, current: location === "/portfolio" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <aside className="w-64 glassmorphism-strong border-r p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text" data-testid="text-app-title">Smart Student Hub</h1>
          <p className="text-sm text-muted-foreground">Education Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">AJ</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm" data-testid="text-user-name">Alex Johnson</p>
            <p className="text-xs text-muted-foreground" data-testid="text-student-id">ID: 2024CS001</p>
          </div>
        </div>
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          variant="ghost"
          className="w-full justify-center gap-2 glassmorphism hover:bg-sidebar-accent transition-all"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </Button>
      </div>
    </aside>
  );
}

function AppContent() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/activities" component={Activities} />
          <Route path="/portfolio" component={Portfolio} />
          {/* Placeholder routes for other pages */}
          <Route path="/courses">
            <div className="flex items-center justify-center h-full">
              <GlassmorphismCard className="p-8 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Courses</h2>
                <p className="text-muted-foreground">Course management coming soon!</p>
              </GlassmorphismCard>
            </div>
          </Route>
          <Route path="/schedule">
            <div className="flex items-center justify-center h-full">
              <GlassmorphismCard className="p-8 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Schedule</h2>
                <p className="text-muted-foreground">Schedule management coming soon!</p>
              </GlassmorphismCard>
            </div>
          </Route>
          <Route path="/notes">
            <div className="flex items-center justify-center h-full">
              <GlassmorphismCard className="p-8 text-center">
                <StickyNote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Notes</h2>
                <p className="text-muted-foreground">Note taking feature coming soon!</p>
              </GlassmorphismCard>
            </div>
          </Route>
          <Route path="/analytics">
            <div className="flex items-center justify-center h-full">
              <GlassmorphismCard className="p-8 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Analytics</h2>
                <p className="text-muted-foreground">Advanced analytics coming soon!</p>
              </GlassmorphismCard>
            </div>
          </Route>
          <Route path="/settings">
            <div className="flex items-center justify-center h-full">
              <GlassmorphismCard className="p-8 text-center">
                <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon!</p>
              </GlassmorphismCard>
            </div>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
