const imports = [
    require('./default.intent'),
    require('./new-trip.intent'),
];

let modulesToExport = {};
imports.forEach((anImport) => {
    modulesToExport = Object.assign(modulesToExport, anImport);
});

module.exports = modulesToExport;
