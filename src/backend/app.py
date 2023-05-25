from flask_cors import CORS, cross_origin
from flask import Flask, jsonify
import login
import register

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"

app.register_blueprint(login.login_api, url_prefix = "/login")
app.register_blueprint(register.register_api, url_prefix = "/register")

@app.route("/", methods = ["GET"])
def hello():
    return jsonify({"message" : "Welcome to backend API"})

if __name__ == "__main__":
    app.run(host = "localhost", port = 8080)
