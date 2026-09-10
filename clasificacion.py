import io
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf

app = FastAPI(title="API de Clasificación de Alteraciones Ungueales")

# Permitir conexiones desde cualquier Frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar el modelo guardado por el script de Jupyter
# Sustituye 'mejor_modelo_MobileNetV2.h5' por el nombre exacto de tu archivo .h5
MODEL_PATH = "/Users/mansama18/Desktop/webdiseno/unir/TFM/v2/models/mejor_modelo_EfficientNetB0.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Asegúrate de que las clases coincidan con las de tu entrenamiento
CLASS_NAMES = [
    "Normal",
    "Lineas de Beau",
    "Líneas Negras",
    "Clubbing",
    "Puntos Blancos",
    "Sospecha Onicomicosis",
    "No Evaluable"
]

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    tensor_image = preprocess_image(image_bytes)
    
    # Realizar inferencia
    predictions = model.predict(tensor_image)[0]
    best_idx = int(np.argmax(predictions))
    confidence = float(predictions[best_idx])
    
    # Desglose de probabilidades por clase
    coincidencias_visuales = {
        CLASS_NAMES[i]: round(float(predictions[i]), 4)
        for i in range(len(CLASS_NAMES))
    }
    
    # Respuesta en formato JSON con lenguaje orientativo no diagnóstico
    return {
        "estado": "Exitoso",
        "patron_predominante": CLASS_NAMES[best_idx],
        "indice_confianza": round(confidence, 4),
        "coincidencias_visuales": coincidencias_visuales,
        "advertencia_legal": "Resultado orientativo basado en similitud visual. No constituye diagnóstico médico."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)