"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";

export default function AuthStatus() {
  const { status, data: session } = useSession();
  if (status === "loading") {
    return <Skeleton className="h-9 w-9" />;
  }

  if (status === "unauthenticated") {
    return (
      <Button variant={"ghost"} size={"icon"} asChild>
        <Link href="/auth/signin">
          <LogIn className="w-5 h-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" asChild>
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">My Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signIn()}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
