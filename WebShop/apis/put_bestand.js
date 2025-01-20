async function putBestand(prodID, menge) {
    try {
        const response = await fetch('./apis/put_bestand.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: prodID,
                menge: menge
            })
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Zahlung:', error);
        return null;
    }
}

export default putBestand;