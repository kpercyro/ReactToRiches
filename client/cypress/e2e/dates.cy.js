describe('Fetch all important dates', () => {
  beforeEach(() => {
    const mockAccountState = {
      value: {
        id: 53,
        first_name: 'Test',
        last_name: 'Account',
        email: 'sconces_nebula_0z@icloud.com',
        api_key: 'E0537ED520B74DE19CA42E952E197305',
      },
    };

    cy.window().then(win => {
      win.localStorage.setItem(
        'accountState',
        JSON.stringify({account: mockAccountState}),
      );
    });
  });

  it('can sign-in and view the Important Dates page', () => {
    cy.visit('/');

    cy.get('[data-testid=profile-menu]').click();
    cy.get('[data-testid=dates-menu-item]').click();
    cy.contains('UWaterloo Important Dates');
  });

  it('can fetch all dates', () => {
    cy.get('[data-testid=fetch-button]').click();
    cy.contains('Last day to arrange tuition and fees');
  });

  it('can open a specific date and view its details', () => {
    cy.get('[data-testid=date-371-tablerow]').last().click();
    cy.contains('This is also the last day to submit a ');
  });
});
