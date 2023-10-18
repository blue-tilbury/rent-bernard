import * as z from "zod";

export const scheme = z.object({
  title: z.string().min(10, { message: "Please enter more than 10 characters." }),
  is_furnished: z.boolean({ required_error: "Plese select one of the options." }),
  is_pet_friendly: z.boolean({ required_error: "Plese select one of the options." }),
  price: z
    .number({ invalid_type_error: "Number is required." })
    .positive({ message: "Price must be positive number." })
    .int({ message: "Price must be integer." }),
  city: z.string().nonempty({ message: "City is required." }),
  street: z.string(),
  description: z.string().nonempty({ message: "Description is required." }),
  s3_keys: z
    .string({ required_error: "Image is required." })
    .array()
    .nonempty({ message: "Image is required." }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email address." }),
});
