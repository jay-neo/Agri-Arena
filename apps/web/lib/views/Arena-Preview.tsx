const FOCUS_VISIBLE_OUTLINE = `focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70`;

import clsx from "clsx";
import Link from "next/link";
import React, { ElementType } from "react";

function getFormattedDate(date: Date): string {
  return Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}

export function Arena({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "block mx-2 w-[22rem] rounded-2xl bg-sky-200/80 dark:bg-white/5 p-2 shadow-surface-elevation-low transition duration-300 hover:bg-sky-600 dark:hover:bg-white/10 dark:hover:shadow-surface-elevation-medium",
        FOCUS_VISIBLE_OUTLINE,
      )}
    >
      {children}
    </Link>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="truncate text-xl  transition duration-300 line-clamp-2 ">
      {children}
    </h3>
  );
}

function Icon(props: { icon: ElementType }) {
  return (
    <div className="mt-1 ml-2 shrink-0">
      <props.icon className="w-5 dark:text-rose-100/30 transition-colors hover:text-rose-100/50" />
    </div>
  );
}

function Text({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-xs dark:text-rose-100/70 line-clamp-3">
      {children}
    </p>
  );
}

function Location(props: { icon: ElementType; children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-start items-baseline h-6">
      <div className="mr-1">
        <props.icon className="w-4 dark:text-rose-100/30 transition-colors hover:text-rose-100/50" />
      </div>
      <p className="mt-4 text-sm dark:text-rose-100/70 line-clamp-3">
        {props.children}
      </p>
    </div>
  );
}

function Date(props: { children?: React.ReactNode; date: Date }) {
  return (
    <div className="flex flex-row-reverse">
      <p className="mt-4 text-xs dark:text-rose-100/70 line-clamp-3">
        {props?.children} {getFormattedDate(props.date)}
      </p>
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap space-x-2 text-base dark:text-rose-100/50">
      {children}
    </div>
  );
}

Arena.Title = Title;
Arena.Icon = Icon;
Arena.Text = Text;
Arena.Date = Date;
Arena.Meta = Meta;
Arena.Location = Location;
