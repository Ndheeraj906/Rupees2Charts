// Mock Chart.js so Jest doesn't try to run canvas APIs
const Chart = jest.fn().mockImplementation(() => ({
    data: { datasets: [{ data: [] }, { data: [] }] },
    update: jest.fn(),
}));
module.exports = Chart;
module.exports.default = Chart;
