import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProductDetailClient from "./product-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch product
  const { data: productData, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !productData) {
    notFound()
  }

  // Fetch vendor profile separately
  let vendor = null
  if (productData.vendor_id) {
    const { data: vendorData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, bio')
      .eq('id', productData.vendor_id)
      .single()
    vendor = vendorData
  }

  const product = { ...productData, vendor }

  // Get vendor shipping settings
  const { data: shippingSettings } = await supabase
    .from('vendor_shipping_settings')
    .select('*')
    .eq('vendor_id', product.vendor_id)
    .single()

  // Get related products from same vendor
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('id, name, price, image_url, currency')
    .eq('vendor_id', product.vendor_id)
    .neq('id', id)
    .gt('stock', 0)
    .limit(4)

  return (
    <ProductDetailClient 
      product={product} 
      shippingSettings={shippingSettings}
      relatedProducts={relatedProducts || []}
    />
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single()

  if (!product) {
    return {
      title: 'Produit non trouve',
    }
  }

  return {
    title: `${product.name} | Spectrum for Us`,
    description: product.description,
  }
}
