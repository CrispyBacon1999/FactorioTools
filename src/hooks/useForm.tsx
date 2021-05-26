import { useState } from "react";

export type InputArguments = {
  required?: false;
  regex?: RegExp | string;
};

export function useForm() {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const register = (name: string, args: InputArguments) => {};
}
