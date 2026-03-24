import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ICampaign } from "@/types/campaignTypes";
import { toast } from "react-toastify";
import { useCreateCampaignMutation, useUpdateCampaignMutation } from "@/features/campaign/campaignApi";
import { Loader2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CampaignFormProps {
  initialData?: ICampaign | null;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  bannerImg?: FileList;
}

export default function CampaignForm({ initialData, onSuccess }: CampaignFormProps) {
  const [preview, setPreview] = useState<string | null>(initialData?.bannerImg?.medium || null);
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
      status: initialData?.status || "inactive",
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("status", values.status);
      
      if (values.bannerImg && values.bannerImg.length > 0) {
        formData.append("bannerImg", values.bannerImg[0]);
      }

      if (initialData) {
        await updateCampaign({ id: initialData._id, data: formData }).unwrap();
        toast.success("Campaign updated successfully");
      } else {
        await createCampaign(formData).unwrap();
        toast.success("Campaign created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Something went wrong");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Campaign title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter campaign description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bannerImg"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-40 overflow-hidden rounded-md border bg-muted">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      onChange(e.target.files);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
