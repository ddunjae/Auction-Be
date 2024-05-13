import ajvInstance from "../../utils/ajv";
import auth from "../../validate-schemas/auth";

const signUp = {
  type: "object",
  required: ["user_id", "user_pw"],
  properties: {
    user_id: auth.user_id,
    user_pw: auth.user_pw,
    user_name: auth.user_name,
    user_role: auth.user_role,
  },
  errorMessage: {
    required: {
      user_id: "user_id is required!",
      user_pw: "user_pw is required",
    },
  },
  additionalProperties: true,
};

const signIn = {
  type: "object",
  required: ["user_id", "user_pw"],
  properties: {
    user_id: auth.user_id,
    user_pw: auth.user_pw,
    user_name: auth.user_name,
    user_role: auth.user_role,
  },
  errorMessage: {
    required: {
      user_id: "user_id is required!",
      user_pw: "user_pw is required",
    },
  },
  additionalProperties: false,
};

const signUpSchema = ajvInstance.compile(signUp);
const signInSchema = ajvInstance.compile(signIn);
export { signUpSchema, signInSchema };
