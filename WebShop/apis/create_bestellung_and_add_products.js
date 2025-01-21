import createBestellung from './create_bestellung.js';
import addProductsToBestellung from './add_products_to_bestellung.js';

async function createAndAddProductsToBestellung(kundenID, preis, produkte) {
    try {
        // Create the Bestellung
        const bestellungResult = await createBestellung(kundenID, preis);
        if (!bestellungResult || !bestellungResult.success) {
            throw new Error('Fehler beim Erstellen der Bestellung.');
        }

        const bestellungID = bestellungResult.bestellungID;

        // Add products to the Bestellung
        const addProductsResult = await addProductsToBestellung(bestellungID, produkte);
        if (!addProductsResult || !addProductsResult.success) {
            throw new Error('Fehler beim Hinzufügen der Produkte zur Bestellung.');
        }

        return { success: true, bestellungID: bestellungID };
    } catch (error) {
        console.error('Fehler beim Erstellen der Bestellung und Hinzufügen der Produkte:', error);
        return { success: false, message: error.message };
    }
}

export default createAndAddProductsToBestellung;