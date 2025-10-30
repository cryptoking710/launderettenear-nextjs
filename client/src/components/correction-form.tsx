import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Launderette, insertCorrectionSchema, InsertCorrection } from "@shared/schema";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CorrectionFormProps {
  launderette: Launderette;
}

const correctionFormSchema = insertCorrectionSchema.extend({
  submitterName: z.string().min(1, "Name is required"),
  submitterEmail: z.string().email("Valid email is required"),
  fieldName: z.string().min(1, "Please select a field to correct"),
  proposedValue: z.string().min(1, "Proposed value is required"),
});

type CorrectionFormValues = z.infer<typeof correctionFormSchema>;

const CORRECTABLE_FIELDS = [
  { value: "name", label: "Business Name", currentGetter: (l: Launderette) => l.name },
  { value: "address", label: "Address", currentGetter: (l: Launderette) => l.address },
  { value: "phone", label: "Phone Number", currentGetter: (l: Launderette) => l.phone || "Not provided" },
  { value: "email", label: "Email", currentGetter: (l: Launderette) => l.email || "Not provided" },
  { value: "website", label: "Website", currentGetter: (l: Launderette) => l.website || "Not provided" },
];

export function CorrectionForm({ launderette }: CorrectionFormProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CorrectionFormValues>({
    resolver: zodResolver(correctionFormSchema),
    defaultValues: {
      launderetteId: launderette.id,
      launderetteName: launderette.name,
      submitterName: "",
      submitterEmail: "",
      fieldName: "",
      currentValue: "",
      proposedValue: "",
      additionalNotes: "",
    },
  });

  const selectedField = form.watch("fieldName");

  const mutation = useMutation({
    mutationFn: (data: InsertCorrection) =>
      apiRequest<any>("POST", "/api/corrections", data),
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Correction submitted",
        description: "Thank you! We'll review your suggestion soon.",
      });
      form.reset();
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
      }, 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Could not submit correction",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CorrectionFormValues) => {
    mutation.mutate(data);
  };

  const handleFieldChange = (value: string) => {
    form.setValue("fieldName", value);
    const field = CORRECTABLE_FIELDS.find((f) => f.value === value);
    if (field) {
      const currentValue = field.currentGetter(launderette);
      form.setValue("currentValue", currentValue);
    }
  };

  if (!showForm) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowForm(true)}
        data-testid="button-suggest-correction"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Suggest a Correction
      </Button>
    );
  }

  if (submitted) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Thank you for your correction! We'll review it and update the listing if approved.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Suggest a Correction</h3>
        <p className="text-sm text-muted-foreground">
          Found incorrect information? Help us keep this listing up to date.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Smith"
                      {...field}
                      data-testid="input-correction-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      data-testid="input-correction-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What needs to be corrected?</FormLabel>
                <Select
                  onValueChange={handleFieldChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-correction-field">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CORRECTABLE_FIELDS.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedField && (
            <>
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input {...field} disabled data-testid="input-current-value" />
                    </FormControl>
                    <FormDescription>
                      This is what we currently have on file
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the correct information"
                        {...field}
                        data-testid="input-proposed-value"
                      />
                    </FormControl>
                    <FormDescription>
                      What should it be instead?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional context or explanation..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    data-testid="input-correction-notes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={mutation.isPending}
              data-testid="button-submit-correction"
            >
              {mutation.isPending ? "Submitting..." : "Submit Correction"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                form.reset();
              }}
              disabled={mutation.isPending}
              data-testid="button-cancel-correction"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
