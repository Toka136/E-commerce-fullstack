export default function Loading(){
return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-4 px-4 py-8">
      <div className="h-6 w-40 rounded bg-surface-container" />
      <div className="h-24 rounded-2xl bg-surface-container" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 rounded-2xl bg-surface-container lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-surface-container" />
      </div>
    </div>
  );}