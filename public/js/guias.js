

/**
 * Añade una nueva guía de montaje.
 * Usa la constante 'guias' definida globalmente en config.js
 */
async function addGuia(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No hay ningún usuario logueado.");

        const newGuia = {
            nom: formData.nom,               // Título descriptivo
            id_Component: formData.id_Component, // ID del componente relacionado
            ubicacio_PDF: formData.ubicacio_PDF, // URL o ruta del archivo
            idAutor: user.uid,               // ID del creador
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await guias.add(newGuia);
        showAlert("Guía publicada correctamente!", "alert-success");
        
    } catch (error) {
        console.error("Error en addGuia:", error);
        showAlert("Error: " + error.message, "alert-danger");
    }
}
/**
 * Carrega i mostra les guies en una taula (opcional).
 */
async function loadGuias() {
    const tableGuias = document.getElementById("listGuias");
    tableGuias.innerHTML = "<tr><th>Títol Guia</th><th>PDF</th><th>Autor</th></tr>";

    try {
        const snapshot = await guias.orderBy("timestamp", "desc").get();
        snapshot.forEach(doc => {
            const data = doc.data();
            tableGuias.innerHTML += `
                <tr>
                    <td>${data.nom}</td>
                    <td><a href="${data.ubicacio_PDF}" target="_blank">Veure PDF</a></td>
                    <td>${data.idAutor}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error carregant guies:", error);
    }
}