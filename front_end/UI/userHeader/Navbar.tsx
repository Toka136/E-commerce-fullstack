"use client";

import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";

export interface NavbarProps {
  /** Number shown on the cart badge. Pass 0 to hide the badge. */
  cartCount?: number;
  /** Called when the hamburger menu button is clicked. */
  onMenuClick?: () => void;
  /** Called when the cart button is clicked. */
  onCartClick?: () => void;
  /** Called when the search form is submitted, with the current query. */
  onSearch?: (query: string) => void;
}

export default function Navbar({
  cartCount = 2,
  onMenuClick,
  onCartClick,
  onSearch,
}: NavbarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <header className="relative w-full border-b border-tertiary-300 bg-white px-8">
      {/* Signature accent line */}
      <div className="h-0.75 w-full bg-linear-to-r from-primary-500 to-secondary-500" />

      <nav className="flex items-center gap-3 px-8 py-3 sm:gap-4 sm:px-6 flex-wrap">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-[#3F5FBD] transition-colors hover:bg-tertiary-200 hover:text-primary-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          <span className="select-none whitespace-nowrap font-headline text-lg font-bold text-[#3F5FBD]">
            LibroDiscovery
          </span>
        </div>

        {/* Center: search */}
        <form
          onSubmit={handleSubmit}
          role="search"
          className="mx-auto md:w-full w-[50%] md:max-w-md max-w-lg flex-1"
        >
          <label htmlFor="catalog-search" className="sr-only">
            Search by title, author
          </label>
          <div className="relative">
            <Search
              size={18}
              strokeWidth={2}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              id="catalog-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full rounded-full bg-[#EFF4FF] py-2.5 pl-10 pr-4 font-body text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5FBD]"
            />
          </div>
        </form>

        {/* Right: cart */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onCartClick}
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative rounded-full bg-transparent p-2.5 text-[#3F5FBD] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            <ShoppingBag size={18} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#9550FF] font-label text-[10px] font-bold leading-none text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
