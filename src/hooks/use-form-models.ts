export type Callbacks<T> = {
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
