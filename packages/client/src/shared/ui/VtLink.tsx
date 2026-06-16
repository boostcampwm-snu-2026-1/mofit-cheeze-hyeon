import { Link, type LinkProps, useNavigate } from "react-router-dom";
import type { NavigateOptions, To } from "react-router-dom";

export function useVtNavigate() {
  const navigate = useNavigate();
  return (to: To | number, options?: NavigateOptions) => {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => navigate(to as To, options));
    } else {
      navigate(to as To, options);
    }
  };
}

export function VtLink({ to, onClick, children, ...props }: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      onClick?.(e);
      if ("startViewTransition" in document) {
        document.startViewTransition(() => navigate(to as string));
      } else {
        navigate(to as string);
      }
    } else {
      onClick?.(e);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
