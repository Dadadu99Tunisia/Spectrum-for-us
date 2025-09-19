import Header from "@/components/header"
import Footer from "@/components/footer"
import Categories from "@/components/categories"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Toutes les Catégories</h1>
          <p className="text-muted-foreground">Explorez tous nos produits par catégorie</p>
        </div>

        <Categories />
      </main>

      <Footer />
    </div>
  )
}
