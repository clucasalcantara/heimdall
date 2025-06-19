"use client";

import {
  FileCode2,
  FileText,
  LayoutDashboard,
  Network,
  Shield,
  Sliders,
  TestTube2,
} from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Rules",
    href: "/rules",
    icon: <Sliders className="h-5 w-5" />,
  },
  {
    title: "Developer",
    href: "/developer",
    icon: <FileCode2 className="h-5 w-5" />,
  },
  {
    title: "Architecture",
    href: "/architecture",
    icon: <Network className="h-5 w-5" />,
  },
  {
    title: "Testing",
    href: "/testing",
    icon: <TestTube2 className="h-5 w-5" />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-primary" />
          <span>Heimdall Security</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            Navigation
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2">
          <div className="rounded-full bg-primary p-1">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium">Heimdall Protection</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
