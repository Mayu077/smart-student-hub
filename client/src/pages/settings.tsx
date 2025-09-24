import React from "react";
import { GlassmorphismCard } from "@/components/glassmorphism-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, Bell, Shield, Moon, Sun, Palette, 
  Globe, LogOut, Save, Upload, Trash, Mail
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="glassmorphism">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">AJ</span>
                  </div>
                  <h3 className="text-xl font-bold">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground mb-4">Student ID: 2024CS001</p>
                  <div className="space-y-2 w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2 text-destructive">
                      <Trash className="h-4 w-4" />
                      Remove Photo
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2">
              <GlassmorphismCard className="p-6 space-y-6">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="alex.johnson@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue="Computer Science student with interests in AI and web development." />
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input id="studentId" defaultValue="2024CS001" readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input id="major" defaultValue="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" defaultValue="Junior" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advisor">Academic Advisor</Label>
                    <Input id="advisor" defaultValue="Dr. Sarah Miller" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </GlassmorphismCard>

              <GlassmorphismCard className="p-6 mt-6">
                <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash className="h-4 w-4" />
                  Delete Account
                </Button>
              </GlassmorphismCard>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <GlassmorphismCard className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Assignment Reminders</h4>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming assignments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Deadline Alerts</h4>
                  <p className="text-sm text-muted-foreground">Receive alerts for approaching deadlines</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Grade Updates</h4>
                  <p className="text-sm text-muted-foreground">Get notified when new grades are posted</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Course Announcements</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications for course announcements</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Summary</h4>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of your academic progress</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border border-border rounded-md">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">alex.johnson@university.edu</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-md">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Enabled on this device</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <GlassmorphismCard className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Theme Preferences</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Color Theme</h4>
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`w-40 h-24 rounded-md border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      theme === "light" ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  
                  <button
                    className={`w-40 h-24 rounded-md border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      theme === "dark" ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  
                  <button
                    className={`w-40 h-24 rounded-md border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      theme === "system" ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-900 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-3">Font Size</h4>
                <div className="flex items-center gap-4">
                  <span className="text-sm">A</span>
                  <Input type="range" className="w-full max-w-md" defaultValue={50} />
                  <span className="text-lg">A</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reduce Animations</h4>
                  <p className="text-sm text-muted-foreground">Minimize motion for accessibility</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">High Contrast Mode</h4>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <GlassmorphismCard className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-muted-foreground">Make your profile visible to other students</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Online Status</h4>
                  <p className="text-sm text-muted-foreground">Let others see when you're active</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Share Academic Progress</h4>
                  <p className="text-sm text-muted-foreground">Allow sharing your progress with instructors</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Analytics</h4>
                  <p className="text-sm text-muted-foreground">Allow anonymous usage data collection to improve the platform</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Data Management</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Download Your Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive">
                  Delete All Data
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Google</h4>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Microsoft</h4>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" className="flex items-center gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
        <p className="text-sm text-muted-foreground">
          Smart Student Hub • Version 1.0.0
        </p>
      </div>
    </div>
  );
}