interface ComparisonRow {
  name: string;
  price: string;
  bestFor: string;
  rating: number;
  url: string;
  highlight?: boolean;
}

export function ComparisonTable({
  title,
  rows,
}: {
  title: string;
  rows: ComparisonRow[];
}) {
  return (
    <div className="my-8 overflow-x-auto">
      <h3 className="text-xl font-black mb-4">{title}</h3>
      <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3 font-bold">Service</th>
            <th className="text-left p-3 font-bold">Price</th>
            <th className="text-left p-3 font-bold">Best For</th>
            <th className="text-left p-3 font-bold">Rating</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className={`border-t border-gray-200 ${
                row.highlight ? "bg-yellow-50" : ""
              }`}
            >
              <td className="p-3 font-bold">
                {row.name}
                {row.highlight && (
                  <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
                    Top Pick
                  </span>
                )}
              </td>
              <td className="p-3">{row.price}</td>
              <td className="p-3 text-gray-600">{row.bestFor}</td>
              <td className="p-3">
                <span className="text-yellow-500">★</span> {row.rating}
              </td>
              <td className="p-3">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-1.5 rounded text-xs"
                >
                  Try Now →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">
        * We may earn commission from links in this table.
      </p>
    </div>
  );
}