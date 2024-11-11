import Link from 'next/link'
import { categories } from '../utils/categories'

export default function Join() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="py-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-center sm:text-5xl md:text-6xl">
            Join Spectrum for Us
          </h1>
          <p className="mt-6 text-xl text-center max-w-3xl mx-auto">
            Become a part of our vibrant community of LGBTQIA+ creators and allies.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Creator Application</h2>
            <form className="bg-white shadow-md rounded-lg p-8">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Full Name</label>
                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div className="mb-6">
                <label htmlFor="website" className="block text-gray-700 font-bold mb-2">Website/Portfolio (optional)</label>
                <input type="url" id="website" name="website" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="mb-6">
                <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Primary Product/Service Category</label>
                <select id="category" name="category" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Tell us about your products/services and brand</label>
                <textarea id="description" name="description" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">How do you identify within the LGBTQIA+ community? (optional)</label>
                <div className="space-y-2">
                  {['Lesbian', 'Gay', 'Bisexual', 'Transgender', 'Queer', 'Intersex', 'Asexual', 'Ally', 'Other', 'Prefer not to say'].map((identity) => (
                    <div key={identity} className="flex items-center">
                      <input type="checkbox" id={identity.toLowerCase()} name="identity" value={identity.toLowerCase()} className="mr-2" />
                      <label htmlFor={identity.toLowerCase()}>{identity}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" name="terms" className="mr-2" required />
                  <span>I agree to the <Link href="#" className="text-purple-600 hover:underline">Terms and Conditions</Link></span>
                </label>
              </div>
              <div>
                <button type="submit" className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Join Spectrum for Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Supportive Community',
                description: 'Connect with like-minded creators and customers who value diversity and inclusion.',
              },
              {
                title: 'Powerful Tools',
                description: 'Access our easy-to-use platform to manage your products, orders, and payments.',
              },
              {
                title: 'Marketing Support',
                description: 'Benefit from our marketing efforts to drive traffic and sales to your products.',
              },
              {
                title: 'Fair Compensation',
                description: 'Enjoy competitive commission rates and timely payouts for your sales.',
              },
              {
                title: 'Growth Opportunities',
                description: 'Participate in featured collections, collaborations, and special events to boost your visibility.',
              },
              {
                title: 'Inclusive Policies',
                description: 'Rest assured that our platform upholds values of respect, equality, and representation for all.',
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}