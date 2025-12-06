import csv
import json

# Mapping for prices based on budget level
price_map = {
    'budget': 800,
    'mid-range': 1500,
    'luxury': 2500
}

# Image URLs for cities
image_urls = {
    'Tashkent': 'https://images.unsplash.com/photo-1567427217543-7c3f0533cf63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    'Samarkand': 'https://images.unsplash.com/photo-1584837403392-39b23aa8c9e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    'Khiva': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    'Bishkek': 'https://images.unsplash.com/photo-1466427573353-ca4d2ca1ee6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    'Almaty': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
}

def get_title(city, country):
    return f"{city}, {country} - Tour Package"

def get_description(response, attractions):
    if response:
        return response[:150] + "..." if len(response) > 150 else response
    return f"Explore the attractions including {attractions}. Experience the rich culture and natural beauty of this destination."

def get_price(budget_level):
    return price_map.get(budget_level, 1500)

def get_image_url(city):
    return image_urls.get(city, 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60')

# Read original CSV
input_file = 'dataset/central_asia_travel_dataset_500.csv'
output_file = 'dataset/central_asia_travel_dataset_enhanced.csv'

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    
    reader = csv.DictReader(infile)
    
    # New fieldnames with added columns
    fieldnames = ['id', 'title', 'description', 'price', 'image_url', 
                  'country', 'location', 'category', 'instruction', 'input', 
                  'response', 'attractions', 'best_time', 'halal_info', 
                  'budget_level', 'suggested_days', 'tags']
    
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    
    for row in reader:
        city = row['city']
        country = row['country']
        budget = row.get('budget_level', 'mid-range')
        response = row.get('response', '')
        attractions = row.get('attractions', '')
        
        new_row = {
            'id': row['id'],
            'title': get_title(city, country),
            'description': get_description(response, attractions),
            'price': get_price(budget),
            'image_url': get_image_url(city),
            'country': country,
            'location': city,
            'category': row.get('category', ''),
            'instruction': row.get('instruction', ''),
            'input': row.get('input', ''),
            'response': response,
            'attractions': attractions,
            'best_time': row.get('best_time', ''),
            'halal_info': row.get('halal_info', ''),
            'budget_level': budget,
            'suggested_days': row.get('suggested_days', ''),
            'tags': row.get('tags', '')
        }
        
        writer.writerow(new_row)

print("✓ Enhanced CSV created: central_asia_travel_dataset_enhanced.csv")
print("✓ New columns added: title, description, price, image_url, location")
