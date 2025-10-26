import { forwardRef } from "react";
import { Link, NavLink, type LinkProps, type NavLinkProps } from "react-router-dom";

import { useViewTransitionsEnabled } from "@/lib/viewTransitions";

type TransitionLinkProps = LinkProps & { viewTransition?: boolean };

type TransitionNavLinkProps = NavLinkProps & { viewTransition?: boolean };

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  { viewTransition, ...props },
  ref
) {
  const allowTransitions = useViewTransitionsEnabled();
  const resolvedViewTransition = viewTransition ?? allowTransitions;

  return <Link ref={ref} {...props} viewTransition={resolvedViewTransition} />;
});

export const TransitionNavLink = forwardRef<HTMLAnchorElement, TransitionNavLinkProps>(
  function TransitionNavLink({ viewTransition, ...props }, ref) {
    const allowTransitions = useViewTransitionsEnabled();
    const resolvedViewTransition = viewTransition ?? allowTransitions;

    return <NavLink ref={ref} {...props} viewTransition={resolvedViewTransition} />;
  }
);
