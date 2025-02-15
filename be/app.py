from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
CORS(app)

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

RECIPE = {
    "title": "Whole Wheat Blueberry Brownies",
    "ingredients": [
        "flour", "sugar", "cocoa powder", "eggs", "milk", "butter", "baking powder"
    ],
    "steps": [
        "Combine dry ingredients in one bowl, and wet ingredients in another bowl except berries.",
        "Heat the oven to 350 degrees and spray an 8 x 8 x 2-inch pan with cooking spray.",
        "Combine wet and dry ingredients until smooth, then fold in berries.",
        "Pour into baking dish and bake for 20 25 minutes until a toothpick inserted in the center came out clean."
    ]
}

user_state = {
    "current_step": 0,
    "mistakes": []
}

user_history = {}

def answer_question(user_id, user_message):
    """Answer the user's question based on the recipe or general knowledge while keeping conversation history."""
    if user_id not in user_history:
        user_history[user_id] = [
            {"role": "system", "content": f"""
                You are a professional chef specializing in answering recipe-related questions.
                Here is the recipe data:
                {json.dumps(RECIPE, indent=2)}
                
                User's current step: {RECIPE["steps"][user_state['current_step']]}

                Answer questions based only on this recipe and general cooking knowledge. Shorten answers to at most 2 sentences.
            """}
        ]

    # Add user message to history
    user_history[user_id].append({"role": "user", "content": user_message})

    # Call OpenAI API with conversation history
    response = openai.ChatCompletion.create(
        model="gpt-4",
        api_key=OPENAI_API_KEY,
        messages=user_history[user_id]
    )

    bot_response = response["choices"][0]["message"]["content"].strip()

    # Add AI response to history
    user_history[user_id].append({"role": "assistant", "content": bot_response})

    # Limit message history to last 10 messages to save tokens
    user_history[user_id] = user_history[user_id][-10:]

    return bot_response

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests and maintain user history."""
    data = request.json
    user_id = data.get("user_id", "default_user")  # Use a unique identifier for each user (e.g., session ID)
    user_input = data.get("message", "").strip()

    response_text = answer_question(user_id, user_input)
    
    return jsonify({"response": response_text})

@app.route('/get_next_step', methods=['GET'])
def get_next_step():
    """Return the next step in the recipe."""
    next_step = "END"
    if user_state["current_step"] < len(RECIPE["steps"]) - 1:
        user_state["current_step"] += 1
        next_step = RECIPE["steps"][user_state["current_step"]]
    elif user_state["current_step"] == len(RECIPE["steps"]) - 1:
        user_state["current_step"] += 1
    return jsonify({"response": next_step})

@app.route('/get_previous_step', methods=['GET'])
def get_previous_step():
    """Return the previous step in the recipe."""
    previous_step = "START"
    if user_state["current_step"] > 0:
        user_state["current_step"] -= 1
        previous_step = RECIPE["steps"][user_state["current_step"]]
    elif user_state["current_step"] == 0:
        user_state["current_step"] -= 1
    return jsonify({"response": previous_step})

if __name__ == "__main__":
    app.run(debug=True)
