import { object, string } from "zod";

const userSchema = object({
  name: string({required_error: "Name is required"}),
  email: string({required_error: "Email is required"})
    .email("Not a valid email address"),
  password: string({required_error: "password is required"})
    .min(8, "Password must be at least 8characters long"),
  role: string().refine(val => ['superadmin', 'regular'].includes(val), {
    message: "Role must be either 'superadmin' or 'regular'"
  }).default('regular')
});

export default userSchema;