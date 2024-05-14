export function generateRandomCityCode(): string {
    const randomLetters = [...Array(3)].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const randomNumbers = [...Array(3)].map(() => Math.floor(Math.random() * 10)).join('');
    return randomLetters + randomNumbers;
}