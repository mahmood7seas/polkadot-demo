/** @format */

import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, ""> {
  label?: string;
  name: string;
  required?: boolean;
  errorMessageName?: string;
}

const InputField: FC<InputProps> = ({
  label,
  className = "",
  name,
  required,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="font-semibold text-xs ">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        required={required}
        className={classNames(
          `outline-none bg-[#151515] px-3 py-2 text-sm text-text-color font-bold w-full rounded no-spinner  ${className}`
        )}
        name={name}
        id={name}
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
        {...rest}
      />
    </div>
  );
};

export { InputField };
