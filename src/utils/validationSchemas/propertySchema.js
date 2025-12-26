import * as Yup from "yup";

export const propertyValidationSchema = Yup.object().shape({
    agent_email: Yup.string().when("$isEditMode", {
        is: true,
        then: (schema) => {
          
          schema.notRequired().nullable()
        },
        otherwise: (schema) => {
          
          schema.email("Invalid email").required("Required")
        },
    }),
    property_type: Yup.string().required("Required"),
    property_category: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
    size_sqft: Yup.number().typeError("Must be a number").required("Required"),
    carpet_area: Yup.number().typeError("Must be a number").required("Required"),
    buildup_area: Yup.number().typeError("Must be a number").required("Required"),
    bhk: Yup.number().typeError("Must be a number").required("Required"),
    floor: Yup.number().typeError("Must be a number").required("Required"),
    total_floor: Yup.number().typeError("Must be a number").required("Required"),
    facing: Yup.string().required("Required"),
    furnishing: Yup.string().required("Required"),
    price: Yup.number().typeError("Must be a number").required("Required"),
    maintenance: Yup.number().typeError("Must be a number").required("Required"),
    expected_value: Yup.number().typeError("Must be a number").required("Required"),
    availability: Yup.string().required("Required"),
    builder: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    covered_parking: Yup.string().required("Required"),
    open_parking: Yup.string().required("Required"),
    bathroom: Yup.string().required("Required"),
    brokerage: Yup.string().required("Required"),
    property_age: Yup.number().typeError("Must be a number").required("Required"),
    facilities: Yup.array().min(1, "Select at least one facility"),
    // images: Yup.array().min(1, "At least one image is required"),
    video: Yup.mixed().nullable(),
});
