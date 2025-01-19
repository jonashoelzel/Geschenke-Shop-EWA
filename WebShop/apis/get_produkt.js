async function fetchProdukt(id) {
    try {
        let url;

        // URL der PHP-Datei
        if (id == null) {
            url = `./apis/get_produkt.php`;
        } else {
            url = `./apis/get_produkt.php?id=${id}`;
        }

        // Daten von der PHP-Datei abrufen
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Produkte: ${response.status}`);
        }

        // JSON-Daten parsen
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkte:', error);
        return null;
    }
}

export default fetchProdukt;