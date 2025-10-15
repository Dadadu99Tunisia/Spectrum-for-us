import { NextResponse } from "next/server"

export async function GET() {
  // Version simplifiée pour le déploiement
  const mockCategories = [
    {
      id: "clothing",
      name: "Vêtements",
      slug: "vetements",
      description: "Tous types de vêtements",
      icon: "Shirt",
      subcategories: [
        { id: "tops", name: "Hauts", slug: "hauts" },
        { id: "bottoms", name: "Bas", slug: "bas" },
        { id: "dresses", name: "Robes", slug: "robes" },
        { id: "outerwear", name: "Vestes et manteaux", slug: "vestes-manteaux" },
      ],
    },
    {
      id: "accessories",
      name: "Accessoires",
      slug: "accessoires",
      description: "Bijoux, sacs, et autres accessoires",
      icon: "Gem",
      subcategories: [
        { id: "jewelry", name: "Bijoux", slug: "bijoux" },
        { id: "bags", name: "Sacs", slug: "sacs" },
        { id: "hats", name: "Chapeaux", slug: "chapeaux" },
        { id: "scarves", name: "Écharpes", slug: "echarpes" },
      ],
    },
    {
      id: "home",
      name: "Maison",
      slug: "maison",
      description: "Décoration et articles pour la maison",
      icon: "Home",
      subcategories: [
        { id: "decor", name: "Décoration", slug: "decoration" },
        { id: "kitchen", name: "Cuisine", slug: "cuisine" },
        { id: "textiles", name: "Textiles", slug: "textiles" },
      ],
    },
    {
      id: "art",
      name: "Art",
      slug: "art",
      description: "Œuvres d'art originales et impressions",
      icon: "Palette",
      subcategories: [
        { id: "paintings", name: "Peintures", slug: "peintures" },
        { id: "prints", name: "Impressions", slug: "impressions" },
        { id: "sculptures", name: "Sculptures", slug: "sculptures" },
      ],
    },
    {
      id: "beauty",
      name: "Beauté",
      slug: "beaute",
      description: "Produits de beauté et soins personnels",
      icon: "Sparkles",
      subcategories: [
        { id: "skincare", name: "Soins de la peau", slug: "soins-peau" },
        { id: "makeup", name: "Maquillage", slug: "maquillage" },
        { id: "haircare", name: "Soins capillaires", slug: "soins-capillaires" },
      ],
    },
  ]

  return NextResponse.json(mockCategories)
}

export const categories = [
  {
    id: "clothing",
    name: "Vêtements",
    slug: "vetements",
    description: "Tous types de vêtements",
    icon: "Shirt",
    subcategories: [
      { id: "tops", name: "Hauts", slug: "hauts" },
      { id: "bottoms", name: "Bas", slug: "bas" },
      { id: "dresses", name: "Robes", slug: "robes" },
      { id: "outerwear", name: "Vestes et manteaux", slug: "vestes-manteaux" },
    ],
  },
  {
    id: "accessories",
    name: "Accessoires",
    slug: "accessoires",
    description: "Bijoux, sacs, et autres accessoires",
    icon: "Gem",
    subcategories: [
      { id: "jewelry", name: "Bijoux", slug: "bijoux" },
      { id: "bags", name: "Sacs", slug: "sacs" },
      { id: "hats", name: "Chapeaux", slug: "chapeaux" },
      { id: "scarves", name: "Écharpes", slug: "echarpes" },
    ],
  },
  {
    id: "home",
    name: "Maison",
    slug: "maison",
    description: "Décoration et articles pour la maison",
    icon: "Home",
    subcategories: [
      { id: "decor", name: "Décoration", slug: "decoration" },
      { id: "kitchen", name: "Cuisine", slug: "cuisine" },
      { id: "textiles", name: "Textiles", slug: "textiles" },
    ],
  },
  {
    id: "art",
    name: "Art",
    slug: "art",
    description: "Œuvres d'art originales et impressions",
    icon: "Palette",
    subcategories: [
      { id: "paintings", name: "Peintures", slug: "peintures" },
      { id: "prints", name: "Impressions", slug: "impressions" },
      { id: "sculptures", name: "Sculptures", slug: "sculptures" },
    ],
  },
  {
    id: "beauty",
    name: "Beauté",
    slug: "beaute",
    description: "Produits de beauté et soins personnels",
    icon: "Sparkles",
    subcategories: [
      { id: "skincare", name: "Soins de la peau", slug: "soins-peau" },
      { id: "makeup", name: "Maquillage", slug: "maquillage" },
      { id: "haircare", name: "Soins capillaires", slug: "soins-capillaires" },
    ],
  },
]
