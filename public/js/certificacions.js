/**
 * Genera un número de seguiment aleatori (Ex: SB-12345678)
 */
function generarTrackingAleatori() {
    const num = Math.floor(10000000 + Math.random() * 90000000);
    return "SB-" + num;
}

/**
 * Registra una nova certificació amb número aleatori
 */
async function addCertificacio(formData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No autenticat");

        const nuevaCert = {
            id_transaccions: formData.id_transaccions,   
            id_usuari_Donant: user.uid,                  
            id_usuari_Receptor: formData.id_usuari_Receptor, 
            adreça_Enviament: formData.adreça_Enviament,
            estat: "pending",                            
            numero_Seguiment: formData.numero_Seguiment || generarTrackingAleatori(),
            empresa_transport: formData.empresa_transport || "SecondByte Logistics",
            data_envio: firebase.firestore.FieldValue.serverTimestamp(),
            data_arribada: "" 
        };

        await certificacions.add(nuevaCert);
        showAlert("Certificació i seguiment creat: " + nuevaCert.numero_Seguiment, "alert-success");
    } catch (error) {
        console.error(error);
        showAlert("Error en certificació: " + error.message, "alert-danger");
    }
}

/**
 * Confirma la recepció del paquet (Només pel Receptor)
 */
async function confirmarEntrega(certId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Sessió no iniciada");

        // Obtenim el document per verificar propietari abans d'intentar escriure
        const docSnap = await certificacions.doc(certId).get();
        if (!docSnap.exists) throw new Error("El document no existeix");
        
        const data = docSnap.data();
        
        // Verificació de seguretat en el codi
        if (data.id_usuari_Receptor !== user.uid) {
            throw new Error("No ets el receptor d'aquest paquet.");
        }

        await certificacions.doc(certId).update({
            estat: "entregado",
            data_arribada: firebase.firestore.FieldValue.serverTimestamp()
        });

        showAlert("Paquet confirmat com a entregat!", "alert-success");
        loadCertificacions(); 
    } catch (error) {
        showAlert("Error en confirmar: " + error.message, "alert-danger");
    }
}

/**
 * Carrega les certificacions on sóc el receptor
 */
async function loadCertificacions() {
    const user = auth.currentUser;
    const table = document.getElementById("listCertificacions");
    if (!table || !user) return;

    table.innerHTML = ""; // Netejar taula
    
    try {
        // Només demanem els paquets on l'usuari és el receptor
        const snap = await certificacions.where("id_usuari_Receptor", "==", user.uid).get();
        
        if (snap.empty) {
            table.innerHTML = "<tr><td colspan='3' class='text-center'>No tens paquets pendents</td></tr>";
            return;
        }

        snap.forEach(doc => {
            const data = doc.data();
            const esPendiente = data.estat === "pending";
            
            table.innerHTML += `
                <tr>
                    <td>${data.numero_Seguiment}</td>
                    <td><span class="badge ${esPendiente ? 'badge-warning' : 'badge-info'}">${data.estat}</span></td>
                    <td>
                        ${esPendiente 
                            ? `<button class="btn btn-sm btn-success" onclick="confirmarEntrega('${doc.id}')">Marcar com Rebut</button>`
                            : `<span class="text-success font-weight-bold">✓ Rebut</span>`}
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("Error carregant certificacions:", error);
    }
}