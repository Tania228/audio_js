export default class ParsingCoordinates {

    static parse(input) {
        let cleanCoords = input.trim();

        cleanCoords = cleanCoords.replace(/−/g, '-');

        if (cleanCoords.startsWith('[') && cleanCoords.endsWith(']')) {
            cleanCoords = cleanCoords.slice(1, -1);
        }

        const partsCoords = cleanCoords.split(',').map(part => part.trim());

        if (partsCoords.length !== 2) {
            throw new Error('Неверный формат. Ожидается: широта, долгота');
        }

        const latitude = parseFloat(partsCoords[0]);
        const longitude = parseFloat(partsCoords[1]);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Широта и долгота должны быть числами');
        }

        return { latitude, longitude };
    }
}