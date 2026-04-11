const { updateTotals } = require('../script');

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

describe('updateTotals', () => {
    test('displays summed income formatted as ₹ X.XX', () => {
        updateTotals([1000, 500, 250], [0, 0, 0]);
        expect(document.getElementById('total-income').textContent).toBe('₹ 1750.00');
    });

    test('displays summed expenses formatted as ₹ X.XX', () => {
        updateTotals([0, 0, 0], [200, 100, 50]);
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 350.00');
    });

    test('handles all-zero values', () => {
        updateTotals(new Array(12).fill(0), new Array(12).fill(0));
        expect(document.getElementById('total-income').textContent).toBe('₹ 0.00');
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 0.00');
    });

    test('handles decimal values and rounds to 2 dp', () => {
        updateTotals([100.505, 200.495], [50.1, 49.9]);
        expect(document.getElementById('total-income').textContent).toBe('₹ 301.00');
        expect(document.getElementById('total-expenses').textContent).toBe('₹ 100.00');
    });
});
