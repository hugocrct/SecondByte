/**
 * Afegeix un nou document a la col·lecció.
 */
async function add(collection, doc) {
  try {
    const docRef = await collection.add(doc);
    return docRef;
  } catch (error) {
    throw new Error(`Error al afegir l'element: ${error.message}`);
  }
}

/**
 * Elimina un document per ID.
 */
async function deleteById(collection, id) {
  try {
    await collection.doc(id).delete();
  } catch (error) {
    throw new Error(`Error al eliminar l'element amb ID ${id}: ${error.message}`);
  }
}

/**
 * Recupera tots els documents d'una col·lecció.
 */
async function selectAll(collection, orderByField = null) {
  try {
    let querySnapshot;
    if (orderByField === null) {
      querySnapshot = await collection.get();
    } else {
      querySnapshot = await collection.orderBy(orderByField).get();
    }

    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc);
    });
    return docs;
  } catch (error) {
    throw new Error(`Error recuperant tots els elements: ${error.message}`);
  }
}

/**
 * Recupera un únic document per ID.
 */
async function selectById(collection, id) {
  try {
    const docSnap = await collection.doc(id).get();
    return docSnap;
  } catch (error) {
    throw new Error(`Error al recuperar l'element amb ID ${id}: ${error.message}`);
  }
}

/**
 * Actualitza un document existent per ID.
 */
async function updateById(collection, id, doc) {
  try {
    await collection.doc(id).update(doc);
  } catch (error) {
    throw new Error(`Error al actualitzar l'element amb ID ${id}: ${error.message}`);
  }
}