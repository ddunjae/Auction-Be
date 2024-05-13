const auth = {
  user_id: {
    type: "string",
    pattern: "^[a-z0-9_.]+$",
    minLength: 5,
    errorMessage: {
      _: "Wrong data in field user_id!",
    },
  },
  user_id2: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field user_id!",
    },
  },
  user_pw: {
    type: "string",
    minLength: 5,
    errorMessage: {
      _: "Wrong data in field password!",
    },
  },
  user_pw2: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field password!",
    },
  },
  email: {
    type: "string",
    format: "email",
    errorMessage: {
      _: "Wrong data in field email!",
    },
  },
  validationCode: {
    type: "string",
    minLength: 4,
    errorMessage: {
      _: "Wrong data in field validationCode!",
    },
  },
  token: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field token!",
    },
  },
  user_name: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field user_name!",
    },
  },
  joinType: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field joinType!",
    },
  },
  emailReceive: {
    type: "boolean",
    errorMessage: {
      _: "Wrong data in field emailReceive!",
    },
  },
  smsReceive: {
    type: "boolean",
    errorMessage: {
      _: "Wrong data in field smsReceive!",
    },
  },
  phone: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field phone!",
    },
  },
  address1: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field address1!",
    },
  },
  address2: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field address2!",
    },
  },
  zipCode: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field zipCode!",
    },
  },
  bankName: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field bankName!",
    },
  },
  bankAccount: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field bankAccount!",
    },
  },
  bankHolderName: {
    type: "string",

    errorMessage: {
      _: "Wrong data in field bankHolderName!",
    },
  },
  snsId: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field snsId!",
    },
  },
  user_role: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field userRole!",
    },
  },
  fieldCheck: {
    type: "string",
    minLength: 1,
    enum: ["email", "userName"],
    errorMessage: {
      _: "Wrong data in field fieldCheck!",
    },
  },
  valueCheck: {
    type: "string",
    minLength: 5,
    errorMessage: {
      _: "Wrong data in field valueCheck!",
    },
  },
  snsAccessTokenOrCode: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field snsAccessTokenOrCode!",
    },
  },
  //   snsType: {
  //     type: "string",
  //     enum: [
  //       ACCOUNT_TYPE.FB,
  //       ACCOUNT_TYPE.GG,
  //       ACCOUNT_TYPE.KAKAO,
  //       ACCOUNT_TYPE.NAVER,
  //     ],
  //     minLength: 1,
  //     errorMessage: {
  //       _: "Wrong data in field snsType!",
  //     },
  //   },
  //   snsTypeCbPhp: {
  //     type: "string",
  //     enum: [ACCOUNT_TYPE.KAKAO, .NAVER],
  //     minLength: 1,
  //     errorMessage: {
  //       _: "Wrong data in field snsType!",
  //     },
  //   },
  accessToken: {
    type: "string",
    minLength: 1,
    errorMessage: {
      _: "Wrong data in field accessToken!",
    },
  },
  birthDate: {
    type: "string",
    minLength: 10,
    anyOf: [
      { format: "date" },
      { pattern: "^([12]d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]d|3[01]))" },
    ],
  },
  //   invoiceType: {
  //     type: "string",
  //     enum: ["", INVOICE_TYPE.ENTERPRISE_TAX, INVOICE_TYPE.PERSONAL_TAX],
  //     errorMessage: {
  //       _: "Wrong data in field invoiceType!",
  //     },
  //   },
  invoiceInfo: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field invoiceInfo!",
    },
  },
  tokenVersionId: {
    type: "string",
    errorMessage: {
      _: "Wrong data in field tokenVersionId!",
    },
  },
};

export default auth;
