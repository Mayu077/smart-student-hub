import { GlassmorphismCard } from "@/components/glassmorphism-card";
import { ActivityTrackerModal } from "@/components/activity-tracker-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Filter, Calendar, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";

export default function Activities() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const filteredActivities = activities?.filter((activity: any) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-secondary" />;
      case "pending": return <Clock className="h-4 w-4 text-accent" />;
      case "rejected": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-secondary text-secondary-foreground";
      case "pending": return "bg-accent text-accent-foreground";
      case "rejected": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glassmorphism border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-activities-title">Activities & Achievements</h1>
            <p className="text-muted-foreground">Track and manage your academic and extracurricular activities</p>
          </div>
          <Button onClick={() => setModalOpen(true)} data-testid="button-add-activity">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Filters */}
        <GlassmorphismCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-activities"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]" data-testid="select-type-filter">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="volunteering">Volunteering</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassmorphismCard>

        {/* Activities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassmorphismCard key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </GlassmorphismCard>
            ))}
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity: any, index: number) => (
              <GlassmorphismCard key={activity.id || index} className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-activity-title-${index}`}>
                        {activity.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-activity-provider-${index}`}>
                        {activity.provider}
                      </p>
                      <Badge variant="outline" className="text-xs mb-2">
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.status)}
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>

                  {activity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-activity-description-${index}`}>
                      {activity.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span data-testid={`text-activity-date-${index}`}>
                        {activity.startDate ? new Date(activity.startDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                    {activity.fileUrl && (
                      <Button variant="ghost" size="sm" data-testid={`button-view-document-${index}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </GlassmorphismCard>
            ))}
          </div>
        ) : (
          <GlassmorphismCard className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-no-activities">No activities found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your filters to see more activities."
                  : "Start building your portfolio by adding your first activity or achievement."
                }
              </p>
              <Button onClick={() => setModalOpen(true)} data-testid="button-add-first-activity">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Activity
              </Button>
            </div>
          </GlassmorphismCard>
        )}
      </div>

      <ActivityTrackerModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}
