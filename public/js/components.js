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
        if (!user) throw new Error("No hi ha cap usuari loguejat.");

        const sugeriments = compatibilidadAutomatica[formData.categoria] || [];
        const extraDocs = formData.compatibilitat ? formData.compatibilitat.split(',').map(s => s.trim()) : [];
        const compatibilitatFinal = [...new Set([...sugeriments, ...extraDocs])];

        const newComponent = {
            nom: formData.nom,
            categoria: formData.categoria,
            estat: parseInt(formData.estat) || 0,
            usuari_Propietari: user.uid,
            compatibilitat: compatibilitatFinal,
            preu: parseInt(formData.preu) || 0,
            images: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await components.add(newComponent);
        showAlert("Component publicat!", "alert-success");
    } catch (error) { showAlert("Error: " + error.message, "alert-danger"); }
}