async function fetchKunde(id) {
    try {
        let url;

        // URL der PHP-Datei
        if (id == null) {
            url = `./apis/get_kunde.php`;
        } else {
            url = `./apis/get_kunde.php?id=${id}`;
        }

        // Daten von der PHP-Datei abrufen
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Kunden: ${response.status}`);
        }

        // JSON-Daten parsen
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Kunden:', error);
        return null;
    }
}

export default fetchKunde;