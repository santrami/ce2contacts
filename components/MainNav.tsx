"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  Building2,
  Network,
  PlusCircle
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Activities",
    icon: Calendar,
    href: "/activities",
    color: "text-violet-500",
    children: [
      {
        label: "New Activity",
        href: "/activities/new",
        icon: PlusCircle,
      },
    ]
  },
  {
    label: "Project Participants",
    icon: Users,
    href: "/project-participants",
    color: "text-pink-700",
  },
  {
    label: "Network Contacts",
    icon: Network,
    href: "/network-contacts",
    color: "text-yellow-600",
  },
  {
    label: "New Contact",
    icon: UserPlus,
    href: "/newContact",
    color: "text-orange-700",
  },
  {
    label: "New Organization",
    icon: Building2,
    href: "/newOrganization",
    color: "text-emerald-500",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-4 bg-gray-800 p-4 rounded-lg mb-8">
      {routes.map((route) => (
        <div key={route.href} className="relative group">
          <Link
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === route.href
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            <Button
              variant={pathname === route.href ? "default" : "ghost"}
              className="w-full justify-start"
            >
              {route.icon && <route.icon className={cn("mr-2 h-4 w-4", route.color)} />}
              {route.label}
            </Button>
          </Link>

          {route.children && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {route.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-gray-600",
                      pathname === child.href
                        ? "text-white bg-gray-600"
                        : "text-gray-200"
                    )}
                  >
                    <div className="flex items-center">
                      {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                      {child.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}