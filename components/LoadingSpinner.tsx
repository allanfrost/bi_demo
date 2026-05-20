export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-[#1e3a5f]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e3a5f]" />
      <p className="text-sm font-medium">Analyserer nøgletal...</p>
    </div>
  )
}
