import { z } from "zod"

const nameRegex = /^[A-Za-z][A-Za-z\s'.-]{1,59}$/
const phoneRegex = /^[6-9]\d{9}$/
const pincodeRegex = /^\d{6}$/
const upiRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/

const trimmedString = (message: string, min = 1) =>
  z
    .string()
    .trim()
    .min(min, message)

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password is too long.")
})

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long.")
    .regex(nameRegex, "Enter a valid full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/\d/, "Password must include a number.")
})

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long.")
    .regex(nameRegex, "Enter a valid full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number.")
})

export const addressSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters.")
    .max(60, "Recipient name is too long.")
    .regex(nameRegex, "Enter a valid recipient name."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number."),
  pincode: z.string().trim().regex(pincodeRegex, "Enter a valid 6-digit pincode."),
  locality: trimmedString("Locality is required.", 2).max(80, "Locality is too long."),
  city: trimmedString("City is required.", 2).max(60, "City is too long."),
  state: trimmedString("State is required.", 2).max(60, "State is too long."),
  addressLine: trimmedString("Address is required.", 8).max(160, "Address is too long."),
  landmark: z.string().trim().max(80, "Landmark is too long.").optional().or(z.literal("")),
  type: z
    .string()
    .trim()
    .min(2, "Address type is required.")
    .max(20, "Address type is too long.")
})

export const upiSchema = z.object({
  upiId: z
    .string()
    .trim()
    .toLowerCase()
    .regex(upiRegex, "Enter a valid UPI ID like name@oksbi or number@ybl.")
})

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .max(80, "Search must be 80 characters or fewer.")
})

export type FieldErrors<T extends string> = Partial<Record<T, string>>

export const getFieldErrors = <T extends string>(
  error: z.ZodError
): FieldErrors<T> =>
  error.issues.reduce<FieldErrors<T>>((accumulator, issue) => {
    const path = issue.path[0]

    if (typeof path === "string" && !accumulator[path as T]) {
      accumulator[path as T] = issue.message
    }

    return accumulator
  }, {})
