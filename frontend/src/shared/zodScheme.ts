import * as z from "zod";

export const scheme = z.object({
  title: z.string().min(10, { message: "Please enter more than 10 characters." }),
  is_furnished: z.boolean({ required_error: "Plese select one of the options." }),
  is_pet_friendly: z.boolean({ required_error: "Plese select one of the options." }),
  price: z
    .number({ invalid_type_error: "Number is required." })
    .positive({ message: "Price must be positive number." })
    .int({ message: "Price must be integer." }),
  place_id: z
    .string({ required_error: "Address is required." })
    .min(1, { message: "Address is required." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description is required." }),
  s3_keys: z
    .string({ required_error: "Image is required." })
    .array()
    .nonempty({ message: "Image is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
});

export const filterSchema = z.object({
  price_min: z.nan().or(
    z
      .number()
      .nonnegative({ message: "Price must be greater than or equal to 0." })
      .int({ message: "Price must be integer." }),
  ),
  price_max: z.nan().or(
    z
      .number()
      .positive({ message: "Price must be greater than 0." })
      .int({ message: "Price must be integer." }),
  ),
});
