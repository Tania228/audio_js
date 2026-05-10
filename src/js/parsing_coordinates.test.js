import ParsingCoordinates from './parsing_coordinates.js';

describe('ParsingCoordinates', () => {
    test('должен правильно парсить "51.50851, −0.12572"', () => {
        const result = ParsingCoordinates.parse("51.50851, −0.12572");
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('должен правильно парсить "51.50851,−0.12572"', () => {
        const result = ParsingCoordinates.parse("51.50851,−0.12572");
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('должен правильно парсить "[51.50851, −0.12572]"', () => {
        const result = ParsingCoordinates.parse("[51.50851, −0.12572]");
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('должен выбрасывать ошибку при отсутствии запятой', () => {
        expect(() => {
            ParsingCoordinates.parse("51.50851 −0.12572");
        }).toThrow('Неверный формат. Ожидается: широта, долгота');
    });

    test('должен выбрасывать ошибку при вводе букв', () => {
        expect(() => {
            ParsingCoordinates.parse("abc, def");
        }).toThrow('Широта и долгота должны быть числами');
    });

    test('должен выбрасывать ошибку при пустой строке', () => {
        expect(() => {
            ParsingCoordinates.parse("");
        }).toThrow('Неверный формат. Ожидается: широта, долгота');
    });

    test('должен выбрасывать ошибку при вводе только одного числа', () => {
        expect(() => {
            ParsingCoordinates.parse("51.50851");
        }).toThrow('Неверный формат. Ожидается: широта, долгота');
    });

    test('должен выбрасывать ошибку при вводе трёх чисел', () => {
        expect(() => {
            ParsingCoordinates.parse("51.50851, -0.12572, 123.45");
        }).toThrow('Неверный формат. Ожидается: широта, долгота');
    });
});