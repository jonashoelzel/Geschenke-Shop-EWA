async function addProductsToBestellung(bestellungID, produkte) {
    try {
        const response = await fetch('./apis/add_products_to_bestellung.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bestellungID: bestellungID,
                produkte: produkte
            })
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Hinzufügen der Produkte zur Bestellung: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Produkte zur Bestellung:', error);
        return null;
    }
}

export default addProductsToBestellung;