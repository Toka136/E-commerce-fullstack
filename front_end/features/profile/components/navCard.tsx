import { ChevronRight, CreditCard, FileText, LogOut, MapPin, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "My Orders", icon: FileText },
  { label: "Payment Methods", icon: CreditCard },
  { label: "Shipping Addresses", icon: MapPin },
  { label: "Account Settings", icon: Settings },
];
export const NavCard=()=>{
    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-outline" />
                </button>
              ))}

              <hr className="my-2 border-outline-variant/40" />

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-error transition hover:bg-error-container/40"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
    )
}