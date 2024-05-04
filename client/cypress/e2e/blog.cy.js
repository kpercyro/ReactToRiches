describe('Write a new blog post and view it', () => {
  beforeEach(() => {
    const mockAccountState = {
      value: {
        id: 42,
        first_name: 'Test',
        last_name: 'Account',
        photo_url: '',
      },
    };

    cy.window().then(win => {
      win.localStorage.setItem(
        'accountState',
        JSON.stringify({account: mockAccountState}),
      );
    });
  });

  it('can sign-in and view the blog page', () => {
    cy.visit('/');

    cy.get('[data-testid=social-menu]').click();
    cy.get('[data-testid=blog-menu-item]').click();
    cy.contains('View all blog posts');
  });

  it('can write a new blog post', () => {
    cy.get('[data-testid=writepost-button]').click();
    cy.contains('Write a new blog post');

    cy.get('[data-testid=title-textfield]').type('Test Title');
    cy.get('[data-testid=body-textfield]').type('Test post body');
    cy.get('[data-testid=successstory-chip]').click();
    cy.get('[data-testid=submit-button]').click();

    cy.contains('View all blog posts');
    cy.contains('Test Title');
    cy.contains('Test post body');
  });

  it('can open the new blog post in reader view and write a comment', () => {
    cy.get('[data-testid=post-42-tablerow]').last().click();
    cy.contains('Return to all posts');

    cy.get('[data-testid=addcomment-button]').click();
    cy.get('[data-testid=writecomment-textfield]').type('Test comment');
    cy.get('[data-testid=submit-button]').click();

    cy.contains('Test comment');
  });
});
