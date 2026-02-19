export function CollectionLinks() {
  const collections = [
    {
      title: "Skin Types",
      items: ["Dry skin", "Oily skin", "Combination skin", "Normal skin"],
    },
    {
      title: "Popular Brands",
      items: [
        "Medicube",
        "Anua",
        "Cosrx",
        "Skin 1004 Centella",
        "The Ordinary",
        "Some By Mi",
        "Cetaphil",
        "Beauty of Joseon",
      ],
    },
    {
      title: "Health & Supplements",
      items: ["Collagen", "Vitamins", "Supplement"],
    },
  ]

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-6">
      <div className="flex flex-col gap-4 rounded-lg border border-[#eee] bg-white p-5 shadow-xs">
        {collections.map((collection) => (
          <div
            key={collection.title}
            className="flex flex-col gap-2 border-b border-[#f5f5f5] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline"
          >
            <h3 className="min-w-[140px] text-sm font-bold text-[#333]">
              {collection.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {collection.items.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-[#666] hover:text-coupang-blue hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
