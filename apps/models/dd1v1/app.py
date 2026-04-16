import math
from PIL import Image
from fastapi import FastAPI,File,UploadFile
import uvicorn
from pydantic import BaseModel
import requests
from fastapi.responses import FileResponse
from pathlib import Path
import numpy as np
import tensorflow as tf
import json


MODEL_rice = tf.keras.models.load_model("rice/MobileNet_rice.h5",compile=False)
MODEL_potato = tf.keras.models.load_model("potato/MobileNet_potato.h5",compile=False)
MODEL_tomato = tf.keras.models.load_model("tomato/MobileNet_tomato.h5",compile=False)


app = FastAPI()

@app.get("/")
async def start():
    return "Welcome.."
@app.get("/ping")
async def ping():
    return "Hello, I am alive..."


UPLOAD_DIR = Path("downloads/")
UPLOAD_DIR.mkdir(exist_ok=True)


class ImageUrl(BaseModel):
    imageUrl: str
    modelId: str


@app.post("/image_predict")
async def image_predict(image_url: ImageUrl):
    url = image_url.imageUrl
    id = image_url.modelId

    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Unable to download the image: {str(e)}"}



    file_name = "downloaded_image.jpg"
    file_location = UPLOAD_DIR / file_name

    # Save the image locally
    try:
        with open(file_location, "wb") as buffer:
            for chunk in response.iter_content(1024):
                buffer.write(chunk)
    except Exception as e:
        return {"error": f"Failed to save the image: {str(e)}"}


    def preprocess_image(image_path):
        image = Image.open(image_path)
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0  # Normalize
        image_array = np.expand_dims(image_array, axis=0)  # batch dimension
        return image_array



# Preprocess the image
    image_array = preprocess_image("downloads/downloaded_image.jpg")
    if id=="1" :
        predictions = MODEL_rice.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1).item()
        with open("rice/class_indices.json") as f:
            disease_mapping = json.load(f)
    elif id=="2" :
        predictions = MODEL_potato.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1).item()
        with open("potato/class_indices.json") as f:
            disease_mapping = json.load(f)       
    elif id=="3" :
        predictions = MODEL_tomato.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1).item()
        with open("tomato/class_indices.json") as f:
            disease_mapping = json.load(f)       

    possibility = np.max(predictions) * 100
    possibility = math.floor(possibility * 100) / 100
    disease_name = disease_mapping.get(str(predicted_class), "Unknown disease")
    if disease_name == "Healthy":
        number_of_disease = 0
    else :
        number_of_disease = 1
    return {
        "number_of_disease":number_of_disease,
        "result": [disease_name],
        "possibility": [possibility]
    }


if __name__ == "__main__":
    uvicorn.run(app,host='localhost',port=8000)