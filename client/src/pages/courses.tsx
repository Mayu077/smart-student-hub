import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, ArrowRight, Plus } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Miller",
    progress: 75,
    credits: 4,
    category: "Computer Science",
    nextClass: "Tomorrow, 10:00 AM",
    assignments: 2,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Calculus II",
    instructor: "Prof. James Wilson",
    progress: 60,
    credits: 3,
    category: "Mathematics",
    nextClass: "Today, 2:00 PM",
    assignments: 1,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Introduction to Psychology",
    instructor: "Dr. Emily Chen",
    progress: 40,
    credits: 3,
    category: "Psychology",
    nextClass: "Wednesday, 11:00 AM",
    assignments: 0,
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Data Structures and Algorithms",
    instructor: "Prof. Michael Brown",
    progress: 30,
    credits: 4,
    category: "Computer Science",
    nextClass: "Friday, 9:00 AM",
    assignments: 3,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Courses() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage your enrolled courses and track your progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ backgroundImage: `url(${course.image})` }}
            />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{course.category}</Badge>
                <Badge variant="secondary">{course.credits} Credits</Badge>
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.nextClass}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.assignments} {course.assignments === 1 ? 'Assignment' : 'Assignments'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                View Course Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-full">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Discover New Courses</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Browse the course catalog to find new learning opportunities</p>
          <Button variant="outline">Browse Catalog</Button>
        </Card>
      </div>
    </div>
  );
}