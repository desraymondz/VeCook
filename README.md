# 👩‍🍳VeCook: Your Mom-Like Figure

## ✨Overview

**VeCook** An enhanced cooking companion built for [Kitchen CoPilot](https://kitchencopilot.com). Perfect for anyone seeking guidance to someone(AI) that cares about your health, corrects your mistakes, and understands YOU. With Kitchen CoPilot, cooking feels less like a chore and more like a supportive, enriching experience.

👨🏻‍💻This project was built during [Hackomania 2025](https://hackomania.geekshacking.com) within 24 hours.

## 🎬Demo
[![Watch the Demo](https://img.youtube.com/vi/xoKdf1LBQJE/maxresdefault.jpg)](https://youtu.be/xoKdf1LBQJE)
[🔗Demo Video on YouTube](https://youtu.be/xoKdf1LBQJE)


## 🎯Challenge Statement
📝**Option C**: Showcase how AI or other technologies can enrich the existing Kitchen Copilot app and further delight the user!  
📄Full challenge statement can be found [here](https://hackomania.geekshacking.com/challengeStatements/Kitchen%20Copilot%20Challenge%20Statement.pdf).

## ⭐️Features
- 🍽 **Personalized Meal Planning**
  - Powered by the **Google Fit API**, the AI dynamically adjusts recipes and ingredient portions based on your activity level for optimal nutrition.
  - Have **dietary preferences or allergies**? Simply inform the AI chatbot, and it will curate meal recommendations tailored to your need
- 🙌 **Hands-Free Recipe Book**
  - Navigate through cooking steps effortlessly using **hand gestures**-—point **right** 👉🏻 to move forward and **left** 👈🏻 to go back
  - No more touching screens with messy hands—-cook with ease!
- 🤖 **AI-Powered Assistance**
  - Made a mistake? **Just raise your hand**✋ and ask the AI for guidance on how to fix it in real-time
- 🎥 **Content Creator Friendly:**
  - Effortlessly **record your cooking process** and share it on social media to inspire others and showcase your skills!

## 🛠Tech Stack
Frontend:
- HTML
- CSS
- JavaScript
- [p5.js](https://p5js.org/)
- [ml5.js](https://ml5js.org/)  

Backend:
- Flask
- Google Fit API
- OpenAI API

## 🚀Getting Started

### Prerequisites
- Python 3.7 or higher
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/VeCook-fork.git
   cd VeCook-fork/be
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `be/` directory with the following:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the Flask backend**
   ```bash
   python app.py
   ```
   
   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../fe
   ```

2. **Open with a local server**
   
   You can use any local server. Here are a few options:
   
   - **Using Python:**
     ```bash
     python -m http.server 8000
     ```
   
   - **Using Node.js (http-server):**
     ```bash
     npx http-server -p 8000
     ```
   
   - **Using VS Code Live Server extension:**
     Right-click on `index.html` and select "Open with Live Server"

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:8000` or `http://127.0.0.1:5500/fe/` if using Live Server extension

### Usage Tips
- 🎥 Allow camera access for hand gesture controls
- 🤚 Raise your hand to activate AI assistance
- 👉 Point right to go to the next step
- 👈 Point left to go back to the previous step

## 👥Contributors
- [**Michelle Chan (@Chelle007)**](https://github.com/Chelle007) — Backend Web Developer
- [**Desmond (@desraymondz)**](https://github.com/desraymondz) — JavaScript and ml5.js Developer
- [**Fukutaro Sie (@fukutarosie)**](https://github.com/fukutarosie) — UI/UX Designer and Frontend Web Developer
- [**Daniella Setio (@starryciell)**](https://github.com/starryciell) — Frontend Web Developer
