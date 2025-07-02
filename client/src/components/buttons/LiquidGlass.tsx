
export default function GlassButton() {
  return (
    <button className="relative overflow-hidden px-6 py-3 rounded-xl bg-glass backdrop-blur-glass border border-white/20 shadow-xl text-white font-semibold transition hover:scale-105 hover:border-white/40">
      <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-40 pointer-events-none" />
      <span className="relative z-10">Click Me</span>
    </button>
  )
}
