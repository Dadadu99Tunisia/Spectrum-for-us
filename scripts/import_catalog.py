import csv
import requests
import json
from datetime import datetime

# URL of the CSV catalog
CATALOG_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Catalogue_SpectrumForUs_Complet_2025-RO9qnl23uh57oqJ1iH3KKex1n9iMO7.csv"

def fetch_and_parse_catalog():
    """Fetch the CSV catalog and parse it"""
    print("Fetching catalog from URL...")
    response = requests.get(CATALOG_URL)
    response.raise_for_status()
    
    # Parse CSV
    lines = response.text.splitlines()
    reader = csv.DictReader(lines)
    
    products = []
    services = []
    
    for row in reader:
        item = {
            'category': row['Catégorie'],
            'subcategory': row['Sous-catégorie'],
            'name': row['Nom'],
            'description': row['Description'],
            'type': row['Type (produit/service)'],
            'added_value': row['Valeur ajoutée'],
            'inclusivity': row['Inclusivité'],
            'materials': row['Matériaux'],
            'manufacturer': row['Fabricant'],
            'price': parse_price(row['Prix suggéré']),
            'tags': row['Tags']
        }
        
        if item['type'].lower() == 'produit':
            products.append(item)
        else:
            services.append(item)
    
    print(f"Parsed {len(products)} products and {len(services)} services")
    return products, services

def parse_price(price_str):
    """Extract numeric price from string like '85 €'"""
    import re
    match = re.search(r'(\d+(?:[.,]\d+)?)', price_str)
    if match:
        return float(match.group(1).replace(',', '.'))
    return 0.0

def generate_sql_inserts(products, services):
    """Generate SQL INSERT statements"""
    
    sql_statements = []
    
    # Note: You'll need to replace 'VENDOR_UUID_HERE' with actual vendor UUIDs
    # This could be done by creating a default vendor or mapping manufacturers to vendors
    
    sql_statements.append("-- Insert Products")
    sql_statements.append("-- Note: Replace 'VENDOR_UUID_HERE' with actual vendor UUID from profiles table\n")
    
    for product in products:
        description = product['description'].replace("'", "''")
        name = product['name'].replace("'", "''")
        category = product['category'].replace("'", "''")
        
        sql = f"""INSERT INTO public.products (name, description, price, currency, category, stock, vendor_id, image_url)
VALUES (
  '{name}',
  '{description}',
  {product['price']},
  'EUR',
  '{category}',
  100,
  'VENDOR_UUID_HERE',
  '/placeholder.svg?height=400&width=400'
);"""
        sql_statements.append(sql)
    
    sql_statements.append("\n-- Insert Services")
    for service in services:
        description = service['description'].replace("'", "''")
        name = service['name'].replace("'", "''")
        category = service['category'].replace("'", "''")
        
        sql = f"""INSERT INTO public.services (name, description, price, currency, category, vendor_id, image_url)
VALUES (
  '{name}',
  '{description}',
  {service['price']},
  'EUR',
  '{category}',
  'VENDOR_UUID_HERE',
  '/placeholder.svg?height=400&width=400'
);"""
        sql_statements.append(sql)
    
    return '\n\n'.join(sql_statements)

def main():
    try:
        products, services = fetch_and_parse_catalog()
        
        # Generate SQL
        sql_content = generate_sql_inserts(products, services)
        
        # Write to file
        output_file = 'scripts/006_import_catalog_data.sql'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- Auto-generated catalog import\n")
            f.write("-- Generated at: " + datetime.now().isoformat() + "\n\n")
            f.write(sql_content)
        
        print(f"\nSQL file generated: {output_file}")
        print("\nIMPORTANT: Before running this SQL:")
        print("1. Create a vendor profile in your database")
        print("2. Replace 'VENDOR_UUID_HERE' with the actual vendor UUID")
        print("3. Run the SQL script in your Supabase SQL editor")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
