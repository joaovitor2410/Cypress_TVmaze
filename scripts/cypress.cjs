const { spawnSync } = require('node:child_process');

// Alguns terminais de IDE herdam esta variavel e impedem o Cypress de iniciar.
const ambiente = { ...process.env };
delete ambiente.ELECTRON_RUN_AS_NODE;

const resultado = spawnSync(process.execPath, [
    require.resolve('cypress/bin'),
    ...process.argv.slice(2),
], {
    env: ambiente,
    stdio: 'inherit',
});

if (resultado.error) {
    console.error(`Nao foi possivel iniciar o Cypress: ${resultado.error.message}`);
}

process.exitCode = resultado.status ?? 1;
