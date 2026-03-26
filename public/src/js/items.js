// Referència a la col·lecció "items" de Firestore
const items = db.collection("items");

async function addItem(doc) {
  try {
    await add(items, doc);
    await loadItems();
    clearItemForm();
    showAlert("Element guardat correctament", "alert-success");
  } catch (error) {
    showAlert("Error al intentar guardar l'element", "alert-danger");
  }
}

async function deleteItem(id) {
  try {
    await deleteById(items, id);
    await loadItems();
    showAlert("Element eliminat correctament", "alert-success");
  } catch (error) {
    showAlert("Error al intentar eliminar l'element", "alert-danger");
  }
}

async function editItem(id) {
  try {
    document.getElementById("elementId").value = id;
    const doc = await selectById(items, id);
    const data = doc.data();
    document.getElementById("title").value = data.title;
    document.getElementById("content").value = data.content;
  } catch (error) {
    showAlert("Error al intentar editar l'element", "alert-danger");
  }
}

async function loadItems() {
  try {
    const arrayItems = await selectAll(items);
    const tableBody = document.querySelector("#listItems tbody");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    
    arrayItems.forEach((doc) => {
      const { title, content } = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(title)}</td>
        <td>${escapeHtml(content)}</td>
        <td class="table-actions">
          <button type="button" class="btn btn-sm btn-primary" onclick="editItem('${doc.id}')">
            Editar
          </button>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteItem('${doc.id}')">
            Eliminar
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    showAlert("Error al mostrar els elements", "alert-danger");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function updateItem(id, doc) {
  try {
    await updateById(items, id, doc);
    await loadItems();
    clearItemForm();
    showAlert("Element actualitzat correctament", "alert-success");
  } catch (error) {
    showAlert("Error al intentar actualitzar l'element", "alert-danger");
  }
}

function clearItemForm() {
  document.getElementById("elementId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}