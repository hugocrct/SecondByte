

async function addItem(doc) {
  try {
    await add(items, doc);
    await loadItems();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    showAlert("Element desat correctament", "alert-success");
  } catch (error) {
    showAlert("Error en desar l'element", "alert-danger");
  }
}

async function deleteItem(id) {
  try {
    await deleteById(items, id);
    await loadItems();
    showAlert("Element eliminat", "alert-success");
  } catch (error) {
    showAlert("Error en eliminar", "alert-danger");
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
    showAlert("Error en editar", "alert-danger");
  }
}

async function loadItems() {
  try {
    const arrayItems = await selectAll(items);
    const taula = document.getElementById("listItems");
    taula.innerHTML = `<tr><th>Títol</th><th>Contingut</th><th></th></tr>`;
    arrayItems.forEach((doc) => {
      const { title, content } = doc.data();
      taula.innerHTML += `
        <tr>
          <td>${title}</td>
          <td>${content}</td>
          <td>
            <button class="btn btn-danger btn-sm float-right" onclick="deleteItem('${doc.id}')">Eliminar</button>
            <button class="btn btn-primary btn-sm mr-2 float-right" onclick="editItem('${doc.id}')">Editar</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    showAlert("Error en carregar ítems", "alert-danger");
  }
}

async function updateItem(id, doc) {
  try {
    await updateById(items, id, doc);
    await loadItems();
    document.getElementById("elementId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    showAlert("Element actualitzat", "alert-success");
  } catch (error) {
    showAlert("Error en actualitzar", "alert-danger");
  }
}