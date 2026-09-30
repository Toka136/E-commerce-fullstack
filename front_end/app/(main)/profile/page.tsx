import { Package, Star, Heart } from "lucide-react";
import { getProfileApi } from "@/features/profile/api/getProfile";
import EditProfileButton from "@/features/profile/components/editProfileButton";

// Stats are not part of the user payload yet, so they stay constant for now.
const STATS = [
  { label: "Orders Placed", value: 24, icon: Package },
  { label: "Book Reviews", value: 12, icon: Star },
  { label: "Wishlist Items", value: 8, icon: Heart },
];

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function ProfilePage() {
  const { data: user } = await getProfileApi();
  const displayName = capitalize(user.userName);

  // Only render personal-info fields that actually exist on the user object.
  const personalInfoFields: { label: string; value: string }[] = [
    { label: "Full Name", value: displayName },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phoneNumber || "Not provided" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 text-center shadow-sm"
          >
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-on-surface">{value}</span>
            <span className="text-sm text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>

      {/* Personal information */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-on-surface">
            Personal Information
          </h3>
          <EditProfileButton user={user} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {personalInfoFields.map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1.5 text-xs font-medium text-on-surface-variant">
                {label}
              </p>
              <div className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}