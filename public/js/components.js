

// Diccionari de regles de compatibilitat automàtica
const compatibilidadAutomatica = {
    "CPU": ["Placa Base", "Socket compatible", "Dissipador"],
    "GPU": ["PCIe x16", "Font d'alimentació (PSU)", "Torre ATX"],
    "RAM": ["Slots DDR4/DDR5", "Placa Base"],
    "SSD": ["Port SATA", "Slot M.2 NVMe"],
    "PSU": ["Cablejat ATX", "Consum Watts"],
    "Placa Base": ["Caixa", "Socket CPU", "RAM"]
};

/**
 * Afegeix un nou component informàtic a Firestore.
 * No inclou gestió d'imatges per evitar errors de Storage.
 */
async function addComponent(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No hi ha cap usuari loguejat.");

        // LÒGICA D'AUTORELLENAT DE COMPATIBILITAT
        // Combinem el que hi ha al diccionari amb el que escrigui l'usuari
        const sugeriments = compatibilidadAutomatica[formData.categoria] || [];
        const extraDocs = formData.compatibilitat ? formData.compatibilitat.split(',').map(s => s.trim()) : [];
        
        // Creem un array únic sense duplicats
        const compatibilitatFinal = [...new Set([...sugeriments, ...extraDocs])];

        const newComponent = {
            nom: formData.nom,
            categoria: formData.categoria,
            estat: parseInt(formData.estat) || 0,
            usuari_Propietari: user.uid,
            compatibilitat: compatibilitatFinal,
            preu: parseInt(formData.preu) || 0,
            images: [], // Estructura preparada per al futur, però buida ara mateix
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await components.add(newComponent);
        showAlert("Component publicat correctament!", "alert-success");
        
    } catch (error) {
        console.error("Error en addComponent:", error);
        showAlert("Error: " + error.message, "alert-danger");
        throw error; 
    }
}