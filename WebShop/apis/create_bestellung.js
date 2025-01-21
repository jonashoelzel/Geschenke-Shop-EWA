async function createBestellung(kundenID, preis) {
    try {
        // Anfrage an die PHP-Datei senden
        const response = await fetch('./apis/create_bestellung.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                kundenID: kundenID,
                preis: preis
            })
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Hinzufügen der Zahlung: ${response.status}`);
        }

        const result = await response.json();

        return result;      
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Zahlung:', error);
        return null;
    }
}

export default createBestellung;