import {ObjectSchema, object} from 'yup'
import {useEffect, useRef, useState} from "react";

function useForm<T extends { [key: string]: any }>(
    validationScheme: ObjectSchema<any> = object(),
    initialValues: T = {} as T
) {
    const fields: Field = {};
    const [errors, setErrors] = useState<Error>();
    const callBacksOnFieldChange = useRef<{ [key: string]: ((value: any) => void) }>({})
    useEffect(() => {
        setTimeout(() => {
            for (let item in initialValues) {
                const field = fields[item];
                if (field instanceof Array) {
                    field.forEach(f => {
                        if (f.ref.value === initialValues[item]) {
                            (f.ref as HTMLInputElement).checked = true;
                        }
                    })
                } else {
                    field.ref.value = initialValues[item];
                }
            }
            if (Object.keys(initialValues).length) {
                validate()
            }
        }, 0)
    }, [initialValues])
    const register = (name: string) => {
        return {
            onChange: (e: any) => {
                const target = e.target;
                const name = target.name;
                const value = target.value;
                if (callBacksOnFieldChange.current[name]) {
                    const callBack = callBacksOnFieldChange.current[name];
                    callBack(value);
                }
            },
            ref: (ref: HTMLSelectElement | HTMLInputElement | null) => {
                if (!ref) return;
                if (ref.type !== 'radio') {
                    fields[name] = {ref};
                } else {
                    if (!fields[name]) {
                        fields[name] = [];
                    }
                    (fields[name] as FieldItem[]).push({ref});
                }
            },
            onBlur: (e: any) => {
                const target = e.target;
                const targetName = target.name;
                const targetValue = target.value;
                return validateAt(targetName, targetValue);
            },
            name
        }
    }

    const getValues = () => {
        const formValues: any = {};
        for (let name in fields) {
            const fieldItem = fields[name];
            if (fieldItem instanceof Array) {
                fieldItem.forEach(f => {
                    if ((f.ref as HTMLInputElement).checked) {
                        formValues[name] = f.ref.value;
                    }
                })
            } else {
                const fieldItemType = fieldItem.ref.type;
                if (fieldItemType === 'checkbox') {
                    if ((fieldItem.ref as HTMLInputElement).checked) {
                        formValues[name] = fieldItem.ref.value;
                    }
                } else {
                    formValues[name] = fieldItem.ref.value;
                }
            }
        }
        return formValues as T;
    }

    const clearError = (name: string) => {
        const field = fields[name];
        if (field instanceof Array) {
            field.forEach(f => {
                f.ref.classList.remove("error");
            })
        } else {
            field.ref.classList.remove("error");
        }
        setErrors(prevErrors => {
            const errors = {...prevErrors};
            delete errors[name];
            return errors;
        })
    }

    const settErros = (name: string, e: any) => {
        if (!e.errors) return;
        const field = fields[name];
        if (field instanceof Array) {
            field.forEach(f => {
                f.ref.classList.remove("error");
            })
        } else {
            field.ref.classList.add("error");
        }
        setErrors(prevErrors => ({...prevErrors, [name]: e.errors}));
    }

    const validateAt = async (name: string, value: any) => {
        try {
            const validationResult = validationScheme.validateSyncAt(name, getValues());
            clearError(name);
        } catch (e: any) {
            settErros(name, e)
        }
    }

    const validate = () => {
        const values = getValues();
        for (let name in fields) {
            try {
                validationScheme.validateSyncAt(name, values);
                clearError(name);
            } catch (e: any) {
                settErros(name, e)
            }
        }
    }

    const handleSubmit = (submitCallback: Function, e: any) => {
        e.preventDefault();
        validate();
        submitCallback(getValues());
    }

    const onChange = (name: string, cb: (value: any) => void) => {
        callBacksOnFieldChange.current[name] = cb
    }

    return {
        register,
        handleSubmit,
        getValues,
        onChange,
        errors,
    };
}

interface Field {
    [key: string]: FieldItem | FieldItem[];

}

interface FieldItem {
    ref: HTMLInputElement | HTMLSelectElement;
}

interface Error {
    [key: string]: string[]
}

export default useForm