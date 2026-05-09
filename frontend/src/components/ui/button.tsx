import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    // These styles could be extracted to Tailwind classes
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      borderRadius: "8px",
      fontFamily: "IBM Plex Sans, sans-serif",
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      border: "1px solid transparent",
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? "100%" : "auto",
    };

    const sizeStyles = {
      sm: { padding: "6px 10px", fontSize: "0.75rem" },
      md: { padding: "8px 14px", fontSize: "0.8125rem" },
      lg: { padding: "10px 16px", fontSize: "0.875rem", fontWeight: 600 },
    };

    const variantStyles = {
      primary: {
        background: "var(--accent-green)",
        color: "#0d1117",
        borderColor: "var(--accent-green)",
      },
      secondary: {
        background: "var(--bg-elevated)",
        color: "var(--text-primary)",
        borderColor: "var(--border)",
      },
      outline: {
        background: "transparent",
        color: "var(--text-primary)",
        borderColor: "var(--border)",
      },
      danger: {
        background: "var(--accent-red)",
        color: "#fff",
        borderColor: "var(--accent-red)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
        borderColor: "transparent",
      },
    };

    const mergedStyle = {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };

    return (
      <button
        ref={ref}
        className={className}
        style={mergedStyle}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
