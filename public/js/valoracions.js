/**
 * Registra una nova valoració a la col·lecció 'valoracions'.
 * @param {Object} formData - Dades que venen del formulari (id_Transaccio, id_UsuariPuntuat, puntuacio, comentari)
 */
async function addValoracio(formData) {
    try {
        const user = auth.currentUser;
        
        // 1. Verificació d'autenticació
        if (!user) {
            throw new Error("Has d'estar loguejat per poder enviar una valoració.");
        }

        // 2. Validació i conversió de la puntuació
        const nota = parseInt(formData.puntuacio);
        if (isNaN(nota) || nota < 0 || nota > 10) {
            throw new Error("La puntuació ha d'estar entre 0 i 10.");
        }

        // 3. Validació de camps obligatoris de Firebase
        if (!formData.id_Transaccio || !formData.id_UsuariPuntuat) {
            throw new Error("Falten dades clau: ID de transacció o usuari a puntuar.");
        }

        // 4. Preparació de l'objecte segons les Rules de Firestore
        // IMPORTANT: El camp 'id_UsuariPuntuador' ha de ser el UID de qui escriu la ressenya
        const novaVal = {
            id_UsuariPuntuador: user.uid,         // Qui posa la nota (Tu)
            id_UsuariPuntuat: formData.id_UsuariPuntuat, // Qui rep la nota
            id_Transaccio: formData.id_Transaccio,     // Referència a la venda/intercanvi
            puntuacio: nota,
            comentari: formData.comentari || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Data del servidor
        };

        // 5. Intent d'escriptura a Firestore
        // La referència 'valoracions' ha d'estar definida a config.js: const valoracions = db.collection("valoracions");
        await valoracions.add(novaVal);

        // Si arriba aquí, tot ha anat bé. El missatge "valoració completada" es llança des de l'index.html
        return true;

    } catch (error) {
        // Log detallat per a la consola del desenvolupador
        console.error("Error detallat a addValoracio:", error);
        
        // Propaguem l'error per a que el botó de l'index.html pugui mostrar l'alerta vermella
        throw error;
    }
}

/**
 * Funció opcional per carregar valoracions d'un usuari concret (per al seu perfil)
 */
async function loadValoracionsUsuari(userId) {
    try {
        const snapshot = await valoracions
            .where("id_UsuariPuntuat", "==", userId)
            .orderBy("timestamp", "desc")
            .get();
            
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al carregar valoracions:", error);
        return [];
    }
}