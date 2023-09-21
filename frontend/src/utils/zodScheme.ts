import * as z from "zod";

const MAX_IMAGE_SIZE = 500000;

// TODO: fix images validation
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
  images: z
    .array(
      z
        .any()
        .refine((files) => files?.[0]?.size <= MAX_IMAGE_SIZE, "Max image size is 5MB"),
    )
    .nonempty({ message: "Image are required." }),
  contact_information: z.object({
    email: z
      .string()
      .nonempty({ message: "Email is required." })
      .email({ message: "Invalid email address." }),
  }),
});
