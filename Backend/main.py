import os
import io
from google.cloud import vision_v1
from google.cloud.vision_v1 import types

import WebScraper


def send_data():

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'./venv/GoogleVisionAPI.json'

    client = vision_v1.ImageAnnotatorClient()

    file_name = r'test-beach.jpg'
    image_path = f'./images/test_beach.jpg'

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision_v1.types.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    data_list = []

    for label in labels:
        tag = label.description
        if " " not in tag:
            data_list.extend(WebScraper.find_captions(tag))

    return data_list


