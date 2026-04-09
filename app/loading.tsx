export default function Loading() {
  return (
    <div className="container mx-auto px-6 md:px-12 pt-24">
      <div className="h-[60vh] w-full rounded-2xl bg-white/5 animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
