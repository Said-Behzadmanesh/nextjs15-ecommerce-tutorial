import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchemaType } from "@/lib/schemas";
import { Control } from "react-hook-form";

type FormFieldElementProps = {
  control: Control<RegisterSchemaType>;
  name: keyof RegisterSchemaType;
  placeholder: string;
  type?: string;
};

export default function FormFieldElement({
  control,
  name,
  placeholder,
  type = "text",
}: FormFieldElementProps) {
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
