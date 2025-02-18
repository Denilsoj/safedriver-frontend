import type { z } from "zod";
import type { driverSchema } from "@/lib/validation/driver";

export type AddressFormData = z.infer<typeof driverSchema.shape.address>;
export type PersonalInfoFormData = z.infer<
	typeof driverSchema.shape.personalInfo
>;
export type DocumentsFormData = z.infer<typeof driverSchema.shape.documents>;
