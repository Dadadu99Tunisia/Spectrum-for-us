"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Plus, X, ImageIcon, Upload, Info, CheckCircle } from "lucide-react"
import { categories } from "@/app/api/categories/route"
import { toast } from "@/hooks/use-toast"

export default function ProductForm() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState<{ color: string; size: string; stock: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({})

  // Get subcategories based on selected category
  const subcategories = categories.find((c) => c.id === selectedCategory)?.subcategories || []

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", size: "", stock: 0 }])
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleUpdateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    // For the demo, we add a placeholder image
    setImages([...images, `/placeholder.svg?height=300&width=300&text=Image ${images.length + 1}`])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleAttributeChange = (key: string, value: string) => {
    setAttributes({ ...attributes, [key]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Produit enregistré",
      description: "Votre produit a été enregistré avec succès et est en attente de validation.",
    })

    setIsSubmitting(false)
    // In a real app, redirect to product list or product page
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/vendeur/produits">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Ajouter un Produit</h1>
            <p className="text-muted-foreground">Créez un nouveau produit dans votre boutique</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">
                Informations de base
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Détails et attributs
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-1">
                Images
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex-1">
                Variantes
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">
                SEO
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic">
                <Card>
                  <CardContent className="pt-6">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input id="name" placeholder="Nom du produit" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix (€)</Label>
                          <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comparePrice">Prix barré (optionnel)</Label>
                          <Input id="comparePrice" type="number" min="0" step="0.01" placeholder="0.00" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description courte</Label>
                        <Textarea
                          id="description"
                          placeholder="Brève description de votre produit..."
                          className="h-20"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longDescription">Description détaillée</Label>
                        <Textarea
                          id="longDescription"
                          placeholder="Description détaillée de votre produit..."
                          className="min-h-[200px]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sku">SKU (Référence)</Label>
                          <Input id="sku" placeholder="SKU-001" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="barcode">Code-barres (optionnel)</Label>
                          <Input id="barcode" placeholder="123456789012" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category">Catégorie</Label>
                          <select
                            id="category"
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                            required
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value)
                              setSelectedSubcategory("")
                            }}
                          >
                            <option value="">Sélectionnez une catégorie</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subcategory">Sous-catégorie</Label>
                          <select
                            id="subcategory"
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                            required
                            disabled={!selectedCategory}
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                          >
                            <option value="">Sélectionnez une sous-catégorie</option>
                            {subcategories.map((subcategory) => (
                              <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                        <Input id="tags" placeholder="pride, inclusif, unisexe, etc." />
                      </div>

                      <div className="space-y-2">
                        <Label>Inclusive Tags</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "LGBTQ+",
                            "Non-genré",
                            "Pride",
                            "Trans-friendly",
                            "Accessible",
                            "Écologique",
                            "Éthique",
                            "Fait main",
                            "Adaptatif",
                            "Taille-inclusive",
                          ].map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <input type="checkbox" id={`tag-${tag}`} className="rounded border-gray-300" />
                              <Label htmlFor={`tag-${tag}`} className="text-sm font-normal">
                                {tag}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Attributs spécifiques</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces attributs aident les acheteurs à trouver votre produit et à comprendre ses
                          caractéristiques.
                        </p>

                        {selectedCategory === "clothing" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="material">Matière</Label>
                              <Input
                                id="material"
                                placeholder="Ex: Coton, Polyester, etc."
                                value={attributes.material || ""}
                                onChange={(e) => handleAttributeChange("material", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender">Genre</Label>
                              <select
                                id="gender"
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                value={attributes.gender || ""}
                                onChange={(e) => handleAttributeChange("gender", e.target.value)}
                              >
                                <option value="">Sélectionner</option>
                                <option value="unisex">Unisexe</option>
                                <option value="femme">Femme</option>
                                <option value="homme">Homme</option>
                                <option value="non-binary">Non-binaire</option>
                                <option value="other">Autre</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="season">Saison</Label>
                              <select
                                id="season"
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                value={attributes.season || ""}
                                onChange={(e) => handleAttributeChange("season", e.target.value)}
                              >
                                <option value="">Sélectionner</option>
                                <option value="spring">Printemps</option>
                                <option value="summer">Été</option>
                                <option value="fall">Automne</option>
                                <option value="winter">Hiver</option>
                                <option value="all">Toutes saisons</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="style">Style</Label>
                              <Input
                                id="style"
                                placeholder="Ex: Casual, Formel, etc."
                                value={attributes.style || ""}
                                onChange={(e) => handleAttributeChange("style", e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {selectedCategory === "jewelry" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="material">Matériau</Label>
                              <Input
                                id="material"
                                placeholder="Ex: Or, Argent, etc."
                                value={attributes.material || ""}
                                onChange={(e) => handleAttributeChange("material", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="style">Style</Label>
                              <Input
                                id="style"
                                placeholder="Ex: Moderne, Vintage, etc."
                                value={attributes.style || ""}
                                onChange={(e) => handleAttributeChange("style", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gemstone">Pierre précieuse</Label>
                              <Input
                                id="gemstone"
                                placeholder="Ex: Diamant, Saphir, etc."
                                value={attributes.gemstone || ""}
                                onChange={(e) => handleAttributeChange("gemstone", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="occasion">Occasion</Label>
                              <Input
                                id="occasion"
                                placeholder="Ex: Quotidien, Mariage, etc."
                                value={attributes.occasion || ""}
                                onChange={(e) => handleAttributeChange("occasion", e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* Add conditions for other categories */}

                        {!selectedCategory && (
                          <div className="text-center py-4 text-muted-foreground">
                            Veuillez d'abord sélectionner une catégorie pour voir les attributs spécifiques.
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Attributs inclusifs</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces attributs aident à assurer que votre produit est accessible et convient à diverses
                          communautés.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="inclusive-sizing">Tailles inclusives</Label>
                            <select
                              id="inclusive-sizing"
                              className="w-full px-3 py-2 rounded-md border border-input bg-background"
                              value={attributes.inclusiveSizing || ""}
                              onChange={(e) => handleAttributeChange("inclusiveSizing", e.target.value)}
                            >
                              <option value="">Sélectionner</option>
                              <option value="yes">Oui</option>
                              <option value="no">Non</option>
                              <option value="na">Non applicable</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="accessibility">Caractéristiques d'accessibilité</Label>
                            <select
                              id="accessibility"
                              className="w-full px-3 py-2 rounded-md border border-input bg-background"
                              value={attributes.accessibility || ""}
                              onChange={(e) => handleAttributeChange("accessibility", e.target.value)}
                            >
                              <option value="">Sélectionner</option>
                              <option value="wheelchair">Adapté aux fauteuils roulants</option>
                              <option value="visual">Adapté aux déficiences visuelles</option>
                              <option value="hearing">Adapté aux déficiences auditives</option>
                              <option value="sensory">Adapté aux sensibilités sensorielles</option>
                              <option value="multiple">Plusieurs adaptations</option>
                              <option value="na">Non applicable</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender-affirmation">Affirmation de genre</Label>
                            <select
                              id="gender-affirmation"
                              className="w-full px-3 py-2 rounded-md border border-input bg-background"
                              value={attributes.genderAffirmation || ""}
                              onChange={(e) => handleAttributeChange("genderAffirmation", e.target.value)}
                            >
                              <option value="">Sélectionner</option>
                              <option value="yes">Oui</option>
                              <option value="no">Non</option>
                              <option value="na">Non applicable</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="eco-friendly">Écologique</Label>
                            <select
                              id="eco-friendly"
                              className="w-full px-3 py-2 rounded-md border border-input bg-background"
                              value={attributes.ecoFriendly || ""}
                              onChange={(e) => handleAttributeChange("ecoFriendly", e.target.value)}
                            >
                              <option value="">Sélectionner</option>
                              <option value="yes">Oui</option>
                              <option value="no">Non</option>
                              <option value="partially">Partiellement</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Certifications et éthique</h3>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Commerce équitable",
                            "Biologique",
                            "Végan",
                            "Cruelty-free",
                            "Fait main",
                            "Fabriqué localement",
                            "Matériaux recyclés",
                            "Emballage écologique",
                          ].map((cert) => (
                            <div key={cert} className="flex items-center space-x-2">
                              <input type="checkbox" id={`cert-${cert}`} className="rounded border-gray-300" />
                              <Label htmlFor={`cert-${cert}`} className="text-sm font-normal">
                                {cert}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additional-certifications">Autres certifications</Label>
                          <Input id="additional-certifications" placeholder="Ex: ISO 14001, B Corp, etc." />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Images du produit</h3>
                        <p className="text-sm text-muted-foreground">
                          Ajoutez des photos haute qualité pour montrer votre produit sous son meilleur jour. Vous
                          pouvez ajouter jusqu'à 10 images.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Produit ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </button>

                              {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-xs py-1 text-center">
                                  Image principale
                                </div>
                              )}
                            </div>
                          ))}

                          {images.length < 10 && (
                            <button
                              className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 hover:bg-muted/50 transition-colors"
                              onClick={handleAddImage}
                            >
                              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Ajouter une image</span>
                            </button>
                          )}
                        </div>

                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>Formats acceptés: PNG, JPG. Taille maximale: 5MB par image.</p>
                          <p>
                            Conseil: Utilisez des images de haute qualité avec un fond neutre et un éclairage uniforme.
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Vidéo du produit (optionnel)</h3>
                        <p className="text-sm text-muted-foreground">
                          Ajoutez une vidéo courte pour montrer votre produit en action.
                        </p>

                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">Glissez-déposez votre vidéo ici ou</p>
                          <Button variant="outline" size="sm">
                            Parcourir
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">MP4 ou MOV. 30 secondes max. 50MB max.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Variantes du produit</h3>
                        <Button onClick={handleAddVariant} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une variante
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Les variantes permettent de proposer différentes options pour un même produit, comme différentes
                        couleurs ou tailles.
                      </p>

                      {variants.length === 0 ? (
                        <div className="text-center py-8 border rounded-md bg-muted/20">
                          <p className="text-muted-foreground mb-2">Aucune variante ajoutée</p>
                          <Button onClick={handleAddVariant} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une variante
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {variants.map((variant, index) => (
                            <div key={index} className="border rounded-md p-4 relative">
                              <button
                                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                                onClick={() => handleRemoveVariant(index)}
                              >
                                <X className="h-4 w-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`variant-${index}-color`}>Couleur</Label>
                                  <Input
                                    id={`variant-${index}-color`}
                                    value={variant.color}
                                    onChange={(e) => handleUpdateVariant(index, "color", e.target.value)}
                                    placeholder="Ex: Rouge, Bleu, etc."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`variant-${index}-size`}>Taille</Label>
                                  <Input
                                    id={`variant-${index}-size`}
                                    value={variant.size}
                                    onChange={(e) => handleUpdateVariant(index, "size", e.target.value)}
                                    placeholder="Ex: S, M, L, etc."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`variant-${index}-stock`}>Stock</Label>
                                  <Input
                                    id={`variant-${index}-stock`}
                                    type="number"
                                    min="0"
                                    value={variant.stock}
                                    onChange={(e) =>
                                      handleUpdateVariant(index, "stock", Number.parseInt(e.target.value) || 0)
                                    }
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`variant-${index}-sku`}>SKU spécifique</Label>
                                  <Input id={`variant-${index}-sku`} placeholder="SKU-001-VAR" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`variant-${index}-price`}>Prix spécifique (optionnel)</Label>
                                  <Input
                                    id={`variant-${index}-price`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Laissez vide pour utiliser le prix de base"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900 flex gap-2">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800 dark:text-blue-300">Astuce:</p>
                          <p className="text-blue-700 dark:text-blue-400">
                            Si votre produit n'a pas de variantes, les acheteurs pourront commander le produit tel que
                            décrit dans les informations de base.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Optimisation pour les moteurs de recherche</h3>
                        <p className="text-sm text-muted-foreground">
                          Ces informations aident votre produit à être mieux référencé dans les moteurs de recherche.
                        </p>

                        <div className="space-y-2">
                          <Label htmlFor="meta-title">Titre SEO (Meta Title)</Label>
                          <Input id="meta-title" placeholder="Titre optimisé pour les moteurs de recherche" />
                          <p className="text-xs text-muted-foreground">Recommandé: 50-60 caractères</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meta-description">Description SEO (Meta Description)</Label>
                          <Textarea
                            id="meta-description"
                            placeholder="Description optimisée pour les moteurs de recherche..."
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground">Recommandé: 150-160 caractères</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="url-handle">URL du produit</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                              spectrumforus.com/produit/
                            </span>
                            <Input id="url-handle" className="rounded-l-none" placeholder="nom-du-produit" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Utilisez des tirets pour séparer les mots. Évitez les caractères spéciaux.
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Amélioration de la visibilité</h3>

                        <div className="space-y-2">
                          <Label htmlFor="alt-text">Texte alternatif pour l'image principale</Label>
                          <Input id="alt-text" placeholder="Description de l'image pour les lecteurs d'écran" />
                          <p className="text-xs text-muted-foreground">
                            Important pour l'accessibilité et le référencement des images.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="search-keywords">Mots-clés de recherche</Label>
                          <Input id="search-keywords" placeholder="mots, clés, séparés, par, virgules" />
                          <p className="text-xs text-muted-foreground">
                            Ces mots-clés ne sont pas visibles mais aident votre produit à être trouvé dans la
                            recherche.
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-100 dark:border-green-900 flex gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-green-800 dark:text-green-300">Astuce SEO:</p>
                          <p className="text-green-700 dark:text-green-400">
                            Incluez des mots-clés pertinents dans votre titre et votre description, mais gardez un
                            langage naturel. Évitez le bourrage de mots-clés, qui peut nuire au référencement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Statut et Visibilité</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select id="status" className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                    <option value="hidden">Caché</option>
                  </select>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="featured" className="mt-1" />
                  <Label htmlFor="featured" className="font-normal">
                    Mettre en avant sur la page d'accueil
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="new" className="mt-1" />
                  <Label htmlFor="new" className="font-normal">
                    Marquer comme nouveau produit
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Inventaire et Prix</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock global</Label>
                  <Input id="stock" type="number" min="0" placeholder="0" />
                  <p className="text-xs text-muted-foreground">
                    Ce stock sera utilisé si vous n'utilisez pas de variantes.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="track-inventory" className="mt-1" />
                  <Label htmlFor="track-inventory" className="font-normal">
                    Suivre l'inventaire
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="allow-backorders" className="mt-1" />
                  <Label htmlFor="allow-backorders" className="font-normal">
                    Autoriser les commandes même en rupture de stock
                  </Label>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="tax-class">Classe de taxe</Label>
                  <select id="tax-class" className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option value="standard">Standard (20%)</option>
                    <option value="reduced">Réduite (10%)</option>
                    <option value="super-reduced">Super réduite (5.5%)</option>
                    <option value="zero">Zéro (0%)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Livraison</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (g)</Label>
                  <Input id="weight" type="number" min="0" placeholder="0" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="length">Longueur (cm)</Label>
                    <Input id="length" type="number" min="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Largeur (cm)</Label>
                    <Input id="width" type="number" min="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Hauteur (cm)</Label>
                    <Input id="height" type="number" min="0" placeholder="0" />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="free-shipping" className="mt-1" />
                  <Label htmlFor="free-shipping" className="font-normal">
                    Livraison gratuite pour ce produit
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
