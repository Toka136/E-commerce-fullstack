"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { userProfile } from "../types/profile";
import EditProfileModal from "./editProfileModal";


export default function EditProfileButton({ user }: { user: userProfile }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit Profile
      </button>

      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        user={user}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}