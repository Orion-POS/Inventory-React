// import { useForm } from "react-hook-form";
// import { z, ZodAny } from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
// import { Input } from "../ui/input";

// type FormTypes = 'text' | 'select' | 'date-picker'

// interface DataForm {
//   fieldname: string;
//   placeholder: string;
//   required: true;
//   label: string;
// }

// interface InputFormProps {
//   type: FormTypes;
//   defaultValues: any:
//   formSchema: ZodAny;
//   formData: DataForm[]
// }

// const formSchemaData = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// })

// const dataForm = [
//   {
//     fieldname: 'username',
//     placeholder: 'input your username',
//     required: true,

//   }
// ]

// const InputForm: React.FC<InputFormProps> = ({ type, defaultValues, formSchema, formData }) => {
//   const form = useForm<z.infer<typeof formSchema>>({
//     defaultValues
//   })

//   const renderField = (field) => {
//     switch (type) {
//       case 'text':
//         return <Input  {...field}/>

//       default:
//         return null;
//     }

//   }

//   return (
//     <Form {...form}>
//       {
//         formData.map(item => (
//           <FormField
//           name={item.fieldname}
//           control={form.control}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{item.label}</FormLabel>
//               <FormControl>
//                 {renderField(field)}
//               </FormControl>
//             </FormItem>
//           )}
//           />
//         ))
//       }
//     </Form>
//   )

// }
