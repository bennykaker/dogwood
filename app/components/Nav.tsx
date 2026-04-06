export default function Nav() {
  return (
    <nav className="bg-forest-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-serif text-2xl text-white tracking-wide">
          Dogwood
        </span>
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold text-forest-200 bg-forest-800 border border-forest-600 rounded-full px-4 py-1">
            British Columbia
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
            <span className="text-base text-forest-200 font-medium hidden sm:inline">Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
