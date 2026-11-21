export function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-on-surface">
        {Icon && <Icon className="h-4 w-4 text-on-surface-variant" />}
        {title}
      </h2>
      {children}
    </section>
  );
}