export function DonationButton() {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 my-8 text-center">
      <h3 className="text-xl font-black mb-2">☕ Enjoying BuzzScoop?</h3>
      <p className="text-gray-700 text-sm mb-4">
        Your support keeps our news free and ad-light.
      </p>
      <a
        href="https://buymeacoffee.com/buzzscoop"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
      >
        ☕ Buy Us a Coffee
      </a>
    </div>
  );
}