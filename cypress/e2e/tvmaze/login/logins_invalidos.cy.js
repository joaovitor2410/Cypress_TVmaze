/// <reference types="cypress" />

context('Validacao de logins invalidos no TVmaze', () => {
    beforeEach(() => {
        cy.abrirLoginTvmaze();
    });

    it('CT-L03 - Validar usuario em branco', () => {
        cy.get('#loginform-username').clear();
        cy.get('#loginform-password').type('senha_apenas_para_teste', { log: false });
        cy.get('#login button[type="submit"]').click();
        cy.get('.field-loginform-username .help-block').should('contain.text', 'cannot be blank');
        cy.get('a[href="/account/logout"]').should('not.exist');
    });

    it('CT-L04 - Validar senha em branco', () => {
        cy.get('#loginform-username').type('qa_usuario_inexistente_202622');
        cy.get('#loginform-password').clear();
        cy.get('#login button[type="submit"]').click();
        cy.get('.field-loginform-password .help-block').should('have.text', 'Password cannot be blank.');
        cy.get('a[href="/account/logout"]').should('not.exist');
    });

    it('CT-L05 - Validar usuario e senha em branco', () => {
        cy.get('#loginform-username').clear();
        cy.get('#loginform-password').clear();
        cy.get('#login button[type="submit"]').click();
        cy.get('.field-loginform-username .help-block').should('contain.text', 'cannot be blank');
        cy.get('.field-loginform-password .help-block').should('have.text', 'Password cannot be blank.');
        cy.get('a[href="/account/logout"]').should('not.exist');
    });

    it('CT-L06 - Validar usuario inexistente', () => {
        cy.get('#loginform-username').type('qa_usuario_inexistente_202622');
        cy.get('#loginform-password').type('senha_incorreta_202622', { log: false });
        cy.get('#login button[type="submit"]').click();
        cy.get('.field-loginform-username .help-block').should('have.text', 'Unknown username/email');
        cy.get('a[href="/account/logout"]').should('not.exist');
    });
});
