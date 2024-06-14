describe("Issue create and time tracking", () => {
  const createIssue = (title, description) => {
    // Visit the issue creation URL
    cy.visit(Cypress.env("baseUrl") + "project/board?modal-issue-create=true");

    // Wait for the issue creation modal to appear
    cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
      "be.visible"
    );

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(description);
      cy.get(".ql-editor").should("have.text", description);
      cy.get('input[name="title"]').type(title);
      cy.get('input[name="title"]').should("have.value", title);
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('button[type="submit"]').click();
    });

    // Check for the issue in the board list
    cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should(
      "contain.text",
      title
    );
  };

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should(
          "be.visible"
        );
      });
  });

  it("Time logging", () => {
    createIssue("ABC", "ABC");

    // Open the issue that was just created
    cy.contains("p.sc-kfGgVZ.duybNU", "ABC", { timeout: 30000 }).click();
    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).should(
      "be.visible"
    );

    // Click on the time tracking section
    cy.get(".sc-rBLzX.irwmBe").click();

    // Ensure the time tracking modal is visible
    cy.get(".sc-rBLzX.irwmBe").should("be.visible");

    cy.get(".sc-laTMn.gQWBhO").click();

    // Write number 2 to the first input field
    cy.get("input.sc-dxgOiQ.HrhWu").eq(0).click();
  });
});
