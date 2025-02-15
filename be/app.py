from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
CORS(app)

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

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

def answer_question(user_message):
    """Answer the user's question based on the recipe or general knowledge."""
    system_message = f"""
        You are a professional chef specializing in answering recipe-related questions.
        Here is the recipe data:
        {json.dumps(RECIPE, indent=2)}
        
        User's current step: {RECIPE["steps"][user_state['current_step']]}

        Answer questions based only on these recipes and general cooking knowledge.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
    )

    return response["choices"][0]["message"]["content"].strip()

# Function for AI to handle different user inputs
# def handle_user_input(user_input):
#     """Handle the user input and determine whether to go to next step, previous step, or answer a question."""
#     if "next" in user_input:
#         user_state["current_step"] = min(user_state["current_step"] + 1, len(RECIPE["steps"]) - 1)
#         return generate_next_step(user_state["current_step"])

#     elif "previous" in user_input:
#         user_state["current_step"] = max(user_state["current_step"] - 1, 0)
#         return generate_previous_step(user_state["current_step"])

#     else:
#         return answer_question(user_input)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '').strip().lower()
    response_text = answer_question(user_input)
    
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
    # app.run(debug=True)
    print(answer_question("Oh no I accidentally put too much water, what should I do?"))
