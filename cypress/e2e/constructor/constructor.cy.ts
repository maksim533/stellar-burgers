import { deleteCookie, setCookie } from 'src/utils/cookie';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    setCookie(
      'accessToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGEyMGZjZDVjYTMwMDAxY2ZmYzkzOCIsImlhdCI6MTc1Mzg5MDA4MCwiZXhwIjoxNzUzODkxMjgwfQ.fuUe08lNg5HgVXmXpyZ4K9ctPsO4ODTO8D_wVkWiyBY'
    );
    localStorage.setItem(
      'refreshToken',
      'd50dfa261339bf55fd692ec47e9045bd752d9a8467991c13f731ae024fb7d36616235ba11f27b1f5'
    );
    cy.intercept('GET', `/api/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('GET', `/api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('Проверка добавление ингредиентов в конструктор', () => {
    cy.get('[data-test="constructor"]').as('constructor');
    cy.get('[data-test="Булки"]').children().first().children('button').click();
    cy.get('[data-test="Начинки"]')
      .children()
      .first()
      .children('button')
      .click();
    cy.get('[data-test="Соусы"]').children().first().children('button').click();
    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('@constructor').should('contain', 'Соус Spicy-X');
  });

  it('Проверка открытия и закрытия модального окна', () => {
    cy.get('[data-test="constructor-ingredient"]').first().click();
    cy.get('[data-test="modal"]').should('be.visible');

    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('Проверка закрытия модального окна по клику оверлея', () => {
    cy.get('[data-test="constructor-ingredient"]').first().click();
    cy.get('[data-test="modal"]').should('be.visible');

    cy.get('[data-test="modal-overlay"]').click({ force: true });
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('Проверка составления заказа и отправка его на сервер', () => {
    cy.intercept('POST', `/api/orders`, {
      fixture: 'order.json'
    }).as('postOrder');
    cy.get('[data-test="constructor"]').as('constructor');
    cy.get('[data-test="Булки"]').children().first().children('button').click();
    cy.get('[data-test="Начинки"]')
      .children()
      .first()
      .children('button')
      .click();
    cy.get('[data-test="Соусы"]').children().first().children('button').click();
    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('@constructor').should('contain', 'Соус Spicy-X');

    cy.get('@constructor').contains('Оформить заказ').click();
    cy.get('[data-test="modal"]').should('be.visible');
    cy.get('[data-test="modal"]').should('contain', '85386');
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');
    cy.get('@constructor').should('not.contain', 'Краторная булка N-200i');
    cy.get('@constructor').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('@constructor').should('not.contain', 'Соус Spicy-X');
    cy.wait('@postOrder');
  });
});
