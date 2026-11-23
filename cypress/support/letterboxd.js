/// <reference types="cypress" />

Cypress.Commands.add('loginLetterboxd', () => {
    return cy.env(['LETTERBOXD_USERNAME', 'LETTERBOXD_PASSWORD']).then((credenciais) => {
        const usuario = credenciais.LETTERBOXD_USERNAME;
        const senha = credenciais.LETTERBOXD_PASSWORD;

        if (!usuario || !senha) {
            throw new Error('Configure LETTERBOXD_USERNAME e LETTERBOXD_PASSWORD no cypress.env.json. Consulte o README.md.');
        }

        cy.visit('/');
        cy.get('#header .sign-in-menu a').should('be.visible').click();
        cy.get('#signin #username').should('be.visible').type(usuario, { log: false, parseSpecialCharSequences: false });
        cy.get('#signin #password').type(senha, { log: false, parseSpecialCharSequences: false });
        cy.get('#signin input[type="submit"]').click();
        cy.get('#header .js-nav-account').should('be.visible');
        cy.get('#header .js-nav-account .toggle-menu').should('contain.text', usuario);
    });
});

// O aria-label muda quando o mouse fica sobre um filme ja adicionado.
const botaoWatchlist = '#userpanel button[aria-label*="watchlist"]';
const estaNaWatchlist = (botao) => !botao.attr('aria-label').startsWith('Add this ');

Cypress.Commands.add('definirWatchlistLetterboxd', (adicionar) => {
    cy.get(botaoWatchlist).should('be.visible').then((botao) => {
        if (estaNaWatchlist(botao) !== adicionar) {
            cy.wrap(botao).click();
        }
    });

    return cy.get(botaoWatchlist).should((botao) => {
        expect(estaNaWatchlist(botao), 'filme na watchlist').to.eq(adicionar);
    });
});

Cypress.Commands.add('validarWatchlistLetterboxd', (adicionado) => {
    return cy.get(botaoWatchlist).should('be.visible').should((botao) => {
        expect(estaNaWatchlist(botao), 'filme na watchlist').to.eq(adicionado);
    });
});
