import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import type { IAttribute } from "@/types/attributeTypes";
import { toast } from "react-toastify";
import { useCreateAttributeMutation, useUpdateAttributeMutation } from "@/features/attribute/attributeApi";
import { Loader2 } from "lucide-react";

interface AttributeFormProps {
  initialData?: IAttribute | null;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  slug: string;
  type: string;
  isActive: boolean;
}

export default function AttributeForm({ initialData, onSuccess }: AttributeFormProps) {
  const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      type: initialData?.type || "text",
      isActive: initialData ? initialData.isActive : true,
    },
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (values: FormValues) => {
    try {
      const slug = values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const payload = {
        name: values.name,
        slug,
        type: values.type,
        isActive: values.isActive,
      };

      if (initialData) {
        await updateAttribute({ id: initialData._id, data: payload }).unwrap();
        toast.success("Attribute updated successfully");
      } else {
        await createAttribute(payload).unwrap();
        toast.success("Attribute created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Attribute name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attribute Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter attribute name (e.g. Color, Size)"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-slugify
                    if (!form.getFieldState("slug").isDirty) {
                      form.setValue("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          rules={{ required: "Attribute type is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text (e.g. Medium, Large)</SelectItem>
                  <SelectItem value="number">Number (e.g. 10, 11, 12)</SelectItem>
                  <SelectItem value="image">Image (e.g. Color swatch image)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Allow this attribute to be selectable when configuring products.
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Attribute" : "Create Attribute"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
