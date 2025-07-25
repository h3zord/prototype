import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex items-center text-lg", className)}
        {...props}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.href ? (
              <a
                href={item.href}
                className="text-white hover:underline hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRightIcon className="mx-2 h-4 w-4 text-white" />
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
