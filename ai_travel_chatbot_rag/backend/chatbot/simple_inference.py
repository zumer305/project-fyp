"""
Simplified Travel Chatbot without heavy ML dependencies
Provides intelligent responses using the dataset directly
"""

import json
import re
from typing import List, Dict, Any, Optional

class SimpleTravelChatbot:
    """Lightweight chatbot that works without ML models."""
    
    def __init__(self, dataset_path: str):
        """Initialize with dataset."""
        print("🚀 Initializing Simple Travel Chatbot...")
        self.dataset_path = dataset_path
        self.data = []
        self.load_dataset()
        print("✅ Chatbot ready!\n")
    
    def load_dataset(self):
        """Load the travel dataset."""
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"✅ Loaded {len(self.data)} travel entries")
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            self.data = []
    
    def find_location(self, query: str) -> Optional[Dict]:
        """Find location mentioned in query."""
        query_lower = query.lower()
        
        # Search for city or country match
        for entry in self.data:
            city = entry.get('city', '').lower()
            country = entry.get('country', '').lower()
            
            if city and city in query_lower:
                return entry
            if country and country in query_lower:
                return entry
        
        return None
    
    def detect_intent(self, query: str) -> List[str]:
        """Detect what user is asking about."""
        query_lower = query.lower()
        intents = []
        
        if any(word in query_lower for word in ['itinerary', 'plan', 'trip', 'days', 'visit schedule']):
            intents.append('itinerary')
        if any(word in query_lower for word in ['hotel', 'accommodation', 'stay', 'lodging', 'where to stay']):
            intents.append('hotels')
        if any(word in query_lower for word in ['food', 'restaurant', 'eat', 'dining', 'halal', 'cuisine']):
            intents.append('food')
        if any(word in query_lower for word in ['mosque', 'masjid', 'prayer']):
            intents.append('mosques')
        if any(word in query_lower for word in ['place', 'attraction', 'sight', 'visit', 'see', 'tourism', 'landmark', 'best places']):
            intents.append('places')
        if any(word in query_lower for word in ['transport', 'taxi', 'bus', 'train', 'get around']):
            intents.append('transport')
        if any(word in query_lower for word in ['safe', 'safety', 'dangerous']):
            intents.append('safety')
        if any(word in query_lower for word in ['culture', 'tradition', 'custom', 'etiquette']):
            intents.append('culture')
        if any(word in query_lower for word in ['weather', 'season', 'climate', 'when to visit', 'best time']):
            intents.append('season')
        if any(word in query_lower for word in ['budget', 'cost', 'price', 'expensive', 'cheap']):
            intents.append('budget')
        
        if not intents:
            intents.append('general')
        
        return intents
    
    def format_response(self, entry: Dict, intents: List[str], query: str) -> str:
        """Format response based on intent."""
        city = entry.get('city', 'Unknown')
        country = entry.get('country', 'Unknown')
        
        response_parts = [f"📍 **{city}, {country}**\n"]
        
        # Handle specific intents
        if 'hotels' in intents:
            hotels = entry.get('hotels', {})
            response_parts.append("🏨 **Hotels & Accommodation:**")
            if 'budget' in hotels and hotels['budget']:
                response_parts.append(f"• Budget: {', '.join(hotels['budget'])}")
            if 'midrange' in hotels and hotels['midrange']:
                response_parts.append(f"• Mid-range: {', '.join(hotels['midrange'])}")
            if 'luxury' in hotels and hotels['luxury']:
                response_parts.append(f"• Luxury: {', '.join(hotels['luxury'])}")
            response_parts.append("")
        
        if 'food' in intents:
            halal_food = entry.get('halal_food', [])
            if halal_food:
                response_parts.append("🍽️ **Halal Food Options:**")
                for food in halal_food:
                    response_parts.append(f"• {food}")
                response_parts.append("")
        
        if 'mosques' in intents:
            mosques = entry.get('mosques', [])
            if mosques:
                response_parts.append("🕌 **Mosques:**")
                for mosque in mosques:
                    response_parts.append(f"• {mosque}")
                response_parts.append("")
        
        if 'places' in intents or 'general' in intents:
            places = entry.get('places', [])
            if places:
                response_parts.append("🎯 **Top Attractions:**")
                for place in places[:5]:  # Top 5
                    response_parts.append(f"• {place}")
                response_parts.append("")
        
        if 'transport' in intents:
            transport = entry.get('transport', [])
            if transport:
                response_parts.append("🚕 **Transportation:**")
                for option in transport:
                    response_parts.append(f"• {option}")
                response_parts.append("")
        
        if 'safety' in intents:
            safety = entry.get('safety_tips', [])
            if safety:
                response_parts.append("🛡️ **Safety Tips:**")
                for tip in safety:
                    response_parts.append(f"• {tip}")
                response_parts.append("")
        
        if 'culture' in intents:
            culture = entry.get('culture', [])
            if culture:
                response_parts.append("🎭 **Cultural Tips:**")
                for tip in culture:
                    response_parts.append(f"• {tip}")
                response_parts.append("")
        
        if 'season' in intents:
            season = entry.get('season', '')
            if season:
                response_parts.append(f"☀️ **Best Time to Visit:** {season}\n")
        
        if 'budget' in intents:
            budget_info = entry.get('budget', {})
            if budget_info:
                response_parts.append("💰 **Daily Budget Estimates:**")
                if 'budget' in budget_info:
                    response_parts.append(f"• Budget: {budget_info['budget']}")
                if 'midrange' in budget_info:
                    response_parts.append(f"• Mid-range: {budget_info['midrange']}")
                if 'luxury' in budget_info:
                    response_parts.append(f"• Luxury: {budget_info['luxury']}")
                response_parts.append("")
        
        # If general or no specific intent matched, show overview
        if len(intents) == 1 and 'general' in intents:
            # Add a brief overview
            places = entry.get('places', [])
            if places:
                response_parts.append("🎯 **Top Attractions:**")
                for place in places[:3]:
                    response_parts.append(f"• {place}")
                response_parts.append("")
            
            halal_food = entry.get('halal_food', [])
            if halal_food:
                response_parts.append(f"🍽️ **Food:** {', '.join(halal_food[:2])}")
                response_parts.append("")
        
        response_parts.append("💡 Ask me about: hotels, food, mosques, attractions, transport, safety, culture, or budget!")
        
        return "\n".join(response_parts)
    
    def chat(self, user_input: str) -> str:
        """Main chat interface."""
        if not user_input:
            return "Please ask me something about Central Asian travel!"
        
        # Greetings
        if any(word in user_input.lower() for word in ['hi', 'hello', 'hey', 'greetings']):
            return "👋 Hello! I'm your Central Asia travel assistant. Ask me about any city in Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, or Uzbekistan!\n\nTry asking:\n• 'Tell me about Samarkand'\n• 'Best hotels in Bishkek'\n• 'Halal food in Almaty'\n• 'Places to visit in Bukhara'"
        
        # Find location in query
        entry = self.find_location(user_input)
        
        if not entry:
            # List available cities
            cities = [e.get('city', '') for e in self.data if e.get('city')]
            if cities:
                sample_cities = ', '.join(cities[:10])
                return f"❌ I couldn't find that location in my dataset.\n\n🌍 **Available cities:** {sample_cities}, and more!\n\nTry asking about one of these cities."
            return "❌ I couldn't find that location. Please ask about cities in Central Asia (Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, or Uzbekistan)."
        
        # Detect intent
        intents = self.detect_intent(user_input)
        
        # Generate response
        return self.format_response(entry, intents, user_input)
