import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for testing
const mockStudents = [
  { abcId: "ABC123456", password: "student123", name: "Alex Johnson", role: "student" },
  { abcId: "ABC789012", password: "student456", name: "Sarah Williams", role: "student" },
];

const mockFaculty = [
  { username: "faculty1", password: "faculty123", name: "Dr. Robert Smith", role: "faculty" },
  { username: "faculty2", password: "faculty456", name: "Prof. Emily Davis", role: "faculty" },
];

const mockAdmins = [
  { username: "admin1", password: "admin123", name: "Admin User", role: "admin" },
];

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Student login state
  const [studentCredentials, setStudentCredentials] = useState({
    abcId: "",
    password: "",
  });

  // Faculty login state
  const [facultyCredentials, setFacultyCredentials] = useState({
    username: "",
    password: "",
  });

  // Admin login state
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = mockStudents.find(
      (s) => s.abcId === studentCredentials.abcId && s.password === studentCredentials.password
    );

    if (student) {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: student.name,
        id: student.abcId,
        role: student.role
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${student.name}!`,
      });
      
      setLocation("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid ABC ID or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFacultyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const faculty = mockFaculty.find(
      (f) => f.username === facultyCredentials.username && f.password === facultyCredentials.password
    );

    if (faculty) {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: faculty.name,
        id: faculty.username,
        role: faculty.role
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${faculty.name}!`,
      });
      
      setLocation("/faculty-dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const admin = mockAdmins.find(
      (a) => a.username === adminCredentials.username && a.password === adminCredentials.password
    );

    if (admin) {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: admin.name,
        id: admin.username,
        role: admin.role
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${admin.name}!`,
      });
      
      setLocation("/admin-dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background/50 to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Smart Student Hub</h1>
          <p className="text-muted-foreground">Your academic journey, simplified</p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Student</span>
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Faculty</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          {/* Student Login */}
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your ABC ID and password to access your student dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleStudentLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="abcId">ABC ID</Label>
                    <Input 
                      id="abcId" 
                      placeholder="Enter your ABC ID" 
                      value={studentCredentials.abcId}
                      onChange={(e) => setStudentCredentials({...studentCredentials, abcId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input 
                      id="student-password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={studentCredentials.password}
                      onChange={(e) => setStudentCredentials({...studentCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Demo credentials:</p>
                    <p>ABC ID: ABC123456</p>
                    <p>Password: student123</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Faculty Login */}
          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the faculty dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleFacultyLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty-username">Username</Label>
                    <Input 
                      id="faculty-username" 
                      placeholder="Enter your username" 
                      value={facultyCredentials.username}
                      onChange={(e) => setFacultyCredentials({...facultyCredentials, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-password">Password</Label>
                    <Input 
                      id="faculty-password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={facultyCredentials.password}
                      onChange={(e) => setFacultyCredentials({...facultyCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Demo credentials:</p>
                    <p>Username: faculty1</p>
                    <p>Password: faculty123</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Admin Login */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the admin dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input 
                      id="admin-username" 
                      placeholder="Enter your username" 
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input 
                      id="admin-password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Demo credentials:</p>
                    <p>Username: admin1</p>
                    <p>Password: admin123</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}