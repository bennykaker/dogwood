import DogwoodLogo from './DogwoodLogo'

export default function Nav() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <DogwoodLogo size={30} />
          <span className="font-serif text-2xl text-gray-900 leading-none">
            Dogwood
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* BC pill */}
          <span className="text-xs font-semibold text-coral-600 bg-coral-50 border border-coral-200 rounded-full px-3 py-1">
            British Columbia
          </span>
          {/* Online indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
