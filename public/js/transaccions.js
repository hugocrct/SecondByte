async function addTransaccio(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Has d'estar loguejat.");

        // Validació de seguretat: No es pot comprar a un mateix
        if (formData.id_Vendedor === formData.id_Comprador) {
            throw new Error("Operació denegada: El venedor i el comprador són la mateixa persona.");
        }

        const novaTransaccio = {
            id_Comprador: formData.id_Comprador,
            id_Vendedor: formData.id_Vendedor,
            id_Producte: formData.id_Producte,
            id_Autor: user.uid, 
            tipus: formData.tipus,
            preu: formData.tipus ? parseInt(formData.preu) : 0,
            data: firebase.firestore.FieldValue.serverTimestamp()
        };

        await transaccions.add(novaTransaccio);
        showAlert("Transacció registrada correctament!", "alert-success");
        
    } catch (error) {
        console.error("Error transacció:", error);
        showAlert(error.message, "alert-danger");
        throw error; // Re-llancem per a que el formulari no es netegi si falla
    }
}