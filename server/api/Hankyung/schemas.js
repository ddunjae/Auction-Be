import ajvInstance from "../../utils/ajv";
import filter from "../../validate-schemas/filter";

const option_rank = {
  type: "object",
  required: ["kind"],
  properties: {
    kind: filter.kind_rank,
    company: filter.company_string,
  },
  errorMessage: {
    required: {
      kind: "kind is required'",
    },
  },
  additionalProperties: true,
};
const option_section = {
  type: "object",
  required: ["kind"],
  properties: {
    kind: filter.kind_section,
  },
  errorMessage: {
    required: {
      kind: "kind is required",
    },
  },
  additionalProperties: true,
};

const optionRankSchema = ajvInstance.compile(option_rank);
const optionSectionSchema = ajvInstance.compile(option_section);
export { optionRankSchema, optionSectionSchema };
