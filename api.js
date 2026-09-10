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