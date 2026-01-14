"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ComponentProps } from "react";

export function NavLink(props: ComponentProps<typeof Link>) {
  const segments = useSelectedLayoutSegments();
  const active = `/${segments.join("/")}` === props.href;

  return <Link {...props} data-active={active ? "" : undefined} />;
}
