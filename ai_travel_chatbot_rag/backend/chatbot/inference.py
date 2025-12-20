"""
RAG-Based Travel Assistant Chatbot
A dataset-driven travel chatbot using embeddings, FAISS, and LLM for natural responses.
"""

import json
import re
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class TravelDatasetManager:
    """Manages loading and querying the travel dataset."""
    
    def __init__(self, dataset_path: str = "dataset.json"):
        self.dataset_path = dataset_path
        self.data = []
        self.countries = set()
        self.cities = set()
        self.city_to_country = {}
        self.load_dataset()
    
    def load_dataset(self):
        """Load and index the dataset."""
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            
            # Build indices
            for entry in self.data:
                country = entry.get('country', '').strip()
                city = entry.get('city', '').strip()
                
                if country:
                    self.countries.add(country.lower())
                if city:
                    self.cities.add(city.lower())
                    self.city_to_country[city.lower()] = country.lower()
            
            print(f"✅ Loaded {len(self.data)} entries from dataset")
            print(f"📍 Countries: {len(self.countries)}, Cities: {len(self.cities)}")
        except FileNotFoundError:
            print(f"❌ Error: {self.dataset_path} not found!")
            self.data = []
    
    def get_all_entries(self) -> List[Dict]:
        """Return all dataset entries."""
        return self.data
    
    def get_entry_by_city(self, city: str) -> Optional[Dict]:
        """Get a specific city entry."""
        city_lower = city.lower()
        for entry in self.data:
            if entry.get('city', '').lower() == city_lower:
                return entry
        return None
    
    def get_entries_by_country(self, country: str) -> List[Dict]:
        """Get all entries for a country."""
        country_lower = country.lower()
        return [e for e in self.data if e.get('country', '').lower() == country_lower]
    
    def is_valid_location(self, location: str) -> bool:
        """Check if location exists in dataset."""
        loc_lower = location.lower()
        return loc_lower in self.countries or loc_lower in self.cities


class RAGRetriever:
    """Handles embedding generation and FAISS-based retrieval."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print("🔄 Loading embedding model...")
        self.embedding_model = SentenceTransformer(model_name)
        self.index = None
        self.documents = []
        self.metadata = []
        
    def build_index(self, dataset: List[Dict]):
        """Build FAISS index from dataset."""
        print("🔄 Building FAISS index...")
        
        self.documents = []
        self.metadata = []
        
        # Create searchable text representations
        for entry in dataset:
            # Create comprehensive text for each entry
            doc_text = self._create_document_text(entry)
            self.documents.append(doc_text)
            self.metadata.append(entry)
        
        # Generate embeddings
        embeddings = self.embedding_model.encode(self.documents, show_progress_bar=True)
        embeddings = np.array(embeddings).astype('float32')
    
        # Build FAISS index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)
        
        print(f"✅ Index built with {len(self.documents)} documents")
    
    def _create_document_text(self, entry: Dict) -> str:
        """Create searchable text from dataset entry."""
        parts = []
        
        # Basic info
        parts.append(f"Country: {entry.get('country', '')}")
        parts.append(f"City: {entry.get('city', '')}")
        
        # Places
        if 'places' in entry:
            parts.append(f"Places: {', '.join(entry['places'])}")
        
        # Halal food
        if 'halal_food' in entry:
            parts.append(f"Halal food: {', '.join(entry['halal_food'])}")
        
        # Mosques
        if 'mosques' in entry:
            parts.append(f"Mosques: {', '.join(entry['mosques'])}")
        
        # Hotels
        if 'hotels' in entry:
            hotels = entry['hotels']
            for category in ['budget', 'midrange', 'luxury']:
                if category in hotels:
                    parts.append(f"{category.capitalize()} hotels: {', '.join(hotels[category])}")
        
        # Other info
        for key in ['transport', 'safety_tips', 'culture', 'season', 'activities', 'current_events']:
            if key in entry:
                value = entry[key]
                if isinstance(value, list):
                    parts.append(f"{key}: {', '.join(value)}")
                else:
                    parts.append(f"{key}: {value}")
        
        # Budget info
        if 'budget' in entry:
            budget = entry['budget']
            parts.append(f"Budget: {budget.get('budget', '')}, Midrange: {budget.get('midrange', '')}, Luxury: {budget.get('luxury', '')}")
        
        return ". ".join(parts)
    
    def retrieve(self, query: str, top_k: int = 3) -> List[Tuple[Dict, float]]:
        """Retrieve top-k relevant entries for a query."""
        if self.index is None:
            return []
        
        # Encode query
        query_embedding = self.embedding_model.encode([query])
        query_embedding = np.array(query_embedding).astype('float32')
        
        # Search
        distances, indices = self.index.search(query_embedding, top_k)
        
        # Return results with metadata
        results = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx < len(self.metadata):
                results.append((self.metadata[idx], float(dist)))
        
        return results


class QueryAnalyzer:
    """Analyzes user queries to extract intent and parameters."""
    
    INTENT_PATTERNS = {
        'itinerary': r'\b(itinerary|plan|trip|tour|visit|schedule|days?)\b',
        'budget': r'\b(budget|cost|price|expensive|cheap|afford)\b',
        'hotels': r'\b(hotel|accommodation|stay|lodging|sleep)\b',
        'food': r'\b(food|restaurant|eat|dining|halal|cuisine)\b',
        'mosques': r'\b(mosque|masjid|prayer|islamic)\b',
        'places': r'\b(place|attraction|sight|visit|see|tourism|landmark)\b',
        'transport': r'\b(transport|taxi|bus|train|travel|get around)\b',
        'safety': r'\b(safe|safety|dangerous|secure|crime)\b',
        'culture': r'\b(culture|tradition|custom|etiquette|respect)\b',
        'season': r'\b(season|weather|climate|when to visit|best time)\b',
        'general': r'\b(tell me|information|about|know|describe)\b'
    }
    
    def __init__(self, dataset_manager: TravelDatasetManager):
        self.dataset_manager = dataset_manager
    
    def analyze(self, query: str) -> Dict[str, Any]:
        """Analyze query and extract structured information."""
        query_lower = query.lower()
        
        return {
            'query': query,
            'location': self._extract_location(query_lower),
            'intent': self._detect_intent(query_lower),
            'days': self._extract_days(query_lower),
            'budget_preference': self._extract_budget_preference(query_lower),
            'is_in_scope': self._is_in_scope(query_lower)
        }
    
    def _extract_location(self, query: str) -> Optional[str]:
        """Extract city or country from query."""
        # Check cities first (more specific)
        for city in self.dataset_manager.cities:
            if city in query:
                return city
        
        # Then check countries
        for country in self.dataset_manager.countries:
            if country in query:
                return country
        
        return None
    
    def _detect_intent(self, query: str) -> List[str]:
        """Detect user intent from query."""
        intents = []
        for intent, pattern in self.INTENT_PATTERNS.items():
            if re.search(pattern, query, re.IGNORECASE):
                intents.append(intent)
        
        return intents if intents else ['general']
    
    def _extract_days(self, query: str) -> Optional[int]:
        """Extract number of days from query."""
        # Patterns: "3 days", "three days", "3-day", etc.
        patterns = [
            r'(\d+)\s*days?',
            r'(\d+)-day',
            r'for\s+(\d+)\s+days?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_budget_preference(self, query: str) -> Optional[str]:
        """Extract budget preference (budget/midrange/luxury)."""
        if re.search(r'\b(cheap|budget|low cost|affordable)\b', query):
            return 'budget'
        elif re.search(r'\b(luxury|luxurious|high end|premium|expensive)\b', query):
            return 'luxury'
        elif re.search(r'\b(mid|middle|moderate|midrange)\b', query):
            return 'midrange'
        return None
    
    def _is_in_scope(self, query: str) -> bool:
        return self._extract_location(query) is not None



class ItineraryGenerator:
    """Generates trip itineraries based on dataset information."""
    
    def __init__(self, dataset_manager: TravelDatasetManager):
        self.dataset_manager = dataset_manager
    
    def generate(self, location: str, days: int, budget_pref: Optional[str] = None) -> str:
        """Generate a day-by-day itinerary."""
        # Get location data
        entry = self.dataset_manager.get_entry_by_city(location)
        
        if not entry:
            # Try as country
            entries = self.dataset_manager.get_entries_by_country(location)
            if not entries:
                return f"❌ No data available for {location}"
            entry = entries[0]  # Use first city
        
        city = entry.get('city', location)
        country = entry.get('country', '')
        
        # Determine budget
        budget_pref = budget_pref or 'midrange'
        budget_info = entry.get('budget', {})
        daily_budget = budget_info.get(budget_pref, 'N/A')
        
        # Build itinerary
        itinerary_parts = []
        itinerary_parts.append(f"🗓️ **{days}-Day Itinerary for {city}, {country}**\n")
        itinerary_parts.append(f"💰 Estimated Daily Budget: {daily_budget}\n")
        itinerary_parts.append(f"📅 Best Season: {entry.get('season', 'N/A')}\n")
        
        # Get attractions
        places = entry.get('places', [])
        activities = entry.get('activities', [])
        mosques = entry.get('mosques', [])
        
        # Distribute activities across days
        all_activities = places + activities + mosques
        activities_per_day = max(1, len(all_activities) // days)
        
        for day in range(1, days + 1):
            itinerary_parts.append(f"\n**Day {day}:**")
            
            # Morning
            start_idx = (day - 1) * activities_per_day
            end_idx = min(start_idx + activities_per_day, len(all_activities))
            day_activities = all_activities[start_idx:end_idx]
            
            if day_activities:
                itinerary_parts.append(f"  🌅 Morning: Visit {day_activities[0]}")
                
                if len(day_activities) > 1:
                    itinerary_parts.append(f"  ☀️ Afternoon: Explore {day_activities[1]}")
                else:
                    itinerary_parts.append(f"  ☀️ Afternoon: Leisure time / Local exploration")
                
                # Evening
                halal_food = entry.get('halal_food', [])
                if halal_food:
                    restaurant = halal_food[min(day - 1, len(halal_food) - 1)]
                    itinerary_parts.append(f"  🌙 Evening: Dinner at {restaurant}")
                else:
                    itinerary_parts.append(f"  🌙 Evening: Dinner at local restaurant")
        
        # Add practical info
        itinerary_parts.append(f"\n**Practical Information:**")
        itinerary_parts.append(f"🚕 Transport: {entry.get('transport', 'N/A')}")
        itinerary_parts.append(f"🏨 Recommended Hotels ({budget_pref}): {', '.join(entry.get('hotels', {}).get(budget_pref, ['N/A']))}")
        itinerary_parts.append(f"⚠️ Safety: {entry.get('safety_tips', 'N/A')}")
        itinerary_parts.append(f"🕌 Culture: {entry.get('culture', 'N/A')}")
        
        return "\n".join(itinerary_parts)


class ResponseGenerator:
    """Generates natural language responses using LLM."""
    
    def __init__(self, model_name: str = "Qwen/Qwen2.5-0.5B-Instruct"):
        print("🔄 Loading LLM for response generation...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None
            )
            if self.device == "cpu":
                self.model = self.model.to(self.device)
            print(f"✅ LLM loaded on {self.device}")
        except Exception as e:
            print(f"⚠️ Could not load LLM: {e}")
            self.model = None
    
    def generate_response(
        self,
        context: str,
        query: str,
        max_length: int = 150,
        in_scope: bool = True
    ) -> str:
        """Generate natural language response."""

        # 🔒 HARD STOP for out-of-scope queries
        if not in_scope:
            return "❌ Sorry, I only have travel info for Central Asian countries in my dataset."

        if self.model is None:
            return context  # fallback
        
        prompt = f"""You are a travel assistant specialized in Central Asian countries:
        Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, and Uzbekistan.

        STRICT RULES:
        - Answer ONLY the user's question.
        - Use ONLY the information provided below.
        - Do NOT add, summarize, or mention other cities.
        - Do NOT include extra explanations.
        - If the question is about hotels, list hotels only.


Information:
{context}

User Question: {query}

Answer:"""
        
        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=1024
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_length,
                    temperature=0.1,
                    do_sample=False,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            if "Answer:" in response:
                response = response.split("Answer:")[-1].strip()
            
            return response

        except Exception as e:
            print(f"⚠️ Error generating response: {e}")
            return context



class TravelChatbot:
    """Main chatbot orchestrator."""
    
    def __init__(self, dataset_path: str = "dataset.json"):
        print("🚀 Initializing Travel Chatbot...")
        
        # Initialize components
        self.dataset_manager = TravelDatasetManager(dataset_path)
        self.retriever = RAGRetriever()
        self.query_analyzer = QueryAnalyzer(self.dataset_manager)
        self.itinerary_generator = ItineraryGenerator(self.dataset_manager)
        self.response_generator = ResponseGenerator()
        
        # Build index
        self.retriever.build_index(self.dataset_manager.get_all_entries())
        
        # Conversation context
        self.context = {
            'last_location': None,
            'conversation_history': []
        }
        
        print("✅ Chatbot ready!\n")
    
    def chat(self, user_input: str) -> str:
        """Process user input and generate response."""
        # Analyze query
        analysis = self.query_analyzer.analyze(user_input)
        
        # Check if in scope
        if analysis['location'] is None:
           return "❌ I only provide travel information for Central Asian cities in my dataset."

        
        # Use context if no location specified
        location = analysis['location'] or self.context.get('last_location')
        
        if not location and 'itinerary' in analysis['intent']:
            return "📍 Please specify a city or country for the itinerary."
        
        # Update context
        if location:
            self.context['last_location'] = location
        
        # Handle itinerary generation
        if 'itinerary' in analysis['intent'] and analysis['days']:
            return self.itinerary_generator.generate(
                location,
                analysis['days'],
                analysis['budget_preference']
            )
        
        # Retrieve relevant information
        results = self.retriever.retrieve(user_input, top_k=1)
        
        if not results:
           return "❌ No information found in the dataset for this location."


        
        # Build context from retrieved results
        context_parts = []
        for entry, score in results:
            city = entry.get('city', 'Unknown')
            country = entry.get('country', 'Unknown')
            context_parts.append(f"\n--- {city}, {country} ---")
            
            # Add relevant fields based on intent
            intents = analysis['intent']
            
            if 'places' in intents or 'general' in intents:
                context_parts.append(f"Places: {', '.join(entry.get('places', []))}")
            
            if 'food' in intents or 'general' in intents:
                context_parts.append(f"Halal Food: {', '.join(entry.get('halal_food', []))}")
            
            if 'mosques' in intents or 'general' in intents:
                context_parts.append(f"Mosques: {', '.join(entry.get('mosques', []))}")
            
            if 'hotels' in intents or 'general' in intents:
                hotels = entry.get('hotels', {})
                for category in ['budget', 'midrange', 'luxury']:
                    if category in hotels:
                        context_parts.append(f"{category.capitalize()} Hotels: {', '.join(hotels[category])}")
            
            if 'transport' in intents or 'general' in intents:
                context_parts.append(f"Transport: {entry.get('transport', 'N/A')}")
            
            if 'safety' in intents or 'general' in intents:
                context_parts.append(f"Safety: {entry.get('safety_tips', 'N/A')}")
            
            if 'culture' in intents or 'general' in intents:
                context_parts.append(f"Culture: {entry.get('culture', 'N/A')}")
            
            if 'season' in intents or 'general' in intents:
                context_parts.append(f"Best Season: {entry.get('season', 'N/A')}")
            
            if 'budget' in intents or 'general' in intents:
                budget = entry.get('budget', {})
                context_parts.append(f"Budget: {budget.get('budget', 'N/A')}, Midrange: {budget.get('midrange', 'N/A')}, Luxury: {budget.get('luxury', 'N/A')}")
        
        context_text = "\n".join(context_parts)
        
        # Generate natural response
        response = self.response_generator.generate_response(
    context_text,
    user_input,
    in_scope=analysis['is_in_scope']
)

        
        # Store in history
        self.context['conversation_history'].append({
            'user': user_input,
            'bot': response
        })
        
        return response
    
    def reset_context(self):
        """Reset conversation context."""
        self.context = {
            'last_location': None,
            'conversation_history': []
        }


def main():
    """Main chat loop."""
    print("=" * 60)
    print("🌍 Welcome to the RAG Travel Assistant!")
    print("=" * 60)
    print("I can help you with travel information from my dataset.")
    print("Ask me about cities, hotels, mosques, halal food, itineraries, and more!")
    print("Type 'exit' or 'quit' to end the conversation.")
    print("Type 'reset' to start a new conversation.")
    print("=" * 60 + "\n")
    
    # Initialize chatbot
    chatbot = TravelChatbot("dataset.json")
    
    # Chat loop
    while True:
        try:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ['exit', 'quit', 'bye']:
                print("👋 Thank you for using Travel Assistant! Safe travels!")
                break
            
            if user_input.lower() == 'reset':
                chatbot.reset_context()
                print("🔄 Conversation reset. Starting fresh!\n")
                continue
            
            # Get response
            response = chatbot.chat(user_input)
            print(f"\n🤖 Assistant: {response}\n")
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()