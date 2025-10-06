from flask import Flask
from flask import request

app = Flask(__name__)

def send_data():
    return "I'll be your proxy baby!"

def change_attributes():
    return "Shall do!"

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/api/v1/", methods=['GET', 'POST'])
def thingsboard_api():
    if request.method == 'POST':
        return send_data()
    else:
        return change_attributes()


if __name__ == "_main__":
    app.run()


    # if request.method == 'POST':
    #     return send_data()
    # else:
    #     return change_attributes()
