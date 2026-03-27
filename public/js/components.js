const compatibilidadAutomatica = {
    "CPU": ["Placa Base", "Socket compatible", "Dissipador"],
    "GPU": ["PCIe x16", "Font d'alimentació (PSU)", "Torre ATX"],
    "RAM": ["Slots DDR4/DDR5", "Placa Base"],
    "SSD": ["Port SATA", "Slot M.2 NVMe"],
    "PSU": ["Cablejat ATX", "Consum Watts"],
    "Placa Base": ["Caixa", "Socket CPU", "RAM"]
};

async function addComponent(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Has d'estar loguejat per afegir components.");

        const sugeriments = compatibilidadAutomatica[formData.categoria] || [];
        const extraDocs = formData.compatibilitat ? formData.compatibilitat.split(',').map(s => s.trim()) : [];
        const compatibilitatFinal = [...new Set([...sugeriments, ...extraDocs])];

        const newComponent = {
            nom: formData.nom,
            categoria: formData.categoria,
            estat: formData.estat,
            usuari_Propietari: user.uid,
            compatibilitat: compatibilitatFinal,
            preu: parseFloat(formData.preu) || 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await components.add(newComponent);
        showAlert("Component afegit!", "alert-success");
        await loadComponents();
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

async function loadComponents() {
    const tableBody = document.querySelector("#listComponents tbody");
    if (!tableBody) return;

    try {
        const snapshot = await componentsCol.orderBy("timestamp", "desc").get();
        tableBody.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${data.nom}</td>
                    <td>${data.categoria}</td>
                    <td>${data.preu} €</td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteComponent('${doc.id}')">Eliminar</button></td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function deleteComponent(id) {
    if (!confirm("Eliminar aquest component?")) return;
    try {
        await componentsCol.doc(id).delete();
        loadComponents();
    } catch (e) { showAlert("Error al eliminar", "alert-danger"); }
}

// Exportar a Window
window.addComponent = addComponent;
window.loadComponents = loadComponents;
window.deleteComponent = deleteComponent;