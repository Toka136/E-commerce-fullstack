export function StockBadge({ stock }: { stock: number }) {
  if (stock < 10) {
    return (
      <span className="bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20 px-3 py-1 rounded-full text-xs font-semibold">
        {stock} Low Stock
      </span>
    );
  }

  if (stock <= 50) {
    return (
      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
        {stock} In Stock
      </span>
    );
  }

  return (
    <span className="bg-[#dce9ff] text-[#444652] border border-[#c4c5d5]/40 px-3 py-1 rounded-full text-xs font-semibold">
      {stock} In Stock
    </span>
  );
}