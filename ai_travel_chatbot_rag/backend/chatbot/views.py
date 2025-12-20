# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .inference import TravelChatbot

# Initialize chatbot once (so it doesn't reload on every request)
chatbot = TravelChatbot(r"C:\Users\hp\ai_travel_chatbot_rag\backend\chatbot\dataset.json")

@api_view(['POST'])
def chat_with_ai(request):
    user_query = request.data.get("query", "")
    if not user_query:
        return Response({"error": "No query provided"}, status=400)
    
    # Use the chat() method of TravelChatbot
    answer = chatbot.chat(user_query)
    
    return Response({"reply": answer})
