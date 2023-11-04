import { object } from "yup";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Callback,
  Field,
  FieldItem,
  Error,
  UseFormParameterModel,
} from "./use-form-models";

function useForm<T extends { [key: string]: any }>(
  params: UseFormParameterModel<T> = {
    validationScheme: object(),
    initialValues: {} as T,
  }
) {
  const fields: Field = {};
  const [errors, setErrors] = useState<Error>();
  const callBacksOnFieldChange = useRef<Callback<T>>({});
  useEffect(() => {
    setTimeout(() => {
      for (let item in params.initialValues) {
        const field = fields[item];
        if (Array.isArray(field)) {
          field.forEach((f) => {
            if (
              params.initialValues &&
              f.ref.value === params.initialValues[item]
            ) {
              (f.ref as HTMLInputElement).checked = true;
            }
          });
        } else {
          if (field.ref instanceof HTMLInputElement) {
            field.ref.defaultValue = params.initialValues[item];
          } else {
            field.ref.value = params.initialValues[item];
          }
        }
      }
    }, 0);
  }, [params.initialValues, fields]);
  const register = (name: string) => {
    return {
      onChange: (e: any) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        const callBack = callBacksOnFieldChange.current[name];
        if (callBack) {
          callBack(value);
        }
      },
      ref: (ref: HTMLSelectElement | HTMLInputElement | null) => {
        if (!ref) return;
        if (ref.type !== "radio") {
          fields[name] = { ref };
        } else {
          if (!fields[name]) {
            fields[name] = [];
          }
          (fields[name] as FieldItem[]).push({ ref });
        }
      },
      onBlur: (e: any) => {
        const target = e.target;
        const targetName = target.name;
        const targetValue = target.value;
        return validateAt(targetName, targetValue);
      },
      name,
    };
  };

  const getValues = () => {
    const formValues: any = {};
    for (let name in fields) {
      const fieldItem = fields[name];
      if (Array.isArray(fieldItem)) {
        fieldItem.forEach((f) => {
          if ((f.ref as HTMLInputElement).checked) {
            formValues[name] = f.ref.value;
          }
        });
      } else {
        const fieldItemType = fieldItem.ref.type;
        if (fieldItemType === "checkbox") {
          if ((fieldItem.ref as HTMLInputElement).checked) {
            formValues[name] = fieldItem.ref.value;
          }
        } else {
          formValues[name] = fieldItem.ref.value;
        }
      }
    }
    return formValues as T;
  };

  const clearError = (name: string) => {
    const field = fields[name];
    if (Array.isArray(field)) {
      field.forEach((f) => {
        f.ref.classList.remove("error");
      });
    } else {
      field.ref.classList.remove("error");
    }
    setErrors((prevErrors) => {
      const errors = { ...prevErrors };
      delete errors[name];
      return errors;
    });
  };

  const settErros = (name: string, e: any) => {
    if (!e.errors) return;
    const field = fields[name];
    if (Array.isArray(field)) {
      field.forEach((f) => {
        f.ref.classList.add("error");
      });
    } else {
      field.ref.classList.add("error");
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: e.errors }));
  };

  const validateAt = async (name: string, value: any) => {
    if (!params.validationScheme) return;
    try {
      const validationResult = params.validationScheme.validateSyncAt(
        name,
        getValues()
      );
      clearError(name);
    } catch (e: any) {
      settErros(name, e);
    }
  };

  const validate = () => {
    if (!params.validationScheme) return;
    const values = getValues();
    for (let name in fields) {
      try {
        params.validationScheme.validateSyncAt(name, values);
        clearError(name);
      } catch (e: any) {
        settErros(name, e);
      }
    }
  };

  const handleSubmit = (submitCallback: Function, e: any) => {
    e.preventDefault();
    validate();
    submitCallback(getValues());
  };

  const onChange = useCallback(
    (name: keyof T, cb: (value: any) => void) => {
      callBacksOnFieldChange.current[name] = cb;
    },
    [callBacksOnFieldChange]
  );

  return {
    register,
    handleSubmit,
    getValues,
    onChange,
    errors,
  };
}

export default useForm;
