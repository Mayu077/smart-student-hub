import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { PortfolioBuilderModal } from "@/components/portfolio-builder-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Download, Eye, Edit, Trash2, Bot, FileText, Clock } from "lucide-react";

export default function Portfolio() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ["/api/portfolios"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-secondary text-secondary-foreground";
      case "generating": return "bg-accent text-accent-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <FileText className="h-4 w-4" />;
      case "generating": return <Bot className="h-4 w-4 animate-pulse" />;
      case "draft": return <Edit className="h-4 w-4" />;
      case "error": return <Trash2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glassmorphism border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-portfolios-title">Portfolio Gallery</h1>
            <p className="text-muted-foreground">Create and manage your AI-generated portfolios</p>
          </div>
          <Button onClick={() => setModalOpen(true)} data-testid="button-create-portfolio">
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>
      </header>

      <div className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : portfolios && Array.isArray(portfolios) && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio: any, index: number) => (
              <Card key={portfolio.id || index} className="p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-portfolio-title-${index}`}>
                        {portfolio.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-portfolio-field-${index}`}>
                        {portfolio.targetField}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(portfolio.status)}
                      <Badge className={`text-xs ${getStatusColor(portfolio.status)}`}>
                        {portfolio.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {portfolio.focus}
                    </Badge>
                    <span className="text-xs text-muted-foreground" data-testid={`text-portfolio-date-${index}`}>
                      {portfolio.createdAt ? new Date(portfolio.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>

                  {portfolio.generatedContent && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm line-clamp-4" data-testid={`text-portfolio-preview-${index}`}>
                        {portfolio.generatedContent.substring(0, 200)}...
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {portfolio.status === "completed" && (
                      <>
                        <Button size="sm" variant="outline" data-testid={`button-view-portfolio-${index}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-download-portfolio-${index}`}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    {portfolio.status === "draft" && (
                      <Button size="sm" data-testid={`button-edit-portfolio-${index}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {portfolio.status === "error" && (
                      <Button size="sm" variant="destructive" data-testid={`button-retry-portfolio-${index}`}>
                        <Bot className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-no-portfolios">No portfolios yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI-powered portfolio to showcase your achievements and skills to potential employers or academic institutions.
              </p>
              <Button onClick={() => setModalOpen(true)} data-testid="button-create-first-portfolio">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          </Card>
        )}
      </div>

      <PortfolioBuilderModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}
