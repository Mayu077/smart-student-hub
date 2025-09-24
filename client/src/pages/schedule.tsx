import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";

// Sample schedule data
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const currentDate = new Date();

const events = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    type: "Lecture",
    location: "Science Building, Room 101",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    day: "Monday",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Calculus II",
    type: "Lecture",
    location: "Math Building, Room 203",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    day: "Monday",
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Data Structures Lab",
    type: "Lab",
    location: "Computer Lab, Room 105",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    day: "Tuesday",
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Psychology Study Group",
    type: "Study Group",
    location: "Library, Study Room 3",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    day: "Wednesday",
    color: "bg-yellow-500"
  },
  {
    id: 5,
    title: "Calculus II",
    type: "Lecture",
    location: "Math Building, Room 203",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    day: "Wednesday",
    color: "bg-green-500"
  },
  {
    id: 6,
    title: "Introduction to Computer Science",
    type: "Lecture",
    location: "Science Building, Room 101",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    day: "Thursday",
    color: "bg-blue-500"
  },
  {
    id: 7,
    title: "Data Structures Assignment Due",
    type: "Deadline",
    location: "Online Submission",
    startTime: "11:59 PM",
    endTime: "11:59 PM",
    day: "Friday",
    color: "bg-red-500"
  }
];

// Time slots for the schedule
const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  // Get the current week dates
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) + (currentWeek * 7);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const weekDates = getWeekDates();
  
  // Format date as "MMM D"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: string) => {
    return events.filter(event => event.day === day);
  };
  
  // Navigate to previous week
  const previousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };
  
  // Navigate to next week
  const nextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };
  
  // Reset to current week
  const goToCurrentWeek = () => {
    setCurrentWeek(0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your classes, events, and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="ml-2 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-8 divide-x divide-border">
          {/* Time column */}
          <div className="col-span-1">
            <div className="h-16 flex items-center justify-center border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Time</span>
            </div>
            {timeSlots.map((time, index) => (
              <div key={index} className="h-20 flex items-center justify-center border-b border-border">
                <span className="text-sm text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>
          
          {/* Days columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="col-span-1">
              <div className={`h-16 flex flex-col items-center justify-center border-b border-border ${
                isToday(weekDates[dayIndex]) ? 'bg-primary/10' : ''
              }`}>
                <span className="text-sm font-medium">{day}</span>
                <span className={`text-xs ${
                  isToday(weekDates[dayIndex]) ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}>
                  {formatDate(weekDates[dayIndex])}
                </span>
              </div>
              
              <div className="relative">
                {timeSlots.map((_, index) => (
                  <div key={index} className="h-20 border-b border-border"></div>
                ))}
                
                {/* Events */}
                {getEventsForDay(day).map((event) => {
                  // Calculate position based on start time
                  const startHour = parseInt(event.startTime.split(':')[0]);
                  const startMinutes = parseInt(event.startTime.split(':')[1].split(' ')[0]);
                  const isPM = event.startTime.includes('PM');
                  const hour24 = isPM && startHour !== 12 ? startHour + 12 : startHour;
                  
                  // Calculate duration
                  const endHour = parseInt(event.endTime.split(':')[0]);
                  const endMinutes = parseInt(event.endTime.split(':')[1].split(' ')[0]);
                  const isEndPM = event.endTime.includes('PM');
                  const endHour24 = isEndPM && endHour !== 12 ? endHour + 12 : endHour;
                  
                  const startPosition = (hour24 - 8) * 80 + (startMinutes / 60) * 80;
                  const duration = ((endHour24 - hour24) * 60 + (endMinutes - startMinutes)) / 60 * 80;
                  
                  return (
                    <div 
                      key={event.id}
                      className={`absolute left-1 right-1 rounded-md p-2 ${event.color} text-white`}
                      style={{ 
                        top: `${startPosition}px`, 
                        height: `${duration}px`,
                        zIndex: 10
                      }}
                    >
                      <div className="text-xs font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {duration > 40 && (
                        <div className="text-xs opacity-90 flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-border">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="p-4 flex items-center gap-4">
                <div className={`w-2 h-12 rounded-full ${event.color}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.day}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{event.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-medium">Deadlines</h3>
          </div>
          <div className="p-4 space-y-4">
            {events.filter(e => e.type === "Deadline").length > 0 ? (
              events.filter(e => e.type === "Deadline").map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-red-500"></div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.day}, {event.startTime}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No upcoming deadlines</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">View All Deadlines</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}