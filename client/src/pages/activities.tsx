import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search } from "lucide-react";

export default function Activities() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">Discover and manage your extracurricular activities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Activity
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search activities..."
            className="w-full bg-background pl-8 h-9 rounded-md border border-input px-3 py-1"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="my-activities">My Activities</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Student Government Meeting</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">Tomorrow, 3:00 PM</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">2 hours</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Student Center, Room 302</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">Leadership</Badge>
                    <Badge variant="outline">Campus Involvement</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">RSVP</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Debate Club Practice</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">Friday, 5:00 PM</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">1.5 hours</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Liberal Arts Building, Room 105</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">Public Speaking</Badge>
                    <Badge variant="outline">Academic</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">RSVP</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-green-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Environmental Club Cleanup</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">Saturday, 10:00 AM</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">3 hours</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Campus Lake</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">Volunteer</Badge>
                    <Badge variant="outline">Environmental</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">RSVP</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-activities" className="space-y-4 mt-6">
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chess Club</h3>
                  <p className="text-muted-foreground mt-1">Weekly meetings on Tuesdays at 7:00 PM</p>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-green-500 hover:bg-green-600 mr-2">Active Member</Badge>
                    <Badge variant="outline">2 Years</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Student Newspaper</h3>
                  <p className="text-muted-foreground mt-1">Weekly meetings on Wednesdays at 6:00 PM</p>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-green-500 hover:bg-green-600 mr-2">Editor</Badge>
                    <Badge variant="outline">1 Year</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="discover" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="w-full h-32 bg-blue-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="font-semibold">Photography Club</h3>
              <p className="text-sm text-muted-foreground mt-1">Learn photography skills and participate in campus photo contests</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Arts</Badge>
                <Badge variant="outline">Creative</Badge>
              </div>
              <Button className="w-full mt-4">Join Club</Button>
            </Card>
            
            <Card className="p-4">
              <div className="w-full h-32 bg-green-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="font-semibold">Hiking Club</h3>
              <p className="text-sm text-muted-foreground mt-1">Explore local trails and enjoy nature with fellow students</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Outdoor</Badge>
                <Badge variant="outline">Fitness</Badge>
              </div>
              <Button className="w-full mt-4">Join Club</Button>
            </Card>
            
            <Card className="p-4">
              <div className="w-full h-32 bg-purple-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="font-semibold">Coding Club</h3>
              <p className="text-sm text-muted-foreground mt-1">Build projects, learn new technologies, and participate in hackathons</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Technology</Badge>
                <Badge variant="outline">Academic</Badge>
              </div>
              <Button className="w-full mt-4">Join Club</Button>
            </Card>
            
            <Card className="p-4">
              <div className="w-full h-32 bg-red-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="font-semibold">Dance Team</h3>
              <p className="text-sm text-muted-foreground mt-1">Learn various dance styles and perform at campus events</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Performing Arts</Badge>
                <Badge variant="outline">Fitness</Badge>
              </div>
              <Button className="w-full mt-4">Join Team</Button>
            </Card>
            
            <Card className="p-4">
              <div className="w-full h-32 bg-amber-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="font-semibold">Volunteer Corps</h3>
              <p className="text-sm text-muted-foreground mt-1">Participate in community service projects and make a difference</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Community Service</Badge>
                <Badge variant="outline">Leadership</Badge>
              </div>
              <Button className="w-full mt-4">Join Corps</Button>
            </Card>
            
            <Card className="p-4">
              <div className="w-full h-32 bg-indigo-500/10 rounded-md flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-indigo-500" />
              </div>
              <h3 className="font-semibold">Music Ensemble</h3>
              <p className="text-sm text-muted-foreground mt-1">Play instruments or sing with other talented musicians</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">Arts</Badge>
                <Badge variant="outline">Performing</Badge>
              </div>
              <Button className="w-full mt-4">Join Ensemble</Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4 mt-6">
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-gray-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Campus Hackathon</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">Last Month</span>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">Technology</Badge>
                    <Badge variant="outline">Competition</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">View Certificate</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="w-16 h-16 rounded-md bg-gray-500/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Charity Fun Run</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">2 Months Ago</span>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">Volunteer</Badge>
                    <Badge variant="outline">Fitness</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Button variant="outline" size="sm">View Photos</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
