/* eslint-disable react/prop-types */
import {
  Formik,
  Form,
  useField,
  Field,
  FieldArray,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { TextField as MUITextField } from "formik-mui";

const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  jobType: Yup.string().required("Please select a job type"),
  gender: Yup.string().required("Please select a gender"),
  acceptedTerms: Yup.boolean()
    .required("Required")
    .oneOf([true], "You must accept the terms and conditions"),
  phoneNumbers: Yup.array()
    .of(
      Yup.string()
        .required("Phone number is required")
        .matches(
          PHONE_REGEX,
          "Please enter a valid phone number (e.g., +1234567890)"
        )
    )
    .min(1, "At least one phone number is required")
    .max(5, "Maximum 5 phone numbers allowed"),
  familyMembers: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .min(2, "Name should have at least 2 characters")
          .max(50, "Name cannot exceed 50 characters"),
        relationship: Yup.string()
          .required("Relationship is required")
          .oneOf(
            ["Father", "Mother", "Sibling", "Spouse", "Child", "Other"],
            "Invalid relationship"
          ),
      })
    )
    .min(1, "At least one family member is required")
    .max(10, "Maximum 10 family members allowed"),
});

const AddButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
    {children}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center p-1 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    aria-label="Remove"
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </button>
);

const PhoneNumberArray = ({ values, errors, touched }) => (
  <FieldArray name="phoneNumbers">
    {({ push, remove }) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Phone Numbers
          </label>
        </div>

        <div className="space-y-2">
          {values.phoneNumbers.map((_, index) => (
            <div key={index} className="relative flex items-center gap-2">
              <div className="flex-grow">
                <Field
                  name={`phoneNumbers.${index}`}
                  placeholder="+1234567890"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched?.phoneNumbers?.[index] &&
                    errors?.phoneNumbers?.[index]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name={`phoneNumbers.${index}`}
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              {values.phoneNumbers.length > 1 && (
                <RemoveButton onClick={() => remove(index)} />
              )}
            </div>
          ))}
          {values.familyMembers.length < 10 && (
            <button
              type="button"
              className="mt-2 text-blue-600"
              onClick={() => push("")}
            >
              Add Phone Number
            </button>
          )}
        </div>
      </div>
    )}
  </FieldArray>
);

const FamilyMemberArray = ({ values, errors, touched }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Family Members
    </label>
    <FieldArray name="familyMembers">
      {({ push, remove }) => (
        <div className="space-y-4">
          {values.familyMembers.map((member, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                {/* Name Field */}
                <div className="flex items-center">
                  <Field
                    name={`familyMembers.${index}.name`}
                    placeholder="Enter name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.familyMembers &&
                      errors.familyMembers[index]?.name &&
                      touched.familyMembers &&
                      touched.familyMembers[index]?.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {/* Error message for Name */}
                <ErrorMessage
                  name={`familyMembers.${index}.name`}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                {/* Relationship Select Field */}
                <div className="flex items-center">
                  <Field
                    as="select"
                    name={`familyMembers.${index}.relationship`}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.familyMembers &&
                      errors.familyMembers[index]?.relationship &&
                      touched.familyMembers &&
                      touched.familyMembers[index]?.relationship
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" label="Select relationship" />
                    <option value="Father" label="Father" />
                    <option value="Mother" label="Mother" />
                    <option value="Sibling" label="Sibling" />
                    <option value="Spouse" label="Spouse" />
                    <option value="Child" label="Child" />
                    <option value="Other" label="Other" />
                  </Field>

                  {/* Remove Button */}
                  {values.familyMembers.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:underline focus:outline-none"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Error message for Relationship */}
                <ErrorMessage
                  name={`familyMembers.${index}.relationship`}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          ))}

          {/* Add New Family Member Button */}
          {values.familyMembers.length < 10 && (
            <button
              type="button"
              className="text-blue-600 hover:underline focus:outline-none"
              onClick={() => push({ name: "", relationship: "" })}
            >
              Add Family Member
            </button>
          )}
        </div>
      )}
    </FieldArray>
  </div>
);

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const error = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {props.as === "textarea" ? (
        <textarea
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...field}
          {...props}
        />
      ) : (
        <input
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...field}
          {...props}
        />
      )}

      {error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MyCheckBox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  const error = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          {...field}
          {...props}
        />
        <span className="text-sm text-gray-700">{children}</span>
      </label>
      {error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const error = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const RadioGroup = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  const error = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              {...field}
              value={option.value}
              checked={field.value === option.value}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

const SignupForm = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    setTimeout(() => {
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in your information below
          </p>
        </div>

        <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              address: "",
              jobType: "",
              gender: "",
              acceptedTerms: false,
              phoneNumbers: [""],
              familyMembers: [
                {
                  name: "",
                  relationship: "",
                },
              ],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, errors, touched }) => (
              <Form className="space-y-4">
                <Field
                  component={MUITextField}
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                />

                <TextField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                />

                <TextField
                  label="Address"
                  name="address"
                  as="textarea"
                  placeholder="Enter your full address"
                  rows={3}
                />

                <MySelect label="Job Type" name="jobType">
                  <option value="">Select a job type</option>
                  <option value="designer">Designer</option>
                  <option value="development">Developer</option>
                  <option value="product">Product Manager</option>
                  <option value="other">Other</option>
                </MySelect>

                <RadioGroup
                  label="Gender"
                  name="gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />

                <MyCheckBox name="acceptedTerms">
                  I accept the terms and conditions
                </MyCheckBox>

                <PhoneNumberArray
                  values={values}
                  errors={errors}
                  touched={touched}
                />

                <FamilyMemberArray
                  values={values}
                  errors={errors}
                  touched={touched}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    transition-colors duration-200
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export { SignupForm };
