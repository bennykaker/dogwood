import DogwoodLogo from './DogwoodLogo'

export default function Nav() {
  return (
    <nav className="bg-navy-600 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <DogwoodLogo size={32} white />
          <span className="font-serif text-2xl text-white leading-none">
            Dogwood
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold text-coral-200 bg-navy-700 border border-navy-500 rounded-full px-4 py-1">
            British Columbia
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
            <span className="text-base text-navy-200 font-medium hidden sm:inline">Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
