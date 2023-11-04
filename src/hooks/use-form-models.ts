import { ObjectSchema } from "yup";

export type Callback<T> = {
  [key in keyof T]?: (value: any) => void;
};

export interface Field {
  [key: string]: FieldItem | FieldItem[];
}

export interface FieldItem {
  ref: HTMLInputElement | HTMLSelectElement;
}

export interface Error {
  [key: string]: string[];
}
export interface UseFormParameterModel<T> {
  validationScheme?: ObjectSchema<any>;
  initialValues?: T;
}
