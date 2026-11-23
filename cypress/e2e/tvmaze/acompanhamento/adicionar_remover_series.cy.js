/// <reference types="cypress" />

context('Validacao de series acompanhadas no TVmaze', () => {
    let acompanhavaSerie;

    beforeEach(() => {
        acompanhavaSerie = undefined;
        cy.loginTvmaze();
        cy.visit('/shows/169/breaking-bad');
        cy.get('#following .follow-toggle').filter(':visible').should('have.length', 1).and('be.visible').then((estado) => {
            acompanhavaSerie = estado.text().trim() === 'Following';
        });
    });

    afterEach(() => {
        // Restaura o estado original da conta mesmo quando uma validacao falhar.
        if (acompanhavaSerie !== undefined) {
            cy.visit('/shows/169/breaking-bad');
            cy.definirAcompanhamentoTvmaze(acompanhavaSerie);
            cy.reload();
            cy.validarAcompanhamentoTvmaze(acompanhavaSerie);
        }
    });

    it('CT-A02 - Validar adicao de serie aos acompanhamentos', () => {
        cy.definirAcompanhamentoTvmaze(false);
        cy.definirAcompanhamentoTvmaze(true);
        cy.reload();
        cy.validarAcompanhamentoTvmaze(true);
    });

    it('CT-A03 - Validar remocao de serie dos acompanhamentos', () => {
        cy.definirAcompanhamentoTvmaze(true);
        cy.definirAcompanhamentoTvmaze(false);
        cy.reload();
        cy.validarAcompanhamentoTvmaze(false);
    });
});
