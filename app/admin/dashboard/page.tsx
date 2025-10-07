export default function AdminDashboardPage() {
  return (
    <section className="bg-[#E5E5E5] rounded-xl p-10 shadow-xl">
      <h1 className="text-3xl font-bold mb-8">Welcome Back, Admin</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 bg-[#fa9130] text-[#1b1b1b] p-6 rounded-lg">
          <h2 className="text-2xl mb-2">Total Players</h2>
          <p className="text-5xl font-bold">Loading...</p>
        </div>

        <div className="flex-1 bg-[#70a2e4] text-[#1b1b1b] p-6 rounded-lg">
          <h2 className="text-2xl mb-2">Total Income</h2>
          <p className="text-5xl font-bold">Loading...</p>
        </div>
      </div>
    </section>
  );
}
