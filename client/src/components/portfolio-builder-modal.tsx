import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertPortfolioSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const portfolioFormSchema = insertPortfolioSchema.extend({
  additionalContext: z.string().optional(),
});

interface PortfolioBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortfolioBuilderModal({ open, onOpenChange }: PortfolioBuilderModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const form = useForm<z.infer<typeof portfolioFormSchema>>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      focus: "",
      targetField: "",
      content: {},
      additionalContext: "",
      userId: "current-user", // This would come from auth context
    },
  });

  const generatePortfolioMutation = useMutation({
    mutationFn: (data: z.infer<typeof portfolioFormSchema> & { apiKey?: string }) =>
      apiRequest("POST", "/api/portfolios/generate", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio generation started! You'll be notified when it's ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      form.reset();
      onOpenChange(false);
      setShowApiKeyPrompt(false);
      setApiKey("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate portfolio. Please check your API key and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof portfolioFormSchema>) => {
    if (!apiKey) {
      setShowApiKeyPrompt(true);
      return;
    }
    
    const portfolioData = {
      ...data,
      title: `${data.focus} Portfolio - ${data.targetField}`,
      content: {
        focus: data.focus,
        targetField: data.targetField,
        additionalContext: data.additionalContext,
      },
      apiKey,
    };

    generatePortfolioMutation.mutate(portfolioData);
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive",
      });
      return;
    }
    form.handleSubmit(onSubmit)();
  };

  if (showApiKeyPrompt) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glassmorphism-strong max-w-md bg-background border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6" />
              OpenAI API Key Required
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                We use OpenAI's GPT-5 model to generate personalized portfolios based on your academic and extracurricular achievements.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                data-testid="input-openai-api-key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is secure and only used for this generation request.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowApiKeyPrompt(false);
                  setApiKey("");
                }}
                data-testid="button-cancel-api-key"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleApiKeySubmit}
                disabled={generatePortfolioMutation.isPending}
                data-testid="button-submit-api-key"
              >
                Generate Portfolio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism-strong max-w-2xl max-h-[90vh] overflow-y-auto bg-background border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">AI Portfolio Builder</DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">
            Our AI will analyze your activities and generate a comprehensive portfolio tailored for your career goals.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Focus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-portfolio-focus">
                        <SelectValue placeholder="Select focus area..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="job">Job Application</SelectItem>
                      <SelectItem value="graduate_school">Graduate School</SelectItem>
                      <SelectItem value="scholarship">Scholarship Application</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="general">General Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Industry/Field</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Software Engineering, Data Science, Research"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-target-field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Context</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Any specific requirements or highlights you'd like to emphasize..."
                      className="resize-none"
                      {...field}
                      data-testid="textarea-additional-context"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">What will be included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Academic achievements and GPA</li>
                <li>• Verified certifications and courses</li>
                <li>• Extracurricular activities and leadership roles</li>
                <li>• Research projects and publications</li>
                <li>• Volunteer work and community service</li>
                <li>• Skills and competencies analysis</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-portfolio"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={generatePortfolioMutation.isPending}
                data-testid="button-generate-portfolio"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Portfolio
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
