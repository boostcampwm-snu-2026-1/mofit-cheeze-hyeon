import { HTMLAttributes } from "react";

type AsProp<T extends keyof JSX.IntrinsicElements> = { as?: T };

function makeTypography<E extends keyof JSX.IntrinsicElements>(
  defaultTag: E,
  className: string
) {
  return function TypographyComponent({
    as,
    className: extra = "",
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & AsProp<keyof JSX.IntrinsicElements>) {
    const Tag = (as ?? defaultTag) as keyof JSX.IntrinsicElements;
    return (
      <Tag className={[className, extra].join(" ")} {...(props as HTMLAttributes<HTMLElement>)}>
        {children}
      </Tag>
    );
  };
}

export const Display = makeTypography(
  "h1",
  "font-sans font-semibold text-[3.75rem] leading-[1.05] tracking-[-1.5px] text-charcoal"
);

export const DisplayAlt = makeTypography(
  "h1",
  "font-sans font-normal text-[3.75rem] leading-[1.00] text-charcoal"
);

export const Heading = makeTypography(
  "h2",
  "font-sans font-semibold text-[3rem] leading-[1.00] tracking-[-1.2px] text-charcoal"
);

export const SubHeading = makeTypography(
  "h3",
  "font-sans font-semibold text-[2.25rem] leading-[1.10] tracking-[-0.9px] text-charcoal"
);

export const CardTitle = makeTypography(
  "h4",
  "font-sans font-normal text-[1.25rem] leading-[1.25] text-charcoal"
);

export const BodyLarge = makeTypography(
  "p",
  "font-sans font-normal text-[1.125rem] leading-[1.38] text-charcoal"
);

export const Body = makeTypography(
  "p",
  "font-sans font-normal text-base leading-normal text-charcoal"
);

export const Caption = makeTypography(
  "p",
  "font-sans font-normal text-sm leading-normal text-muted"
);
