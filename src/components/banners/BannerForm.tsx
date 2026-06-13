/* eslint-disable @typescript-eslint/no-unused-vars */
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
import type { IBanner } from "@/types/bannerTypes";
import { toast } from "react-toastify";
import { useCreateBannerMutation, useUpdateBannerMutation } from "@/features/banner/bannerApi";
import { Loader2, Upload, AlertCircle } from "lucide-react";

interface BannerFormProps {
  initialData?: IBanner | null;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  image?: FileList;
}

export default function BannerForm({ initialData, onSuccess }: BannerFormProps) {
  const [preview, setPreview] = useState<string | null>(initialData?.image?.original || null);
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      if (initialData) {
        await updateBanner({ id: initialData._id, data: formData }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        if (!values.image || values.image.length === 0) {
          toast.error("Please select a banner image");
          return;
        }
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully");
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
          name="name"
          rules={{ required: "Banner title/name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter banner title/name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Aspect-ratio fixed responsive preview box */}
                  <div className="relative aspect-[5/2] w-full overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">No image selected</span>
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
                    {...field}
                  />
                  {/* Widescreen image size details indicator at the below */}
                  <div className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-950 dark:border-indigo-950/30 dark:bg-indigo-950/10 dark:text-indigo-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">Recommended Dimensions</span>
                      <p className="leading-relaxed">
                        For optimal display across all devices (Mobile, Tablet, Desktop), upload an image with resolution **1200px width × 480px height** (aspect ratio **5:2**).
                      </p>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
