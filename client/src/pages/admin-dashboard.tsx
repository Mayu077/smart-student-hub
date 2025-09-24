import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  FileText, 
  User, 
  Users,
  Download,
  Clock,
  AlertTriangle,
  LogOut,
  FileBarChart,
  Award,
  TrendingUp,
  Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for analytics
const mockAnalyticsData = {
  totalStudents: 1250,
  totalFaculty: 78,
  totalActivities: 3456,
  verifiedDocuments: 2789,
  pendingVerifications: 124,
  studentGrowth: 12.5,
  activityGrowth: 23.8,
  departmentDistribution: [
    { name: "Computer Science", count: 320, color: "bg-blue-500" },
    { name: "Electrical Engineering", count: 280, color: "bg-green-500" },
    { name: "Mechanical Engineering", count: 240, color: "bg-yellow-500" },
    { name: "Civil Engineering", count: 210, color: "bg-purple-500" },
    { name: "Electronics", count: 200, color: "bg-pink-500" }
  ],
  activityTypeDistribution: [
    { name: "Certifications", count: 1200, color: "bg-indigo-500" },
    { name: "Workshops", count: 850, color: "bg-cyan-500" },
    { name: "Conferences", count: 620, color: "bg-amber-500" },
    { name: "Internships", count: 480, color: "bg-red-500" },
    { name: "Research", count: 306, color: "bg-emerald-500" }
  ],
  monthlyActivities: [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 150 },
    { month: "Mar", count: 180 },
    { month: "Apr", count: 210 },
    { month: "May", count: 240 },
    { month: "Jun", count: 270 },
    { month: "Jul", count: 300 },
    { month: "Aug", count: 330 },
    { month: "Sep", count: 360 },
    { month: "Oct", count: 390 },
    { month: "Nov", count: 420 },
    { month: "Dec", count: 450 }
  ]
};

// Mock data for NAAC/NIRF reports
const mockReports = [
  {
    id: "report1",
    title: "NAAC Criterion 1 - Curricular Aspects",
    description: "Student participation in curriculum enrichment activities",
    generatedDate: "2023-10-15",
    status: "completed",
    type: "NAAC"
  },
  {
    id: "report2",
    title: "NAAC Criterion 2 - Teaching-Learning and Evaluation",
    description: "Student performance and learning outcomes",
    generatedDate: "2023-10-20",
    status: "completed",
    type: "NAAC"
  },
  {
    id: "report3",
    title: "NIRF Research Output Report",
    description: "Research publications and projects by students",
    generatedDate: "2023-11-05",
    status: "completed",
    type: "NIRF"
  },
  {
    id: "report4",
    title: "NIRF Placement Statistics",
    description: "Student placement data and industry connections",
    generatedDate: "2023-11-10",
    status: "in_progress",
    type: "NIRF"
  },
  {
    id: "report5",
    title: "NAAC Criterion 5 - Student Support",
    description: "Student participation in governance and extracurricular activities",
    generatedDate: null,
    status: "pending",
    type: "NAAC"
  }
];

export default function AdminDashboard() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [reportType, setReportType] = useState("all");

  // Check if user is logged in as admin
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn || userType !== "admin") {
      navigate("/login");
      toast({
        title: "Access Denied",
        description: "Please login as an administrator to access this page.",
        variant: "destructive",
      });
    }
  }, []);

  // Filter reports based on search and type
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = reportType === "all" || report.type === reportType;
    return matchesSearch && matchesType;
  });

  // Handle report generation
  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `${reportType} report generation has started. This may take a few minutes.`,
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated successfully.`,
      });
    }, 3000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage institution analytics and reports</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="analytics" className="text-center py-3">
            <BarChart className="h-4 w-4 mr-2 inline-block" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-center py-3">
            <FileBarChart className="h-4 w-4 mr-2 inline-block" />
            NAAC/NIRF Reports
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <h3 className="text-2xl font-bold mt-1">{mockAnalyticsData.totalStudents}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {mockAnalyticsData.studentGrowth}% from last semester
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                    <h3 className="text-2xl font-bold mt-1">{mockAnalyticsData.totalFaculty}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                    <h3 className="text-2xl font-bold mt-1">{mockAnalyticsData.totalActivities}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {mockAnalyticsData.activityGrowth}% from last year
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
                    <h3 className="text-2xl font-bold mt-1">{mockAnalyticsData.pendingVerifications}</h3>
                    <p className="text-xs text-amber-500 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Requires faculty attention
                    </p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Student distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.departmentDistribution.map((dept, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-muted-foreground">{dept.count} students</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${dept.color}`} 
                          style={{ width: `${(dept.count / mockAnalyticsData.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Type Distribution</CardTitle>
                <CardDescription>Breakdown of activity types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.activityTypeDistribution.map((activity, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{activity.name}</span>
                        <span className="text-sm text-muted-foreground">{activity.count} activities</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${activity.color}`} 
                          style={{ width: `${(activity.count / mockAnalyticsData.totalActivities) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Submissions</CardTitle>
              <CardDescription>Activity submission trends over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {mockAnalyticsData.monthlyActivities.map((month, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-primary rounded-t-md w-12" 
                      style={{ height: `${(month.count / 450) * 250}px` }}
                    ></div>
                    <span className="text-xs mt-2">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NAAC/NIRF Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reports..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="NAAC">NAAC</SelectItem>
                  <SelectItem value="NIRF">NIRF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className={`w-full md:w-1 ${report.type === 'NAAC' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className={report.type === 'NAAC' ? 'text-blue-500 border-blue-500' : 'text-green-500 border-green-500'}>
                            {report.type}
                          </Badge>
                          <h3 className="text-lg font-semibold mt-2">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        </div>
                        <Badge 
                          variant={
                            report.status === 'completed' ? 'default' : 
                            report.status === 'in_progress' ? 'outline' : 'secondary'
                          }
                          className={
                            report.status === 'completed' ? 'bg-green-500' : 
                            report.status === 'in_progress' ? 'border-amber-500 text-amber-500' : ''
                          }
                        >
                          {report.status === 'completed' ? 'Completed' : 
                           report.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          {report.generatedDate ? `Generated on: ${report.generatedDate}` : 'Not generated yet'}
                        </div>
                        <div className="flex gap-2">
                          {report.status === 'completed' && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                          {report.status !== 'in_progress' && (
                            <Button 
                              variant={report.status === 'completed' ? 'outline' : 'default'} 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleGenerateReport(report.type)}
                            >
                              {report.status === 'completed' ? 'Regenerate' : 'Generate'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generate New Report Section */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Generate Custom Report</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Create a custom report for NAAC or NIRF with specific criteria and date ranges
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => handleGenerateReport('NAAC')}
                  >
                    <FileText className="h-4 w-4" />
                    New NAAC Report
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex items-center gap-2"
                    onClick={() => handleGenerateReport('NIRF')}
                  >
                    <FileBarChart className="h-4 w-4" />
                    New NIRF Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}