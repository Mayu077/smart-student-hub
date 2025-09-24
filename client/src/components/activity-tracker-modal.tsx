import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertActivitySchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

const activityFormSchema = insertActivitySchema.extend({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

interface ActivityTrackerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityTrackerModal({ open, onOpenChange }: ActivityTrackerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      type: "",
      provider: "",
      description: "",
      startDate: "",
      endDate: "",
      userId: "current-user", // This would come from auth context
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: z.infer<typeof activityFormSchema>) =>
      apiRequest("POST", "/api/activities", {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Activity submitted for approval successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof activityFormSchema>) => {
    createActivityMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism-strong max-w-2xl max-h-[90vh] overflow-y-auto bg-background border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Activity</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-activity-type">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="volunteering">Volunteering</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Python Programming Workshop" 
                      {...field}
                      data-testid="input-activity-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization/Provider</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Google, Coursera, University" 
                      {...field}
                      data-testid="input-activity-provider"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-start-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-end-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3}
                      placeholder="Brief description of your role and achievements..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-activity-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <Label className="text-lg font-semibold text-primary">Upload Certificate/Proof</Label>
              <div className="border-2 border-dashed border-primary/50 rounded-xl p-8 text-center mt-3 bg-primary/5 hover:bg-primary/10 transition-all hover:border-primary cursor-pointer shadow-sm hover:shadow-md">
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full px-3 py-1 text-xs font-bold">
                  IMPORTANT
                </div>
                <Upload className="h-12 w-12 text-primary mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-medium mb-2">Document Verification Required</h3>
                <p className="text-sm text-muted-foreground">Upload your certificate or proof for verification</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">PDF, PNG, JPG up to 10MB</p>
                <div className="flex justify-center gap-3">
                  <Button 
                    type="button" 
                    variant="default" 
                    className="mt-2 px-6 py-2 bg-primary hover:bg-primary/90"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose File
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-2 px-6 py-2 border-primary text-primary hover:bg-primary/10"
                    onClick={() => document.getElementById('file-upload-camera')?.click()}
                  >
                    Take Photo
                  </Button>
                </div>
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.png,.jpg,.jpeg"
                  data-testid="input-file-upload"
                />
                <input 
                  id="file-upload-camera"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  capture="environment"
                />
                <p className="text-xs text-primary mt-4 font-medium">
                  * Documents will be verified by faculty before being added to your portfolio
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-activity"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createActivityMutation.isPending}
                data-testid="button-submit-activity"
              >
                {createActivityMutation.isPending ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
