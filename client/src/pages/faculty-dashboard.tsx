import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  FileText, 
  User, 
  BarChart, 
  Clock,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for pending document verifications
const mockPendingDocuments = [
  {
    id: "doc1",
    studentName: "Alex Johnson",
    studentId: "ABC123456",
    documentType: "Certificate",
    title: "Python Programming Certification",
    submittedDate: "2023-05-15",
    status: "pending",
    fileUrl: "#",
  },
  {
    id: "doc2",
    studentName: "Sarah Williams",
    studentId: "ABC789012",
    documentType: "Conference",
    title: "International Conference on AI",
    submittedDate: "2023-06-20",
    status: "pending",
    fileUrl: "#",
  },
  {
    id: "doc3",
    studentName: "Michael Brown",
    studentId: "ABC345678",
    documentType: "Workshop",
    title: "Web Development Workshop",
    submittedDate: "2023-07-05",
    status: "pending",
    fileUrl: "#",
  }
];

// Mock data for student performance
const mockStudentPerformance = [
  {
    id: "student1",
    name: "Alex Johnson",
    studentId: "ABC123456",
    attendance: 85,
    averageGrade: "A-",
    activitiesCompleted: 12,
    pendingActivities: 2,
    lastActive: "2 hours ago",
  },
  {
    id: "student2",
    name: "Sarah Williams",
    studentId: "ABC789012",
    attendance: 92,
    averageGrade: "A",
    activitiesCompleted: 15,
    pendingActivities: 0,
    lastActive: "1 day ago",
  },
  {
    id: "student3",
    name: "Michael Brown",
    studentId: "ABC345678",
    attendance: 68,
    averageGrade: "C+",
    activitiesCompleted: 8,
    pendingActivities: 5,
    lastActive: "3 days ago",
  },
  {
    id: "student4",
    name: "Emily Davis",
    studentId: "ABC901234",
    attendance: 75,
    averageGrade: "B",
    activitiesCompleted: 10,
    pendingActivities: 3,
    lastActive: "5 hours ago",
  }
];

export default function FacultyDashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [verifiedDocuments, setVerifiedDocuments] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState(mockPendingDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState(mockStudentPerformance);
  
  // Check if user is logged in and is faculty
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setLocation("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== "faculty") {
      setLocation("/login");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [setLocation, toast]);

  // Handle document verification
  const handleVerification = (docId: string, isApproved: boolean) => {
    const docIndex = pendingDocuments.findIndex(doc => doc.id === docId);
    if (docIndex === -1) return;
    
    const document = pendingDocuments[docIndex];
    const updatedDocument = {
      ...document,
      status: isApproved ? "approved" : "rejected",
      verifiedDate: new Date().toISOString().split('T')[0]
    };
    
    // Remove from pending and add to verified
    const newPendingDocs = pendingDocuments.filter(doc => doc.id !== docId);
    setPendingDocuments(newPendingDocs);
    setVerifiedDocuments([updatedDocument, ...verifiedDocuments]);
    
    toast({
      title: isApproved ? "Document Approved" : "Document Rejected",
      description: `${document.title} has been ${isApproved ? "approved" : "rejected"}.`,
    });
  };

  // Filter students based on search query
  const filteredStudents = studentData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Faculty Dashboard</h1>
              <p className="text-sm text-muted-foreground">Document verification and student tracking</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Document Verification</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Student Performance</span>
            </TabsTrigger>
          </TabsList>

          {/* Document Verification Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pending Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Pending Verifications
                  </CardTitle>
                  <CardDescription>
                    Documents waiting for your approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingDocuments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No pending documents to verify</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingDocuments.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{doc.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.studentName} ({doc.studentId})
                              </p>
                            </div>
                            <Badge variant="outline">{doc.documentType}</Badge>
                          </div>
                          <p className="text-sm">Submitted: {doc.submittedDate}</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                            >
                              View Document
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerification(doc.id, true)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1"
                              onClick={() => handleVerification(doc.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verified Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Verified Documents
                  </CardTitle>
                  <CardDescription>
                    Recently verified documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verifiedDocuments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No verified documents yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {verifiedDocuments.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{doc.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.studentName} ({doc.studentId})
                              </p>
                            </div>
                            <Badge 
                              variant={doc.status === "approved" ? "default" : "destructive"}
                            >
                              {doc.status === "approved" ? "Approved" : "Rejected"}
                            </Badge>
                          </div>
                          <p className="text-sm">Verified: {doc.verifiedDate}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            View Document
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Performance Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Performance Tracking</h2>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className={student.attendance < 75 ? "border-red-300" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{student.name}</CardTitle>
                      {student.attendance < 75 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Attendance
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{student.studentId}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className={`text-lg font-medium ${student.attendance < 75 ? "text-red-500" : ""}`}>
                          {student.attendance}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Average Grade</p>
                        <p className="text-lg font-medium">{student.averageGrade}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Activities Completed</p>
                        <p className="text-lg font-medium">{student.activitiesCompleted}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pending Activities</p>
                        <p className="text-lg font-medium">{student.pendingActivities}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Last active: {student.lastActive}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">View Details</Button>
                      <Button variant="default" className="flex-1">Contact Student</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredStudents.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p>No students found matching your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}