describe('Sign-in to an account, then sign-out', () => {
  it('can view the home page', () => {
    cy.visit('/');
    cy.contains('Sign-in to your account');
  });

  it('can sign-in to an account', () => {
    cy.get('[data-testid=email-textfield]').type(
      'test_account@test.uwaterloo.ca',
    );
    cy.get('[data-testid=password-textfield]').type('12345678');
    cy.get('[data-testid=submit-button]').click();
    cy.contains('Welcome, Test');
  });

  it('can sign-out of an account', () => {
    cy.get('[data-testid=signout-button]').click();
    cy.contains('Sign-in to your account');
  });
});
