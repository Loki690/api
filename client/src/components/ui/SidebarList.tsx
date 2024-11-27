import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SidebarListProps {
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function SidebarList({
  isActive,
  children,
  className,
}: SidebarListProps) {
  return (
    <div
      className={twMerge(
        `nav-link link ${
          isActive ? 'bg-sky-500 text-white rounded-[8px]' : ''
        }`,
        className
      )}
    >
      {children}
    </div>
  );
}
