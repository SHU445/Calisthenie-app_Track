import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const inputVariants = cva(
  // Base styles martiaux
  "flex w-full bg-martial-surface-1 border border-martial-steel/30 text-martial-highlight placeholder-martial-steel transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "rounded-md",
        rounded: "rounded-lg",
        sharp: "rounded-sm", // Style stencil plus angulaire
        tactical: "rounded-none border-l-4 border-l-martial-danger-accent", // Style militaire
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-13 px-6 text-lg",
      },
      state: {
        default: "",
        error: "border-martial-danger-accent/50 focus:border-martial-danger-accent ring-martial-danger-accent/20",
        success: "border-martial-success/50 focus:border-martial-success ring-martial-success/20",
        warning: "border-martial-warning/50 focus:border-martial-warning ring-martial-warning/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    state,
    type = "text",
    leftIcon,
    rightIcon,
    label,
    helperText,
    errorMessage,
    showPasswordToggle = false,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password")
      : type;
    
    const finalState = errorMessage ? "error" : state;
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!(rightIcon || (showPasswordToggle && type === "password"));

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-display font-semibold text-martial-highlight mb-2 uppercase tracking-wide">
            {label}
            {props.required && (
              <span className="text-martial-danger-accent ml-1">*</span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-martial-steel pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: finalState }),
              hasLeftIcon && "pl-10",
              hasRightIcon && "pr-10",
              isFocused && "shadow-glow-steel",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle && type === "password" ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-martial-steel hover:text-martial-highlight transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent rounded"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              ) : (
                <span className="text-martial-steel pointer-events-none">
                  {rightIcon}
                </span>
              )}
            </div>
          )}

          {/* Focus ring enhancement */}
          {isFocused && (
            <div className="absolute inset-0 rounded-md border-2 border-martial-danger-accent/30 pointer-events-none" />
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <p className={cn(
            "text-xs mt-2 flex items-center",
            errorMessage 
              ? "text-martial-danger-accent" 
              : "text-martial-steel"
          )}>
            {errorMessage && (
              <span className="mr-1">⚠</span>
            )}
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Composants spécialisés
const TimeInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      type="time"
      variant="tactical"
      {...props}
      ref={ref}
    />
  )
);
TimeInput.displayName = "TimeInput";

const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'leftIcon'>>(
  (props, ref) => (
    <Input
      type="search"
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      placeholder="Rechercher..."
      {...props}
      ref={ref}
    />
  )
);
SearchInput.displayName = "SearchInput";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    variant?: 'default' | 'rounded' | 'sharp' | 'tactical';
  }
>(({ className, label, helperText, errorMessage, variant = 'default', ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-display font-semibold text-martial-highlight mb-2 uppercase tracking-wide">
          {label}
          {props.required && (
            <span className="text-martial-danger-accent ml-1">*</span>
          )}
        </label>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          className={cn(
            "flex w-full min-h-[100px] bg-martial-surface-1 border border-martial-steel/30 text-martial-highlight placeholder-martial-steel transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none",
            variant === 'rounded' && "rounded-lg",
            variant === 'sharp' && "rounded-sm",
            variant === 'tactical' && "rounded-none border-l-4 border-l-martial-danger-accent",
            variant === 'default' && "rounded-md",
            "px-4 py-3 text-base",
            errorMessage && "border-martial-danger-accent/50 focus:border-martial-danger-accent ring-martial-danger-accent/20",
            isFocused && "shadow-glow-steel",
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Focus ring enhancement */}
        {isFocused && (
          <div className="absolute inset-0 rounded-md border-2 border-martial-danger-accent/30 pointer-events-none" />
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || errorMessage) && (
        <p className={cn(
          "text-xs mt-2 flex items-center",
          errorMessage 
            ? "text-martial-danger-accent" 
            : "text-martial-steel"
        )}>
          {errorMessage && (
            <span className="mr-1">⚠</span>
          )}
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Input, TimeInput, SearchInput, Textarea, inputVariants };
