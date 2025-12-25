# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
import importlib
import threading

# Lazy-loaded chatbot instance and lock
_chatbot_instance = None
_chatbot_lock = threading.Lock()


def _get_chatbot():
    """Lazily import and initialize the TravelChatbot.
    This prevents heavy ML libraries from blocking Django startup at import time.
    The first request will trigger model loading (may take time).
    """
    global _chatbot_instance
    if _chatbot_instance is None:
        with _chatbot_lock:
            if _chatbot_instance is None:
                import os
                dataset_path = os.path.join(os.path.dirname(__file__), 'dataset.json')
                
                # Try to load the full AI model first
                try:
                    mod = importlib.import_module('chatbot.inference')
                    TravelChatbot = getattr(mod, 'TravelChatbot')
                    _chatbot_instance = TravelChatbot(dataset_path)
                    print("✅ Full AI chatbot loaded successfully")
                except Exception as e:
                    # Fall back to simple chatbot (no ML dependencies required)
                    print(f"⚠️ Full AI model not available: {e}")
                    print("✅ Using simple chatbot (no ML required)")
                    try:
                        simple_mod = importlib.import_module('chatbot.simple_inference')
                        SimpleTravelChatbot = getattr(simple_mod, 'SimpleTravelChatbot')
                        _chatbot_instance = SimpleTravelChatbot(dataset_path)
                    except Exception as simple_error:
                        # Last resort fallback
                        print(f"❌ Simple chatbot also failed: {simple_error}")
                        class FallbackBot:
                            def __init__(self):
                                self.name = "FallbackTravelBot"

                            def chat(self, user_input):
                                q = (user_input or "").lower()
                                if any(x in q for x in ["hi", "hello", "hey"]):
                                    return "Hi — the chatbot system is not available right now, but I can provide basic Central Asia travel tips. Ask about a country or city."
                                if "best places" in q or "places" in q or "attractions" in q:
                                    return "Try asking a city name, e.g. 'best places in samarkand' — I have dataset-driven suggestions."
                                if "itinerary" in q or "plan" in q:
                                    return "For itineraries, include a city and number of days, e.g. '3 day itinerary for bishkek'."
                                return "Sorry — the chatbot failed to initialize. Provide a city/country and I'll try to answer from a small fallback dataset."

                        _chatbot_instance = FallbackBot()
                        import logging
                        import traceback
                        print(f"❌ ALL CHATBOT SYSTEMS FAILED")
                        print(traceback.format_exc())
                        logging.exception('All chatbot systems failed')
    return _chatbot_instance


@api_view(['POST'])
def chat_with_ai(request):
    user_query = request.data.get("query", "")
    if not user_query:
        return Response({"error": "No query provided"}, status=400)

    try:
        chatbot = _get_chatbot()
    except Exception as e:
        return Response({"error": f"Chatbot initialization failed: {e}. Model may be loading or dependencies are missing."}, status=503)

    try:
        answer = chatbot.chat(user_query)
        return Response({"reply": answer})
    except Exception as e:
        return Response({"error": f"Chatbot error: {e}"}, status=500)
