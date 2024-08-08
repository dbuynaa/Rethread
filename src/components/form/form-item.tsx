import {
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface FormItemProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: string;
  className?: string;
  props: React.ComponentProps<typeof Input>;
}
export const FormInput = <T extends FieldValues>({
  form,
  label,
  className,
  name,
  ...props
}: React.PropsWithChildren<FormItemProps<T>>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
