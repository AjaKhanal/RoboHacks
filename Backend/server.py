import os

from flask import Flask, jsonify, request, redirect, render_template
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import main

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# @app.route('/')
# @cross_origin()
# def index():
#     return "<p>Hello, World!</p>"


app.config["IMAGE_UPLOADS"] = "./images"
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]
app.config["MAX_IMAGE_FILESIZE"] = 0.5 * 1024 * 1024


def allowed_image(filename):

    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


def allowed_image_filesize(filesize):
    if int(filesize) <= app.config["MAX_IMAGE_FILESIZE"]:
        return True
    else:
        return False


@app.route("/", methods=["GET", "POST"])
@cross_origin()
def upload_image():
    return "<p>Hello, World!</p>"


if __name__ == "__main__":
    app.run(debug=True)

