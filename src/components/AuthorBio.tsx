export function AuthorBio({ name, role = "Entertainment Writer" }: { name: string; role?: string }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-black text-black flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-lg dark:text-white">{name}</h3>
          <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">{role}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {name} covers the latest in entertainment news — Netflix, Hollywood, and pop culture — for BuzzScoop readers worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}