from flask import Flask, jsonify, request
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

RECIPE = {
    "title": "Chocolate Cake",
    "ingredients": [
        "flour", "sugar", "cocoa powder", "eggs", "milk", "butter", "baking powder"
    ],
    "steps": [
        "Preheat the oven to 350°F (175°C).",
        "Mix the dry ingredients together in a large bowl.",
        "Add the wet ingredients and stir until smooth.",
        "Pour the batter into a greased cake pan.",
        "Bake for 30-35 minutes, or until a toothpick comes out clean.",
        "Allow the cake to cool before frosting."
    ]
}

user_state = {
    "current_step": 0,
    "mistakes": []
}

# Tools for AI to call (using OpenAI function calling)
def generate_next_step(current_step):
    """Generate the next step in the recipe."""
    if current_step < len(RECIPE["steps"]):
        return RECIPE["steps"][current_step]
    else:
        return "END"

def generate_previous_step(current_step):
    """Generate the previous step in the recipe."""
    if current_step > 0:
        return RECIPE["steps"][current_step - 1]
    else:
        return "START"

def answer_question(user_input):
    """Answer the user's question based on the recipe or general knowledge."""
    # Here, we will call OpenAI's GPT to answer the question
    response = openai.Completion.create(
        model="gpt-4",
        prompt=f"The user asked: {user_input}. Answer based on the recipe.",
        max_tokens=150
    )
    return response.choices[0].text.strip()

# Function for AI to handle different user inputs
def handle_user_input(user_input):
    """Handle the user input and determine whether to go to next step, previous step, or answer a question."""
    if "next" in user_input:
        user_state["current_step"] = min(user_state["current_step"] + 1, len(RECIPE["steps"]) - 1)
        return generate_next_step(user_state["current_step"])

    elif "previous" in user_input:
        user_state["current_step"] = max(user_state["current_step"] - 1, 0)
        return generate_previous_step(user_state["current_step"])

    else:
        return answer_question(user_input)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '').strip().lower()
    response_text = handle_user_input(user_input)
    
    return jsonify({"response": response_text})

@app.route('/get_next_step', methods=['GET'])
def get_next_step():
    """Return the next step in the recipe."""
    next_step = generate_next_step(user_state["current_step"])
    user_state["current_step"] += 1
    return jsonify({"response": next_step})

@app.route('/get_previous_step', methods=['GET'])
def get_previous_step():
    """Return the previous step in the recipe."""
    previous_step = generate_previous_step(user_state["current_step"])
    user_state["current_step"] -= 1
    return jsonify({"response": previous_step})

if __name__ == "__main__":
    app.run(debug=True)
