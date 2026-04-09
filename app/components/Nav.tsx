import DogwoodLogo from './DogwoodLogo'

export default function Nav() {
  return (
    <nav style={{ backgroundColor: '#142e20', borderBottom: '1px solid #1e4a30' }}>
      <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <DogwoodLogo size={36} white />
          <span className="font-serif text-2xl" style={{ color: '#f5f0e8' }}>Dogwood</span>
        </div>
        <div className="sm:ml-6" style={{ color: '#8ab89a', fontSize: '15px', fontStyle: 'italic' }}>
          We don&apos;t answer your insurance questions. We help you ask better ones.
        </div>
      </div>
    </nav>
  )
}
