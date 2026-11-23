/// <reference types="cypress" />

const aguardarLiberacaoLogin = (resposta) => {
    const retryAfter = resposta.headers['retry-after'];
    const segundos = Number(retryAfter);
    const disponivelEm = retryAfter !== undefined && Number.isFinite(segundos) && segundos >= 0
        ? Date.now() + segundos * 1000
        : Date.parse(retryAfter);

    if (!Number.isFinite(disponivelEm) || disponivelEm - Date.now() > 60000) {
        throw new Error('HTTP 429: o servidor nao informou Retry-After valido de ate 60 segundos.');
    }

    // O prazo vem da resposta real, sem pausa fixa ou temporizador customizado.
    return cy.wrap(null, { timeout: 60000 }).should(() => {
        expect(Date.now(), 'prazo Retry-After do TVmaze atingido').to.be.at.least(disponivelEm);
    });
};

const visitarPaginaLogin = (tentativasRestantes = 2) => {
    cy.visit('/account/login', { failOnStatusCode: false });
    return cy.wait('@paginaLoginTvmaze').then(({ response: resposta }) => {
        if (resposta.statusCode === 429) {
            if (tentativasRestantes === 0) {
                throw new Error('O TVmaze manteve HTTP 429 apos as novas consultas permitidas pelo servidor.');
            }

            return aguardarLiberacaoLogin(resposta).then(() => visitarPaginaLogin(tentativasRestantes - 1));
        }

        expect(resposta.statusCode, 'pagina de login disponivel').to.eq(200);
        return cy.get('#loginform-username').should('be.visible');
    });
};

Cypress.Commands.add('prepararVisitanteTvmaze', () => {
    // Reutiliza a sessao anonima criada pela navegacao normal do site.
    return cy.session('tvmaze-visitante', () => {
        cy.visit('/');
        cy.get('#searchform-q').should('be.visible');
    }, { cacheAcrossSpecs: true });
});

Cypress.Commands.add('abrirLoginTvmaze', () => {
    cy.prepararVisitanteTvmaze();
    cy.intercept({ method: 'GET', pathname: '/account/login' }).as('paginaLoginTvmaze');
    return visitarPaginaLogin();
});

Cypress.Commands.add('loginTvmaze', () => {
    return cy.env(['TVMAZE_USERNAME', 'TVMAZE_PASSWORD']).then((credenciais) => {
        const usuario = credenciais.TVMAZE_USERNAME;
        const senha = credenciais.TVMAZE_PASSWORD;

        if (!usuario || !senha) {
            throw new Error('Configure TVMAZE_USERNAME e TVMAZE_PASSWORD no cypress.env.json com uma conta do TVmaze. Consulte o README.md.');
        }

        cy.abrirLoginTvmaze();
        cy.get('#loginform-username').should('be.visible').type(usuario, { log: false, parseSpecialCharSequences: false });
        cy.get('#loginform-password').type(senha, { log: false, parseSpecialCharSequences: false });
        cy.get('#loginform-rememberme').uncheck();
        cy.get('#login button[type="submit"]').click();
        // O logout fica em um submenu oculto ate que o menu da conta seja aberto.
        cy.location('pathname').should('not.eq', '/account/login');
        cy.get('#site-header a[href="/account/logout"]').should('exist');
        cy.get('#site-header a.access[href="/account/login"]').should('not.exist');
    });
});

// O site alterna os elementos tambem por estilo inline, sem atualizar a classe hidden.
const estadoAcompanhamento = '#following .follow-toggle';

Cypress.Commands.add('validarAcompanhamentoTvmaze', (acompanhando) => {
    return cy.get(estadoAcompanhamento).filter(':visible').should('have.length', 1).and('be.visible').should((estado) => {
        expect(estado.text().trim(), 'estado de acompanhamento da serie').to.eq(acompanhando ? 'Following' : 'Follow');
    });
});

Cypress.Commands.add('definirAcompanhamentoTvmaze', (acompanhar) => {
    cy.get(estadoAcompanhamento).filter(':visible').should('have.length', 1).and('be.visible').then((estado) => {
        if ((estado.text().trim() === 'Following') !== acompanhar) {
            cy.intercept({ pathname: '/follow/toggle', query: { show_id: '169' } }).as('alterarAcompanhamento');
            cy.get('#following').click();
            cy.wait('@alterarAcompanhamento').its('response.statusCode').should('eq', 200);
        }
    });

    return cy.validarAcompanhamentoTvmaze(acompanhar);
});
