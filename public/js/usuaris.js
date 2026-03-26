const users = db.collection("usuaris");

/**
 * Registra un nou usuari a Firestore sense els camps 'punts' i 'rol'.
 */
async function addUser(userCredential, extraData) {
    // Obtenim l'objecte user (funciona tant per a userCredential com per a user directe)
    const user = userCredential.user ? userCredential.user : userCredential;

    try {
        await users.doc(user.uid).set({
            id: user.uid,
            email: user.email,
            nom: extraData.nom,
            cognom: extraData.cognom,
            telefon: extraData.telefon,
            provincia: extraData.provincia
            // Camps 'punts' i 'rol' eliminats completament
        });
        console.log("Usuari creat a Firestore correctament.");
    } catch (error) {
        throw new Error("Error en guardar dades d'usuari: " + error.message);
    }
}

/**
 * Carrega i mostra la llista d'usuaris sense les columnes de punts i rol.
 */
async function loadUsers() {
    try {
        const arrayItems = await selectAll(users);
        const table = document.getElementById("listUsers"); 
        if (!table) return;

        // Capçaleres netes
        table.innerHTML = `
            <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Cognom</th>
                <th>Província</th>
                <th>Accions</th>
            </tr>`;

        arrayItems.forEach((doc) => {
            const data = doc.data();
            table.innerHTML += `
                <tr>
                    <td>${data.email || ""}</td>
                    <td>${data.nom || ""}</td>
                    <td>${data.cognom || ""}</td>
                    <td>${data.provincia || ""}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${doc.id}')">Eliminar</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("Error en carregar usuaris:", error);
    }
}

// Nota: Si tens funcions com deleteUser o editUser, assegura't que no reintrodueixin els camps.
async function deleteUser(id) {
    try {
        await deleteById(users, id);
        await loadUsers();
    } catch (error) {
        console.error(error);
    }
}