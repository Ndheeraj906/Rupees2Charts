const { validateUsername } = require('../script');

describe('validateUsername', () => {
    test('returns null for a fully valid username', () => {
        expect(validateUsername('Hello1!')).toBeNull();
    });

    test('rejects username shorter than 5 characters', () => {
        expect(validateUsername('Ab1!')).toBe('Username must be at least 5 characters long.');
    });

    test('rejects username with no uppercase letter', () => {
        expect(validateUsername('hello1!')).toBe('Username must contain at least one uppercase letter.');
    });

    test('rejects username with no number', () => {
        expect(validateUsername('Hello!!')).toBe('Username must contain at least one number.');
    });

    test('rejects username with no special character', () => {
        expect(validateUsername('Hello1')).toBe('Username must contain at least one special character.');
    });
});
