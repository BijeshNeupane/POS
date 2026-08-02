import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company_name: z.string().trim().min(1, "Company name is required"),
  first_name: z.string().trim().min(1, "First name is required"),
  middle_name: z.string().trim().optional(),
  last_name: z.string().trim().min(1, "Last name is required"),
  contact_no: z.string().trim().min(1, "Contact number is required"),
  address: z.string().trim().min(1, "Address is required"),
  purpose: z.string().trim().min(1, "Purpose is required"),
});

export type SignupFormInputs = z.infer<typeof signupSchema>;
