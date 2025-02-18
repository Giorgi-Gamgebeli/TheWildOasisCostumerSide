"use client";

import { useFormStatus } from "react-dom";
import { tw } from "../_utils/tw";

type ButtonProps = {
  size?: "small";
  variation?: "primary" | "danger";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  pendingStatus?: React.ReactNode;
  disabled?: boolean;
  ariaLabel: string;
};

function Button({
  size = "small",
  variation = "primary",
  children,
  onClick,
  type,
  disabled,
  pendingStatus,
  ariaLabel,
}: ButtonProps) {
  const sizeStyles = {
    small: tw(`px-4 py-2 text-[1rem] font-semibold uppercase`),
  };

  const variationsStyles = {
    primary: tw(
      `border border-primary-600 bg-primary-700 transition-all duration-300 hover:bg-primary-600`,
    ),
    danger: tw(
      `border-none bg-red-700 text-red-100 transition-all duration-300 hover:bg-red-800`,
    ),
  };

  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      className={`flex items-center justify-center rounded-md text-center shadow-[0_0_0_rgba(0,0,0,0.04)] disabled:cursor-not-allowed ${sizeStyles[size]} ${variationsStyles[variation]} `}
    >
      {pending && pendingStatus ? pendingStatus : children}
    </button>
  );
}

export default Button;
