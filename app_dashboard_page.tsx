'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  LayoutGrid, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Plus,
  Package,
  DollarSign,
  Users
} from 'lucide-react'

// Define the component with proper export syntax
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20spectrum%20(2)-V3cOG91cI8ShMYv9dCVivXIPuSXkpV.png"
              alt="Spectrum for Us"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Overview' },
              { id: 'products', icon: ShoppingBag, label: 'Products' },
              { id: 'orders', icon: Package, label: 'Orders' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === id ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Plus className="h-5 w-5" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Total Sales', value: '$12,426', icon: DollarSign, change: '+16% from last month' },
                  { title: 'Total Orders', value: '256', icon: Package, change: '+12% from last month' },
                  { title: 'Total Products', value: '48', icon: ShoppingBag, change: '+4 new this month' },
                  { title: 'Total Customers', value: '1,024', icon: Users, change: '+8% from last month' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      </div>
                      <stat.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { id: '#12345', customer: 'Alex Johnson', product: 'Pride Flag Collection', amount: '$24.99', status: 'Delivered' },
                        { id: '#12344', customer: 'Sam Smith', product: 'Rainbow Tote Bag', amount: '$29.99', status: 'Processing' },
                        { id: '#12343', customer: 'Jordan Lee', product: 'Pronoun Pin Set', amount: '$14.99', status: 'Shipped' },
                      ].map((order) => (
                        <tr key={order.id} className="border-t">
                          <td className="py-4">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">{order.product}</td>
                          <td className="py-4">{order.amount}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Plus className="h-5 w-5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Price</th>
                        <th className="pb-4">Stock</th>
                        <th className="pb-4">Sales</th>
                        <th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { name: 'Pride Flag Collection', price: '$24.99', stock: 45, sales: 156 },
                        { name: 'Rainbow Tote Bag', price: '$29.99', stock: 32, sales: 98 },
                        { name: 'Pronoun Pin Set', price: '$14.99', stock: 78, sales: 234 },
                      ].map((product, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-4">{product.name}</td>
                          <td className="py-4">{product.price}</td>
                          <td className="py-4">{product.stock}</td>
                          <td className="py-4">{product.sales}</td>
                          <td className="py-4">
                            <button className="text-purple-600 hover:text-purple-700">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <div className="flex space-x-4">
                  <select className="border rounded-lg px-4 py-2">
                    <option>All Orders</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Products</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { id: '#12345', customer: 'Alex Johnson', products: 'Pride Flag Collection', total: '$24.99', status: 'Delivered' },
                        { id: '#12344', customer: 'Sam Smith', products: 'Rainbow Tote Bag', total: '$29.99', status: 'Processing' },
                        { id: '#12343', customer: 'Jordan Lee', products: 'Pronoun Pin Set', total: '$14.99', status: 'Shipped' },
                      ].map((order) => (
                        <tr key={order.id} className="border-t">
                          <td className="py-4">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">{order.products}</td>
                          <td className="py-4">{order.total}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <button className="text-purple-600 hover:text-purple-700">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <select className="border rounded-lg px-4 py-2">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Sales chart will be displayed here</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Pride Flag Collection', sales: 156, revenue: '$3,900' },
                      { name: 'Rainbow Tote Bag', sales: 98, revenue: '$2,940' },
                      { name: 'Pronoun Pin Set', sales: 234, revenue: '$3,510' },
                    ].map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                        <p className="font-medium text-gray-900">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Save Changes
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue="My Awesome Store"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue="seller@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Description
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue="We sell amazing LGBTQIA+ products!"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>Bank Transfer</option>
                      <option>PayPal</option>
                      <option>Stripe</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your account number"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}