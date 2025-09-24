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
import Courses from "@/pages/courses";
import Schedule from "@/pages/schedule";
import Notes from "@/pages/notes";
import Analytics from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/login";
import FacultyDashboard from "@/pages/faculty-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
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
  Settings as SettingsIcon, 
  Moon, 
  Sun 
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, current: location === "/" },
    { name: "Courses", href: "/courses", icon: BookOpen, current: location === "/courses" },
    { name: "Schedule", href: "/schedule", icon: Calendar, current: location === "/schedule" },
    { name: "Activities", href: "/activities", icon: ClipboardList, current: location === "/activities" },
    { name: "Notes", href: "/notes", icon: StickyNote, current: location === "/notes" },
    { name: "Portfolio", href: "/portfolio", icon: UserCircle, current: location === "/portfolio" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Settings", href: "/settings", icon: SettingsIcon, current: location === "/settings" },

  ];

  return (
    <aside className="w-64 glassmorphism-strong border-r border-border/50 p-6 flex flex-col min-h-screen">
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
            <span className="text-sm font-bold text-white">
              {user ? user.name.split(' ').map((n: string) => n[0]).join('') : 'AJ'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm" data-testid="text-user-name">
              {user ? user.name : 'Alex Johnson'}
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-student-id">
              ID: {user ? user.id : '2024CS001'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          variant="ghost"
          className="w-full justify-start gap-2 glassmorphism hover:bg-sidebar-accent transition-all"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </Button>
      </div>
    </aside>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setLocation("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
function AppContent() {
  const [location] = useLocation();

  // Public routes that don't require authentication
  if (location === "/login") {
    return <LoginPage />;
  }

  // Faculty and admin routes
  if (location === "/faculty-dashboard") {
    return <FacultyDashboard />;
  }

  if (location === "/admin-dashboard") {
    return <AdminDashboard />;
  }

  // Protected student routes
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/activities" component={Activities} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/courses" component={Courses} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/notes" component={Notes} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </AuthGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
