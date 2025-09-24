import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, Folder, Star, Clock, Tag, 
  MoreVertical, Edit, Trash, Share, Download 
} from "lucide-react";
import { useState } from "react";

// Sample notes data
const notes = [
  {
    id: 1,
    title: "Computer Science Lecture Notes",
    content: "Today we covered algorithms and data structures...",
    category: "Computer Science",
    lastEdited: "2 hours ago",
    starred: true,
    tags: ["lecture", "algorithms"]
  },
  {
    id: 2,
    title: "Calculus II - Integration Techniques",
    content: "Methods for solving complex integrals...",
    category: "Mathematics",
    lastEdited: "Yesterday",
    starred: true,
    tags: ["calculus", "integration"]
  },
  {
    id: 3,
    title: "Psychology Research Paper Ideas",
    content: "Potential topics for the final research paper...",
    category: "Psychology",
    lastEdited: "3 days ago",
    starred: false,
    tags: ["research", "paper"]
  },
  {
    id: 4,
    title: "Study Group Meeting Notes",
    content: "Discussion points from today's study group...",
    category: "General",
    lastEdited: "5 hours ago",
    starred: false,
    tags: ["meeting", "study group"]
  },
  {
    id: 5,
    title: "Project Ideas for Data Structures",
    content: "Potential project ideas for the final assignment...",
    category: "Computer Science",
    lastEdited: "1 week ago",
    starred: false,
    tags: ["project", "ideas"]
  },
  {
    id: 6,
    title: "Exam Preparation - Calculus",
    content: "Practice problems and key concepts to review...",
    category: "Mathematics",
    lastEdited: "2 days ago",
    starred: false,
    tags: ["exam", "review"]
  }
];

// Categories for filtering
const categories = [
  { name: "All Notes", icon: Folder, count: notes.length },
  { name: "Starred", icon: Star, count: notes.filter(note => note.starred).length },
  { name: "Recent", icon: Clock, count: 4 },
  { name: "Computer Science", icon: Folder, count: notes.filter(note => note.category === "Computer Science").length },
  { name: "Mathematics", icon: Folder, count: notes.filter(note => note.category === "Mathematics").length },
  { name: "Psychology", icon: Folder, count: notes.filter(note => note.category === "Psychology").length },
  { name: "General", icon: Folder, count: notes.filter(note => note.category === "General").length }
];

export default function Notes() {
  const [selectedCategory, setSelectedCategory] = useState("All Notes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  
  // Filter notes based on selected category and search query
  const filteredNotes = notes.filter(note => {
    const matchesCategory = 
      selectedCategory === "All Notes" || 
      (selectedCategory === "Starred" && note.starred) ||
      (selectedCategory === "Recent" && ["2 hours ago", "5 hours ago", "Yesterday", "2 days ago"].includes(note.lastEdited)) ||
      note.category === selectedCategory;
    
    const matchesSearch = 
      searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 p-4 space-y-4 overflow-auto">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search notes..." 
            className="h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="sm" variant="ghost" className="px-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Button className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
        
        <div className="space-y-1 pt-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>
        
        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2 px-3 flex items-center justify-between">
            <span>Tags</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </h3>
          <div className="flex flex-wrap gap-2 px-3">
            {Array.from(new Set(notes.flatMap(note => note.tags))).map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notes List */}
      <div className="w-72 border-r border-border/50 overflow-auto">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-medium">
            {selectedCategory} ({filteredNotes.length})
          </h2>
        </div>
        
        <div className="divide-y divide-border/50">
          {filteredNotes.map((note) => (
            <div 
              key={note.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                selectedNote.id === note.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium truncate">{note.title}</h3>
                {note.starred && <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {note.content}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{note.lastEdited}</span>
                <Badge variant="outline" className="text-xs">
                  {note.category}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No notes found</p>
              <Button variant="link" className="mt-2">
                Create a new note
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Note Content */}
      <div className="flex-1 overflow-auto">
        {selectedNote ? (
          <Card className="m-4 h-[calc(100%-2rem)]">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const updatedNotes = notes.map(note => 
                      note.id === selectedNote.id 
                        ? {...note, starred: !note.starred} 
                        : note
                    );
                    // In a real app, you would update the state here
                  }}
                >
                  <Star className={`h-4 w-4 ${selectedNote.starred ? "text-yellow-500 fill-yellow-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{selectedNote.title}</h1>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Badge variant="outline">{selectedNote.category}</Badge>
                <span>•</span>
                <span>Last edited {selectedNote.lastEdited}</span>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{selectedNote.content}</p>
                
                {/* Sample content for demonstration */}
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                
                <h2>Key Points</h2>
                <ul>
                  <li>First important concept from the lecture</li>
                  <li>Second key point to remember for exams</li>
                  <li>Third critical element for understanding the material</li>
                  <li>Additional resources to review later</li>
                </ul>
                
                <h2>Examples</h2>
<p>
  Here are some examples that were covered in class:
</p>
<pre><code>{`// Sample code or mathematical equation
function example() {
  return (
    <div>This is a code example</div>
  );
}`}</code></pre>
                
                <h2>Questions for Further Study</h2>
                <ol>
                  <li>How does this concept relate to previous material?</li>
                  <li>What are the practical applications of this theory?</li>
                  <li>What potential exam questions might cover this topic?</li>
                </ol>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a note to view</p>
          </div>
        )}
      </div>
    </div>
  );
}