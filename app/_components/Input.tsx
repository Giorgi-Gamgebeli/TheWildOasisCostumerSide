"use client";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  type?: string;
  name: Path<T>;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  register: UseFormRegister<T>;
  className?: string;
  errors: FieldErrors;
};

function Input<T extends FieldValues>({
  type,
  name,
  disabled,
  placeholder,
  defaultValue,
  register,
  className,
  errors,
}: InputProps<T>) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        {...register(name)}
        className={className}
      />

      <span className="mt-4 text-red-600 font-medium block">
        {errors[name] && (errors[name].message as string)}
      </span>
    </>
  );
}

export default Input;
