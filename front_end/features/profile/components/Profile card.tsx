
"use client";
import { LayoutGrid, Pencil, UserIcon } from "lucide-react"
import { userProfile } from "../types/profile"
import { useState } from "react";
import Image from "next/image";
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
export const ProfileCard=({user}:{user:userProfile})=>{    
      const avatarUrl = user.image ? `http://localhost:4000/api/Uploads/${user.image}` : undefined;
        const displayName = capitalize(user.userName);

    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {avatarUrl? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-surface-container-lowest"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-container text-on-surface-variant ring-4 ring-surface-container-lowest">
                    <UserIcon className="h-10 w-10" />
                  </div>
                )}
             
              </div>

              <h2 className="mt-4 text-lg font-semibold text-on-surface">
                {displayName}
              </h2>
              <p className="text-sm text-on-surface-variant">{user.email}</p>
            </div>

           
          </div>
    )
}