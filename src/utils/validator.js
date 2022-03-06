let validator = window["validator"];
export const validateMessage = (val, validate, formData, type) => {
  let result = type == "bool" ? true : "";
  if (!validate.length) {
    return result;
  } else {
    for (let i = 0; i < validate.length; i++) {
      const item = validate[i];
      const fn = validator[item["rule_key"]](val, formData);
      if (!fn) {
        return type == "bool" ? false : item.message;
      }
    }
    return result;
  }
};

export const rules = (val, validate, baseFormData) => {
  return [
    {
      validator: (val) => {
        return validateMessage(val, validate, baseFormData, "bool");
      },
      message: validateMessage(val, validate, baseFormData),
    },
  ];
};
