/// <reference types="cypress" />

context('Validacao de acompanhamento sem login no TVmaze', () => {
    beforeEach(() => {
        cy.prepararVisitanteTvmaze();
        cy.visit('/shows/169/breaking-bad');
    });

    it('CT-A01 - Validar que acompanhar uma serie exige autenticacao', () => {
        cy.get('#following').should('have.class', 'js-needlogin').click();
        cy.get('#modal').should('be.visible').and('contain.text', 'Login');
        cy.get('#modal').should('contain.text', 'You have to be logged in to use this functionality');
        cy.get('#modal input[name="LoginForm[username]"]').should('be.visible');
        cy.get('#modal input[name="LoginForm[password]"]').should('be.visible');
        cy.validarAcompanhamentoTvmaze(false);
    });
});
