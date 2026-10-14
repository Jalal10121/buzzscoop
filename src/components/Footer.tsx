import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 sm:mt-16 w-full">
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-black text-white mb-3">
                BUZZ<span className="text-yellow-500">SCOOP</span>
              </h3>
              <p className="text-sm mb-3">
                Your daily fix of entertainment news — Netflix, Hollywood, Marvel, and Pop Culture.
              </p>
              <Link href="/newsletter" className="inline-block text-sm font-bold text-yellow-400 hover:text-yellow-300">
                📬 Subscribe to Newsletter →
              </Link>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/category/netflix" className="hover:text-yellow-400">Netflix</Link></li>
                <li><Link href="/category/hollywood" className="hover:text-yellow-400">Hollywood</Link></li>
                <li><Link href="/category/marvel" className="hover:text-yellow-400">Marvel</Link></li>
                <li><Link href="/category/music" className="hover:text-yellow-400">Music</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-yellow-400">About</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-yellow-400">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-yellow-400">Terms</Link></li>
                <li><Link href="/dmca" className="hover:text-yellow-400">DMCA</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/feed.xml" className="hover:text-yellow-400">RSS Feed</a></li>
                <li><a href="/sitemap-index.xml" className="hover:text-yellow-400">Sitemap</a></li>
                <li><Link href="/follow" className="hover:text-yellow-400">Follow Us</Link></li>
                <li><Link href="/sponsored" className="hover:text-yellow-400">Advertise</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
            <p className="text-center sm:text-left">© {year} BuzzScoop. All rights reserved.</p>
            <div className="flex gap-3 sm:gap-4">
              <a href="/feed.xml" className="hover:text-yellow-400">RSS</a>
              <a href="/sitemap-index.xml" className="hover:text-yellow-400">Sitemap</a>
              <Link href="/follow" className="hover:text-yellow-400">Follow</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}