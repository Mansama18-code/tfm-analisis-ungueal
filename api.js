
function manejarSeleccionImagen(event) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
        const archivo = event.target.files[0];

        const urlImagenLocal = URL.createObjectURL(archivo);

        // 2. Obtener el elemento img por su ID y actualizar su atributo 'src'
        const imagenTag = document.getElementById("imagen-previsualizacion");
        if (imagenTag) {
            imagenTag.src = urlImagenLocal;
        }

        enviarImagenBackend(archivo);
    } else {
        console.warn("No se seleccionó ningún archivo o la selección fue cancelada.");
    }
}
    
async function enviarImagenBackend(archivoImagen) {
    const formData = new FormData();
    formData.append("file", archivoImagen);

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            body: formData
        });

        const jsonResult = await response.json();
        
        // Imprime el JSON directamente en el elemento de pantalla de tu Frontend
        document.getElementById("pantalla-json").textContent = JSON.stringify(jsonResult, null, 2);
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}