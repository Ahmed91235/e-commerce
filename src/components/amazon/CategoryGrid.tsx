import Link from 'next/link'

interface Category {
  name: string
  image: string
  link: string
}

interface CategoryGridProps {
  title: string
  categories: Category[]
  footerLink?: {
    text: string
    href: string
  }
}

export default function CategoryGrid({ title, categories, footerLink }: CategoryGridProps) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.link}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="mt-2 text-sm font-medium">{category.name}</p>
          </Link>
        ))}
      </div>

      {footerLink && (
        <Link
          href={footerLink.href}
          className="inline-block mt-4 text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
        >
          {footerLink.text}
        </Link>
      )}
    </div>
  )
}
