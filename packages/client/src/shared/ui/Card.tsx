import { forwardRef, type HTMLAttributes } from "react";

type CardRadius = "compact" | "card" | "container";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
}

const radiusStyles: Record<CardRadius, string> = {
  compact: "rounded-compact",
  card: "rounded-card",
  container: "rounded-container",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ radius = "card", className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={["bg-offwhite border border-border", radiusStyles[radius], className].join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={["px-5 pt-5 pb-4", className].join(" ")} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={["px-5 py-4", className].join(" ")} {...props}>
      {children}
    </div>
  )
);
CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={["px-5 pt-4 pb-5 border-t border-border", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";
