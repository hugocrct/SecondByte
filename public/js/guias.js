async function addGuia(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Debes estar logueado para subir guías.");

        const newGuia = {
            nom: formData.nom,
            id_Component: formData.id_Component,
            ubicacio_PDF: formData.ubicacio_PDF,
            idAutor: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await guias.add(newGuia);
        showAlert("Guía vinculada!", "alert-success");
    } catch (error) { showAlert("Error: " + error.message, "alert-danger"); }
}

async function loadGuias() {
    const tableGuias = document.getElementById("listGuias");
    if(!tableGuias) return;
    tableGuias.innerHTML = "<tr><th>Títol Guia</th><th>PDF</th></tr>";
    try {
        const snapshot = await guias.orderBy("timestamp", "desc").get();
        snapshot.forEach(doc => {
            const data = doc.data();
            tableGuias.innerHTML += `<tr><td>${data.nom}</td><td><a href="${data.ubicacio_PDF}" target="_blank">PDF</a></td></tr>`;
        });
    } catch (error) { console.error(error); }
}