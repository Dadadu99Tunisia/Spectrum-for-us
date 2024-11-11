import Image from 'next/image'
import Link from 'next/link'
import { categories } from '../utils/categories'

const products = [
  { id: 1, name: 'Gender-Affirming Binder', price: '$39.99', category: 'clothing', image: '/placeholder.svg?height=300&width=300' },
  { id: 2, name: 'Pride Flag Collection', price: '$24.99', category: 'pride-gear', image: '/placeholder.svg?height=300&width=300' },
  { id: 3, name: 'LGBTQIA+ Literature Bundle', price: '$49.99', category: 'books', image: '/placeholder.svg?height=300&width=300' },
  { id: 4, name: 'Rainbow Tote Bag', price: '$29.99', category: 'accessories', image: '/placeholder.svg?height=300&width=300' },
  { id: 5, name: 'Pronoun Pin Set', price: '$14.99', category: 'accessories', image: '/placeholder.svg?height=300&width=300' },
  { id: 6, name: 'Queer Artist Print Series', price: '$79.99', category: 'art', image: '/placeholder.svg?height=300&width=300' },
  { id: 7, name: 'Gender-Neutral Skincare Set', price: '$59.99', category: 'beauty', image: '/placeholder.svg?height=300&width=300' },
  { id: 8, name: 'LGBTQIA+ History Documentary', price: '$19.99', category: 'media', image: '/placeholder.svg?height=300&width=300' },
  { id: 9, name: 'Inclusive Sex Education Guide', price: '$34.99', category: 'education', image: '/placeholder.svg?height=300&width=300' },
]

export default function Shop() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="py-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-center sm:text-5xl md:text-6xl">
            Shop Our Products
          </h1>
          <p className="mt-6 text-xl text-center max-w-3xl mx-auto">
            Discover unique items from LGBTQIA+ creators and allies. Every purchase supports our community.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
            <div className="flex space-x-4">
              <select className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{categories.find(c => c.id === product.category)?.name}</p>
                  <p className="text-gray-900 font-bold">{product.price}</p>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
              Load More Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}