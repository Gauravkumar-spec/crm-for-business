import * as Yup from "yup";
import { commonFields } from "./commonFields";

export const agentValidationSchema = Yup.object({
    ...commonFields,
    address: Yup.string().when("$isEdit", {
        is: true,
        then: (schema) => {
            
            schema.notRequired().nullable();
        },
        otherwise: (schema) => {
            
            schema.required("Address is required");
        },
    }),
    city: Yup.string().required("City is required"),
    area: Yup.string().required("Area is required"),

    // profile: Yup.mixed()
    //   .required("Profile image is required")
    //   .test("fileType", "Only JPG, JPEG, PNG files are allowed", (value) => {
    //     if (!value) return false; // Required check
    //     if (typeof value === "string") return true; // Allow existing image in edit mode
    //     return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    //   })
    //   .test("fileSize", "File size must be less than 5MB", (value) => {
    //     if (!value || typeof value === "string") return true; // Skip check for string
    //     return value.size <= 5 * 1024 * 1024; // 5MB
    //   }),
});
