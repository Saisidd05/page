from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    from .algorithms import calculate
except ImportError:
    from algorithms import calculate

app = Flask(__name__)
CORS(app)


@app.route("/api/calculate", methods=["POST"])
def calculate_pages():
    try:
        payload = request.get_json(force=True)
        response = calculate(payload)
        return jsonify(response), 200
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": "Internal server error."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
