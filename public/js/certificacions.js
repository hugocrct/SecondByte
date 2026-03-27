function generarTrackingAleatori() {
    const num = Math.floor(10000000 + Math.random() * 90000000);
    return "SB-" + num;
}

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

async function confirmarEntrega(certId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Sessió no iniciada");

        const docSnap = await certificacions.doc(certId).get();
        if (!docSnap.exists) throw new Error("El document no existeix");
        
        const data = docSnap.data();
        
        // Validación de seguridad: Solo el receptor puede marcar como entregado
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

async function loadCertificacions() {
    const user = auth.currentUser;
    const table = document.getElementById("listCertificacions");
    if (!table || !user) return;

    table.innerHTML = "<tr><th>Tracking</th><th>Estat</th><th>Acció</th></tr>";
    
    try {
        // FILTRO CRÍTICO: Solo recibo paquetes destinados a MI UID
        const snap = await certificacions.where("id_usuari_Receptor", "==", user.uid).get();
        
        if (snap.empty) {
            table.innerHTML += "<tr><td colspan='3' class='text-center'>No tens paquets pendents</td></tr>";
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