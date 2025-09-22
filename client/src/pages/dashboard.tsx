import { GlassmorphismCard } from "@/components/glassmorphism-card";
import { ProgressCircle } from "@/components/progress-circle";
import { ActivityTrackerModal } from "@/components/activity-tracker-modal";
import { PortfolioBuilderModal } from "@/components/portfolio-builder-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  GraduationCap, 
  Plus, 
  UserCircle, 
  BarChart3, 
  CalendarPlus, 
  Download,
  CheckCircle2,
  Circle,
  ExternalLink,
  Tag,
  Users,
  Trophy,
  Bell,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Fetch upcoming tasks
  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks/upcoming"],
  });

  // Fetch recent activities
  const { data: activities } = useQuery({
    queryKey: ["/api/activities/recent"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "certification": return <Tag className="h-4 w-4 text-white" />;
      case "volunteering": return <Users className="h-4 w-4 text-white" />;
      case "competition": return <Trophy className="h-4 w-4 text-white" />;
      default: return <GraduationCap className="h-4 w-4 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-secondary";
      case "pending": return "bg-accent";
      case "rejected": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glassmorphism border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span data-testid="text-user-name">{user?.firstName || "Alex"}</span>! Here's your academic overview.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Current Course Progress */}
          <GlassmorphismCard className="lg:col-span-2 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-current-course">
                  {stats?.currentCourse?.title || "No active course"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-course-progress">
                  {stats?.currentCourse?.progress || 0}% Complete
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.currentCourse?.progress || 0}%` }}
                  ></div>
                </div>
                <Button 
                  disabled={!stats?.currentCourse}
                  data-testid="button-continue-lesson"
                >
                  Continue Lesson
                </Button>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Study Hours Progress */}
          <GlassmorphismCard className="p-6 flex flex-col items-center justify-center">
            <ProgressCircle percentage={stats?.studyHoursPercentage || 0}>
              <span className="text-xl font-bold" data-testid="text-study-hours-percentage">
                {stats?.studyHoursPercentage || 0}%
              </span>
              <span className="text-xs text-muted-foreground">Study Hours</span>
            </ProgressCircle>
            <p className="text-sm text-center text-muted-foreground mt-4" data-testid="text-study-hours-week">
              {stats?.studyHoursWeek || "0h"} this week
            </p>
          </GlassmorphismCard>

          {/* Quick Stats */}
          <GlassmorphismCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assignments</span>
                <span className="font-semibold" data-testid="text-assignments">
                  {stats?.assignments?.completed || 0}/{stats?.assignments?.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">GPA</span>
                <span className="font-semibold" data-testid="text-gpa">{user?.gpa || "0.0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attendance</span>
                <span className="font-semibold text-secondary" data-testid="text-attendance">
                  {user?.attendance || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Credits</span>
                <span className="font-semibold" data-testid="text-credits">
                  {user?.completedCredits || 0}/{user?.totalCredits || 0}
                </span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
              <Button variant="ghost" className="text-primary font-medium text-sm" data-testid="button-view-all-tasks">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 3).map((task: any, index: number) => (
                  <div key={task.id || index} className="activity-item flex items-center gap-4 p-3 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0"
                      data-testid={`button-toggle-task-${index}`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : ''}`} data-testid={`text-task-title-${index}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-task-course-${index}`}>
                        {task.courseName || "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" data-testid={`text-task-due-${index}`}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </p>
                      <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
                        task.completed ? 'bg-secondary' : 'bg-destructive'
                      }`}></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p data-testid="text-no-tasks">No upcoming tasks</p>
                </div>
              )}
            </div>
          </GlassmorphismCard>

          {/* Weekly Progress Chart */}
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
              <select className="bg-transparent border border-border rounded-lg px-3 py-1 text-sm" data-testid="select-time-period">
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>

            <div className="relative h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className="[stop-color:hsl(var(--secondary))]" stopOpacity="0.3"/>
                    <stop offset="100%" className="[stop-color:hsl(var(--secondary))]" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 20 130 Q 60 100 80 110 T 120 90 T 160 100 T 200 80 T 240 90 T 280 70 L 280 130 Z" 
                      fill="url(#chartGradient)"/>
                <path d="M 20 130 Q 60 100 80 110 T 120 90 T 160 100 T 200 80 T 240 90 T 280 70" 
                      stroke="hsl(var(--secondary))" strokeWidth="3" fill="none"/>
                <circle cx="80" cy="110" r="4" fill="hsl(var(--secondary))"/>
                <circle cx="120" cy="90" r="4" fill="hsl(var(--secondary))"/>
                <circle cx="160" cy="100" r="4" fill="hsl(var(--secondary))"/>
                <circle cx="200" cy="80" r="4" fill="hsl(var(--secondary))"/>
                <circle cx="240" cy="90" r="4" fill="hsl(var(--secondary))"/>
                <circle cx="280" cy="70" r="4" fill="hsl(var(--secondary))"/>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary" data-testid="text-weekly-study-hours">28.5h</p>
                <p className="text-xs text-muted-foreground">Study Hours</p>
              </div>
              <div>
                <p className="text-lg font-bold text-secondary" data-testid="text-weekly-activities">12</p>
                <p className="text-xs text-muted-foreground">Activities</p>
              </div>
              <div>
                <p className="text-lg font-bold text-accent" data-testid="text-weekly-avg-score">92%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Recent Activities */}
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activities & Achievements</h3>
            <Button onClick={() => setActivityModalOpen(true)} data-testid="button-add-activity">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities && activities.length > 0 ? (
              activities.slice(0, 6).map((activity: any, index: number) => (
                <div key={activity.id || index} className="activity-item border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-border transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" data-testid={`text-activity-title-${index}`}>
                        {activity.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2" data-testid={`text-activity-provider-${index}`}>
                        {activity.provider}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></span>
                        <span className="text-xs text-muted-foreground" data-testid={`text-activity-date-${index}`}>
                          {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-activity-external-${index}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p data-testid="text-no-activities">No activities found. Add your first achievement!</p>
              </div>
            )}
          </div>
        </GlassmorphismCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="ghost"
            className="glassmorphism rounded-xl p-6 text-left hover:shadow-lg transition-all group h-auto justify-start flex-col items-start min-h-[140px]"
            onClick={() => setPortfolioModalOpen(true)}
            data-testid="button-generate-portfolio"
          >
            <div className="w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-left">Generate Portfolio</h4>
              <p className="text-sm text-muted-foreground text-left leading-relaxed">Create AI-powered portfolio from your activities</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="glassmorphism rounded-xl p-6 text-left hover:shadow-lg transition-all group h-auto justify-start flex-col items-start min-h-[140px]"
            data-testid="button-view-analytics"
          >
            <div className="w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-left">View Analytics</h4>
              <p className="text-sm text-muted-foreground text-left leading-relaxed">Detailed insights into your academic progress</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="glassmorphism rounded-xl p-6 text-left hover:shadow-lg transition-all group h-auto justify-start flex-col items-start min-h-[140px]"
            data-testid="button-schedule-event"
          >
            <div className="w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarPlus className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-left">Schedule Event</h4>
              <p className="text-sm text-muted-foreground text-left leading-relaxed">Add upcoming conferences or workshops</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="glassmorphism rounded-xl p-6 text-left hover:shadow-lg transition-all group h-auto justify-start flex-col items-start min-h-[140px]"
            data-testid="button-export-records"
          >
            <div className="w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-chart-4 to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-left">Export Records</h4>
              <p className="text-sm text-muted-foreground text-left leading-relaxed">Download verified academic records</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ActivityTrackerModal 
        open={activityModalOpen} 
        onOpenChange={setActivityModalOpen} 
      />
      <PortfolioBuilderModal 
        open={portfolioModalOpen} 
        onOpenChange={setPortfolioModalOpen} 
      />
    </div>
  );
}
