import {
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input, type InputProps } from '../ui/input';

interface FormItemProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: string;
  inputProps?: InputProps;
}
export const FormInput = <T extends FieldValues>({
  form,
  label,
  name,
  inputProps,
}: React.PropsWithChildren<FormItemProps<T>>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
