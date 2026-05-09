import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, fullWidth = true, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={className}
        style={{
          width: fullWidth ? "100%" : "auto",
          boxSizing: "border-box",
          padding: "9px 12px",
          background: "var(--bg-elevated)",
          border: `1px solid ${error ? "var(--accent-red)" : "var(--border)"}`,
          borderRadius: "8px",
          color: "var(--text-primary)",
          fontSize: "0.875rem",
          fontFamily: "IBM Plex Sans, sans-serif",
          outline: "none",
          transition: "border-color 0.15s ease",
          ...style,
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = "var(--accent-green)";
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = "var(--border)";
          if (props.onBlur) props.onBlur(e);
        }}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
