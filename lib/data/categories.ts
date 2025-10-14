export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
}

// Utiliser les catégories existantes
export const categories = [
  {
    id: "clothing",
    name: "Vêtements",
    subcategories: [
      { id: "tops", name: "Hauts" },
      { id: "bottoms", name: "Bas" },
      { id: "dresses", name: "Robes" },
      { id: "outerwear", name: "Vêtements d'extérieur" },
      { id: "activewear", name: "Vêtements de sport" },
      { id: "swimwear", name: "Maillots de bain" },
      { id: "underwear", name: "Sous-vêtements" },
      { id: "sleepwear", name: "Vêtements de nuit" },
      { id: "costumes", name: "Costumes" },
      { id: "uniforms", name: "Uniformes" },
      { id: "adaptive", name: "Vêtements adaptés" },
      { id: "gender-neutral", name: "Vêtements non genrés" },
      { id: "plus-size", name: "Grandes tailles" },
    ],
  },
  {
    id: "jewelry",
    name: "Bijoux",
    subcategories: [
      { id: "necklaces", name: "Colliers" },
      { id: "bracelets", name: "Bracelets" },
      { id: "earrings", name: "Boucles d'oreilles" },
      { id: "rings", name: "Bagues" },
      { id: "body-jewelry", name: "Bijoux de corps" },
      { id: "anklets", name: "Bracelets de cheville" },
      { id: "brooch", name: "Broches" },
      { id: "pride-jewelry", name: "Bijoux Pride" },
    ],
  },
  // ... autres catégories existantes ...

  // Nouvelles catégories
  {
    id: "mode-accessoires",
    name: "🌈 Mode & Accessoires",
    subcategories: [
      { id: "vetements-affirmatifs", name: "Vêtements affirmatifs & queer-friendly" },
      { id: "vetements-fluides", name: "Vêtements fluides & non genrés" },
      { id: "lingerie-inclusive", name: "Lingerie inclusive (binders, tucking, packers, menstruation inclusive)" },
      { id: "vetements-post-op", name: "Vêtements adaptés post-op & transition" },
      { id: "costumes-performance", name: "Costumes & performance (drag, voguing, ballroom)" },
      { id: "mode-fierte", name: "Mode fierté & militante" },
      { id: "chaussures-inclusives", name: "Chaussures pour toustes" },
      { id: "grandes-petites-tailles", name: "Grandes tailles & petites tailles" },
      { id: "talons-inclusifs", name: "Talons pour toutes identités" },
      { id: "chaussures-dysphorie", name: "Chaussures adaptées à la dysphorie" },
    ],
  },
  // ... autres nouvelles catégories ...
]

