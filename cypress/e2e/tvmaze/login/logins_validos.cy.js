/// <reference types="cypress" />

context('Validacao de logins validos no TVmaze', () => {
    beforeEach(() => {
        cy.loginTvmaze();
    });

    it('CT-L01 - Validar login com usuario e senha corretos', () => {
        cy.get('#site-header a[href="/account/logout"]').should('exist');
        cy.get('#site-header a.access[href="/account/login"]').should('not.exist');
    });

    it('CT-L02 - Validar que o login permanece ao atualizar a pagina', () => {
        cy.reload();
        cy.get('#site-header a[href="/account/logout"]').should('exist');
        cy.get('#site-header a.access[href="/account/login"]').should('not.exist');
    });
});
