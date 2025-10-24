// Dies ist die JavaScript-Methode, die die Java-Methode per REST aufruft.

export async function fetchSolutionFromJava(limit) {
    const backendUrl = `http://localhost:8080/api/solver/solve?upperLimit=${limit}`;

    // Die einfachste Form des REST-Aufrufs (Fetch API)
    const response = await fetch(backendUrl); 

    if (!response.ok) {
        // Fehlerbehandlung: Wichtig, falls das Backend nicht antwortet
        throw new Error(`Java Backend Fehler: ${response.status}`);
    }

    // Wandelt die JSON-Antwort des Java-Backends in ein JS-Objekt um
    const data = await response.json(); 
    return data;
}