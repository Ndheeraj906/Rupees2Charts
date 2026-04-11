const { validateUsername, updateChecklist, updateTotals, getValues } = require('../script');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── validateUsername ────────────────────────────────────────────────────────

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

    test('accepts username with exactly 5 characters meeting all rules', () => {
        expect(validateUsername('aB1!x')).toBeNull();
    });

    test('rejects empty string (too short)', () => {
        expect(validateUsername('')).toBe('Username must be at least 5 characters long.');
    });
});

// ─── updateChecklist ─────────────────────────────────────────────────────────

describe('updateChecklist', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <ul id="usernameChecklist" class="d-none">
                <li id="req-length"><span></span> At least 5 characters</li>
                <li id="req-upper"><span></span> One uppercase letter</li>
                <li id="req-number"><span></span> One number</li>
                <li id="req-special"><span></span> One special character</li>
            </ul>
        `;
    });

    test('hides checklist when value is empty', () => {
        updateChecklist('');
        expect(document.getElementById('usernameChecklist').classList.contains('d-none')).toBe(true);
    });

    test('shows checklist when value is non-empty', () => {
        updateChecklist('Hello1!');
        expect(document.getElementById('usernameChecklist').classList.contains('d-none')).toBe(false);
    });

    test('marks all items success for a fully valid username', () => {
        updateChecklist('Hello1!');
        ['req-length', 'req-upper', 'req-number', 'req-special'].forEach(id => {
            expect(document.getElementById(id).className).toBe('text-success');
            expect(document.getElementById(id).querySelector('span').textContent).toBe('✓');
        });
    });

    test('marks length item as danger for short username', () => {
        updateChecklist('Hi1!');
        expect(document.getElementById('req-length').className).toBe('text-danger');
        expect(document.getElementById('req-length').querySelector('span').textContent).toBe('✗');
    });

    test('marks uppercase item as danger when no uppercase present', () => {
        updateChecklist('hello1!');
        expect(document.getElementById('req-upper').className).toBe('text-danger');
    });

    test('marks number item as danger when no digit present', () => {
        updateChecklist('Hello!!');
        expect(document.getElementById('req-number').className).toBe('text-danger');
    });

    test('marks special item as danger when no special character present', () => {
        updateChecklist('Hello1');
        expect(document.getElementById('req-special').className).toBe('text-danger');
    });
});

// ─── updateTotals ─────────────────────────────────────────────────────────────

describe('updateTotals', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <tfoot class="totals-row">
                    <tr>
                        <td id="total-income"></td>
                        <td id="total-expenses"></td>
                    </tr>
                </tfoot>
            </table>
        `;
    });

    test('displays summed income formatted as ₹ X.XX', () => {
        updateTotals([1000, 500, 250], [0, 0, 0]);
        expect(document.getElementById('total-income').textContent).toBe('₹ 1750.00');
    });

    test('displays summed expenses formatted as ₹ X.XX', () => {
        updateTotals([0, 0, 0], [200, 100, 50]);
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 350.00');
    });

    test('handles all-zero arrays', () => {
        updateTotals(new Array(12).fill(0), new Array(12).fill(0));
        expect(document.getElementById('total-income').textContent).toBe('₹ 0.00');
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 0.00');
    });

    test('handles decimal values with 2 dp output', () => {
        updateTotals([100.505, 200.495], [50.1, 49.9]);
        expect(document.getElementById('total-income').textContent).toBe('₹ 301.00');
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 100.00');
    });

    test('prefix is "₹ " (rupee symbol, one space)', () => {
        updateTotals([500], [250]);
        expect(document.getElementById('total-income').textContent).toMatch(/^₹ /);
        expect(document.getElementById('total-expenses').textContent).toMatch(/^₹ /);
    });

    test('full 12-month array is summed correctly', () => {
        const incomes  = new Array(12).fill(100);   // 1200
        const expenses = new Array(12).fill(50);    // 600
        updateTotals(incomes, expenses);
        expect(document.getElementById('total-income').textContent).toBe('₹ 1200.00');
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 600.00');
    });
});

// ─── getValues ────────────────────────────────────────────────────────────────

describe('getValues', () => {
    beforeEach(() => {
        // Build the 24 input fields (income + expense for each month)
        const inputs = MONTHS.map(m => `
            <input id="income-${m}"  type="number" value="0">
            <input id="expense-${m}" type="number" value="0">
        `).join('');
        document.body.innerHTML = inputs;
    });

    test('returns 12-element arrays for incomes and expenses', () => {
        const { incomes, expenses } = getValues();
        expect(incomes.length).toBe(12);
        expect(expenses.length).toBe(12);
    });

    test('reads income values correctly for every month', () => {
        MONTHS.forEach((m, i) => {
            document.getElementById('income-' + m).value = (i + 1) * 100;
        });
        const { incomes } = getValues();
        MONTHS.forEach((_, i) => {
            expect(incomes[i]).toBe((i + 1) * 100);
        });
    });

    test('reads expense values correctly for every month', () => {
        MONTHS.forEach((m, i) => {
            document.getElementById('expense-' + m).value = (i + 1) * 50;
        });
        const { expenses } = getValues();
        MONTHS.forEach((_, i) => {
            expect(expenses[i]).toBe((i + 1) * 50);
        });
    });

    test('empty inputs default to 0', () => {
        MONTHS.forEach(m => {
            document.getElementById('income-'  + m).value = '';
            document.getElementById('expense-' + m).value = '';
        });
        const { incomes, expenses } = getValues();
        expect(incomes.every(v => v === 0)).toBe(true);
        expect(expenses.every(v => v === 0)).toBe(true);
    });

    test('handles decimal input values', () => {
        document.getElementById('income-Jan').value  = '1500.75';
        document.getElementById('expense-Jan').value = '999.99';
        const { incomes, expenses } = getValues();
        expect(incomes[0]).toBeCloseTo(1500.75);
        expect(expenses[0]).toBeCloseTo(999.99);
    });
});
