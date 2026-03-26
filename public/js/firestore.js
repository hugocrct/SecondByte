/**
 * Afegeix un nou document a una col·lecció.
 */
async function add(colleccio, doc) {
  try {
    const docRef = await colleccio.add(doc);
    return docRef;
  } catch (error) {
    throw new Error(`Error en afegir l'element: ${error.message}`);
  }
}

/**
 * Elimina un document per ID.
 */
async function deleteById(colleccio, id) {
  try {
    await colleccio.doc(id).delete();
  } catch (error) {
    throw new Error(`Error en eliminar l'element amb ID ${id}: ${error.message}`);
  }
}

/**
 * Recupera tots els documents.
 */
async function selectAll(colleccio, campOrdre = null) {
  try {
    let querySnapshot;
    if (campOrdre === null) {
      querySnapshot = await colleccio.get();
    } else {
      querySnapshot = await colleccio.orderBy(campOrdre).get();
    }
    const docs = [];
    querySnapshot.forEach((doc) => { docs.push(doc); });
    return docs;
  } catch (error) {
    throw new Error(`Error en recuperar tots els elements: ${error.message}`);
  }
}

/**
 * Recupera un únic document per ID.
 */
async function selectById(colleccio, id) {
  try {
    const docSnap = await colleccio.doc(id).get();
    return docSnap;
  } catch (error) {
    throw new Error(`Error en recuperar l'element amb ID ${id}: ${error.message}`);
  }
}

/**
 * Actualitza un document existent.
 */
async function updateById(colleccio, id, doc) {
  try {
    await colleccio.doc(id).update(doc);
  } catch (error) {
    throw new Error(`Error en actualitzar l'element amb ID ${id}: ${error.message}`);
  }
}