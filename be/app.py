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
GPT_MODEL = "gpt-4"

ORIGINAL_RECIPE = {
    "title": "Creamy Mac & Cheese",
    "ingredients": [
        "2 cups elbow macaroni",
        "2 cups shredded cheddar cheese",
        "1 ½ cups milk",
        "2 tbsp butter",
        "2 tbsp all-purpose flour",
        "1 tsp salt",
        "½ tsp black pepper",
        "½ tsp garlic powder"
    ],
    "steps": [
        "Boil water in a pot, add a pinch of salt.",
        "Cook macaroni until it's firm but tender when bitten, then drain and set aside.",
        "In a saucepan, melt butter over medium heat.",
        "Add flour and whisk for 1-2 minutes until it turns slightly golden.",
        "Slowly pour in the milk while whisking to avoid lumps.",
        "Add salt, pepper, and garlic powder.",
        "Mix in optional ingredients like spinach, grilled chicken, or yogurt for creaminess.",
        "Add cooked pasta to the cheese sauce and mix well."
    ]
}

RECIPE = ORIGINAL_RECIPE

user_state = {
    "current_step": 0,
    "preference": None
}

user_history = {}

def change_recipe(preference):
    """Change recipe based on user's preference"""
    system_msg = f"""You are a helpful recipe advisor who can modify recipe based on user's preferences.
                Here is the original recipe data:
                {json.dumps(RECIPE, indent=2)}
                
                You must always respond with the following JSON object: 
                {{
                    "message": (Example: Since you are vegan, I have modified the recipe to be vegan friendly, such as changing ... summary it in 1 paragraph),
                    "modified_recipe": {{
                        "title": modified title (For example: Vegan Mac & Cheese)
                        "ingredients": list of modified ingredients (ONLY CHANGE THE NECESSARY ONES),
                        "steps": list of modified steps (ONLY CHANGE THE NECESSARY ONES)
                    }}
                }}
                You must return this JSON object directly, without any apologies, explanations, or additional text.
                """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        api_key=OPENAI_API_KEY,
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": preference}
        ]
    )

    returning_response = response["choices"][0]["message"]["content"].strip().replace("\u00bd", "½")
    try:
        returning_response = json.loads(returning_response)
    except json.JSONDecodeError:
        returning_response = {}
    RECIPE = returning_response.get("modified_recipe", ORIGINAL_RECIPE)

    return returning_response

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
        model=GPT_MODEL,
        api_key=OPENAI_API_KEY,
        messages=user_history[user_id]
    )

    bot_response = response["choices"][0]["message"]["content"].strip()

    # Add AI response to history
    user_history[user_id].append({"role": "assistant", "content": bot_response})

    # Limit message history to last 10 messages to save tokens
    user_history[user_id] = user_history[user_id][-10:]

    return bot_response

def get_ingredients():
    """Fetch ingredients data."""
    return jsonify({"response": RECIPE["ingredients"]})

@app.route('/personalize', methods=['POST'])
def personalize():
    """Personalize recipe based on user's preference."""
    preference = request.json.get('preference', "")

    ai_response = change_recipe(preference)

    return jsonify({"response": ai_response})

@app.route('/help', methods=['POST'])
def help():
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
    return jsonify({
        "step_content": next_step,
        "step_number": user_state["current_step"]
    })

@app.route('/get_previous_step', methods=['GET'])
def get_previous_step():
    """Return the previous step in the recipe."""
    previous_step = "START"
    if user_state["current_step"] > 0:
        user_state["current_step"] -= 1
        previous_step = RECIPE["steps"][user_state["current_step"]]
    elif user_state["current_step"] == 0:
        user_state["current_step"] -= 1
    return jsonify({
        "step_content": previous_step,
        "step_number": user_state["current_step"]
    })

if __name__ == "__main__":
    app.run(debug=True)
