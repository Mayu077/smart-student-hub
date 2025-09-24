import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, PieChart, LineChart, Calendar, 
  ArrowUp, ArrowDown, Clock, Award, BookOpen, 
  Brain, Target, Download, Share, Plus as PlusIcon
} from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your academic performance and study habits</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Semester
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GPA</p>
                <h3 className="text-3xl font-bold mt-1">3.8</h3>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +0.2
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Top 15% of your class</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <h3 className="text-3xl font-bold mt-1">24.5</h3>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +3.2
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">This week</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full" style={{ width: "70%" }}></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                <h3 className="text-3xl font-bold mt-1">92%</h3>
              </div>
              <Badge className="bg-red-500 hover:bg-red-600">
                <ArrowDown className="h-3 w-3 mr-1" />
                -3%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Average score</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: "92%" }}></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <h3 className="text-3xl font-bold mt-1">98%</h3>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +2%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Class presence</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: "98%" }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Grade Distribution</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              {/* Simulated chart - in a real app, use a chart library */}
              <div className="flex items-end justify-center gap-4 h-full w-full px-6">
                {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"].map((grade, index) => {
                  // Generate a height based on a bell curve
                  const heights = [30, 45, 65, 80, 90, 75, 60, 40, 25, 15, 5];
                  const height = heights[index];
                  
                  return (
                    <div key={grade} className="flex flex-col items-center">
                      <div 
                        className="w-8 rounded-t-md bg-gradient-to-t from-primary/50 to-primary" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-muted-foreground">{grade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Current: B+</Badge>
                <Badge variant="outline">Goal: A-</Badge>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Study Time by Subject</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              {/* Simulated chart - in a real app, use a chart library */}
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-r-green-500" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-purple-500" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-amber-500" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">24.5h</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
              
              <div className="ml-8 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Computer Science (40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Mathematics (25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Psychology (20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Other (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <div className="p-4 border-b border-border">
          <h3 className="font-medium">Weekly Study Progress</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Simulated chart - in a real app, use a chart library */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
              // Generate random heights for the bars
              const heights = [60, 45, 75, 30, 90, 50, 20];
              const targetHeights = [50, 50, 50, 50, 50, 30, 30];
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div 
                      className="w-full rounded-t-md bg-primary/20" 
                      style={{ height: `${targetHeights[index]}%` }}
                    ></div>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-md bg-primary" 
                      style={{ height: `${heights[index]}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                <span className="text-sm">Target</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: Today, 2:30 PM</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Academic Standing</h3>
            <p className="text-sm text-muted-foreground mb-4">You're in the top 15% of your class</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "85%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dean's List Qualification: 85%</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Course Completion</h3>
            <p className="text-sm text-muted-foreground mb-4">You've completed 65% of your courses</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Graduation Progress: 65%</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Learning Efficiency</h3>
            <p className="text-sm text-muted-foreground mb-4">Your study-to-grade ratio is excellent</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: "78%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Efficiency Score: 78%</p>
          </div>
        </Card>
      </div>

      {/* Goals */}
      <Card>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-medium">Academic Goals</h3>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Achieve 3.8 GPA this semester</h4>
              <div className="flex justify-between items-center mt-1">
                <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden mr-4">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Complete all assignments on time</h4>
              <div className="flex justify-between items-center mt-1">
                <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden mr-4">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "75%" }}></div>
                </div>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Study 25 hours per week</h4>
              <div className="flex justify-between items-center mt-1">
                <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden mr-4">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "98%" }}></div>
                </div>
                <span className="text-sm text-muted-foreground">98%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}