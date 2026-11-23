/// <reference types="cypress" />

context('Validacao de buscas invalidas no TVmaze', () => {
    beforeEach(() => {
        cy.prepararVisitanteTvmaze();
        cy.visit('/');
    });

    it('CT-B03 - Validar busca sem resultados', () => {
        cy.get('#searchform-q').should('be.visible').type('zzzxqvserieinexistente202622{enter}');
        cy.location('pathname').should('eq', '/search');
        cy.get('#searchform-q').should('have.value', 'zzzxqvserieinexistente202622');
        cy.get('#content').should('contain.text', 'Pardon us, but no shows or people matching your query were found.');
        cy.get('#content .showname').should('not.exist');
    });
});
