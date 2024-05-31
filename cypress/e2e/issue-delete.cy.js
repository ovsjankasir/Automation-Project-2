describe("Issue delete", () => {
  let initialIssueCount;

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");

        // Wait for the backlog list to be visible before proceeding
        cy.get('[data-testid="board-list:backlog"]', { timeout: 30000 }).should(
          "be.visible"
        );

        // Get the initial count of issues in the backlog
        cy.get(
          '[data-testid="board-list:backlog"] [data-testid="list-issue"]',
          { timeout: 30000 }
        ).then(($issues) => {
          initialIssueCount = $issues.length;
        });

        cy.contains("This is an issue of type: Task.", {
          timeout: 30000,
        }).click();
      });
  });

  it("Deletes an issue and verifies the issue count decreases by one", () => {
    // Click on the trash icon button
    cy.get('i[data-testid="icon:trash"]').click();

    // Verify that the pop-up window is visible
    cy.get('[data-testid="modal:confirm"]').should("be.visible");

    // Click on the delete issue button
    cy.contains("div.sc-bxivhb.rljZq", "Delete issue").click();

    // Verify that the pop-up window is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Verify that the issue window is not visible
    cy.get(".sc-fOKMvo.eJoEKV").should("not.exist");

    // Verify that the base URL page is visible
    cy.url().should("eq", Cypress.config().baseUrl);

    // Verify that the issue text does not exist on the page
    cy.contains("This is an issue of type: Task.").should("not.exist");

    // Verify the issue count has decreased by one
    cy.get(
      '[data-testid="board-list:backlog"] [data-testid="list-issue"]'
    ).should(($issues) => {
      expect($issues.length).to.equal(initialIssueCount - 1);
    });
  });

  it("Cancelling the deletion", () => {
    // Click on the trash icon button
    cy.get('i[data-testid="icon:trash"]').click();

    // Verify that the pop-up window is visible
    cy.get('[data-testid="modal:confirm"]').should("be.visible");

    // Click on the cancel button
    cy.contains("div.sc-bxivhb.rljZq", "Cancel").click();

    // Verify that the pop-up window is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Verify that the issue window is still visible
    cy.get(".sc-fOKMvo.eJoEKV").should("be.visible");

    // Verify that the issue text is still present on the page
    cy.contains("This is an issue of type: Task.").should("be.visible");

    // Verify the issue count has not changed
    cy.get(
      '[data-testid="board-list:backlog"] [data-testid="list-issue"]'
    ).should(($issues) => {
      expect($issues.length).to.equal(initialIssueCount);
    });
  });
});
