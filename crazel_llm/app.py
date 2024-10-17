from flask import Flask, request, jsonify
from llm_model.model import generate_response

app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'Text is required'}), 400

    user_text = data['text']
    response = generate_response(user_text)

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
