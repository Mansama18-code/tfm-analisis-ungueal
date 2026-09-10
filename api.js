
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
        
        // Imprime el JSON en el frontend. Acá se modifica
        document.getElementById("predominante").textContent = JSON.stringify(jsonResult['patron_predominante'], null, 2);
        document.getElementById("confianza").textContent = JSON.stringify(jsonResult['indice_confianza'], null, 2);

        contenido = `
                     <pre>${JSON.stringify(jsonResult['patron_predominante'], null, 2)}</pre> 
                     <pre>${JSON.stringify(jsonResult['coincidencias_visuales'], null, 2)}</pre> 
                    `;
        document.getElementById("pantalla-json").innerHTML = contenido;
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}