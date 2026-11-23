/// <reference types="cypress" />

context('Validacao de buscas validas no TVmaze', () => {
    beforeEach(() => {
        cy.prepararVisitanteTvmaze();
        cy.visit('/');
    });

    it('CT-B01 - Validar busca de serie pelo titulo', () => {
        cy.get('#searchform-q').should('be.visible').type('Breaking Bad{enter}');
        cy.location('pathname').should('eq', '/search');
        cy.get('.showname a[href="/shows/169/breaking-bad"]').should('be.visible').and('have.text', 'Breaking Bad');
    });

    it('CT-B02 - Validar acesso aos detalhes da serie encontrada', () => {
        cy.get('#searchform-q').type('Breaking Bad{enter}');
        cy.get('.showname a[href="/shows/169/breaking-bad"]').click();
        cy.location('pathname').should('eq', '/shows/169/breaking-bad');
        cy.get('h1.show-for-medium').should('have.text', 'Breaking Bad');
        cy.get('#general-information article').should('contain.text', 'Walter White');
        cy.get('#following').should('be.visible');
    });
});
