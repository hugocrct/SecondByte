/**
 * Registra un nou usuari a Firestore.
 */
async function addUser(userCredential, extraData) {
    const user = userCredential.user ? userCredential.user : userCredential;
    try {
        await users.doc(user.uid).set({
            id: user.uid,
            email: user.email,
            nom: extraData.nom,
            cognom: extraData.cognom,
            telefon: extraData.telefon,
            provincia: extraData.provincia
        });
        console.log("Usuari creat a Firestore correctament.");
    } catch (error) {
        throw new Error("Error en guardar dades d'usuari: " + error.message);
    }
}

async function loadUsers() {
    try {
        const arrayItems = await selectAll(users);
        const table = document.getElementById("listUsers"); 
        if (!table) return;

        table.innerHTML = `<tr><th>Email</th><th>Nom</th><th>Província</th><th>Accions</th></tr>`;
        arrayItems.forEach((doc) => {
            const data = doc.data();
            table.innerHTML += `
                <tr>
                    <td>${data.email || ""}</td>
                    <td>${data.nom || ""}</td>
                    <td>${data.provincia || ""}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteUser('${doc.id}')">Eliminar</button></td>
                </tr>`;
        });
    } catch (error) { console.error("Error:", error); }
}

async function deleteUser(id) {
    try {
        await deleteById(users, id);
        loadUsers();
    } catch (error) { showAlert("Error eliminant", "alert-danger"); }
}
window.deleteUser = deleteUser;