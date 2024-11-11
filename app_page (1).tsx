import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Palette, Heart, Users } from 'lucide-react'

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-purple-100 to-pink-100">
      <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to Spectrum for Us
            </h1>
            <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto">
              A vibrant, inclusive marketplace celebrating the LGBTQIA+ community and its creators.
            </p>
            <div className="mt-10 flex justify-center space-x-6">
              <Link
                href="/join"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Join as Creator
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Makes Us Special
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShoppingBag className="h-8 w-8 text-purple-500" />,
                title: 'Curated Marketplace',
                description: 'Discover unique products and services from LGBTQIA+ creators and allies.',
              },
              {
                icon: <Palette className="h-8 w-8 text-pink-500" />,
                title: 'Diverse Offerings',
                description: 'From gender-affirming clothing to handmade crafts and wellness services.',
              },
              {
                icon: <Heart className="h-8 w-8 text-red-500" />,
                title: 'Community Support',
                description: 'A percentage of each sale goes back into supporting LGBTQIA+ initiatives.',
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: 'Inclusive Platform',
                description: 'A safe space for everyone to express themselves and find representation.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Gender-Affirming Binder', price: '$39.99', image: '/placeholder.svg?height=300&width=300' },
              { name: 'Pride Flag Collection', price: '$24.99', image: '/placeholder.svg?height=300&width=300' },
              { name: 'LGBTQIA+ Literature Bundle', price: '$49.99', image: '/placeholder.svg?height=300&width=300' },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">{product.price}</p>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
              Join Our Community
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12">
              Whether you're a creator looking to showcase your products or a shopper seeking unique items, there's a place for you in our community.
            </p>
            <Link
              href="/join"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Learn More About Joining
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}