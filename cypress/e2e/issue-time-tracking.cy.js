describe("Issue create and time tracking", () => {
  const createIssue = (title, description) => {
    cy.visit(Cypress.env("baseUrl") + "project/board?modal-issue-create=true");
    cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
      "be.visible"
    );

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(description);
      cy.get('input[name="title"]').type(title);
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
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

  it("Should allow tracking estimation time on an issue", () => {
    createIssue("ABC", "ABC");
    cy.contains("p.sc-kfGgVZ.duybNU", "ABC", { timeout: 30000 }).click();
    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).should(
      "be.visible"
    );
    cy.contains("div", "No time logged").should("be.visible");

    cy.get('input[placeholder="Number"]').clear().type("10");
    cy.wait(1000);
    cy.contains("div", "10h estimated").should("be.visible");
    cy.get(".sc-bdVaJa.fuyACr").click();
    cy.contains("p.sc-kfGgVZ.duybNU", "ABC", { timeout: 30000 })
      .first()
      .click();
    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).should(
      "be.visible"
    );
    cy.contains("div", "10h estimated").should("be.visible");

    //TEST CASE 2==============================================================================
    // Change estimation time to 20
    cy.get('input[placeholder="Number"]').clear().type("20");
    cy.wait(1000);
    cy.contains("div", "20h estimated").should("be.visible");
    cy.get(".sc-bdVaJa.fuyACr").click();
    cy.contains("p.sc-kfGgVZ.duybNU", "ABC", { timeout: 30000 })
      .first()
      .click();

    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).should(
      "be.visible"
    );

    // Add assertion that estimated time is 20 hours
    cy.contains("div", "20h estimated").should("be.visible");

    //TEST CASE 3==============================================================================
    // User removes estimation
    cy.get('input[placeholder="Number"]').clear();
    cy.wait(1000);
    cy.contains("div", "No time logged").should("be.visible");
    cy.get(".sc-bdVaJa.fuyACr").click();
    cy.contains("p.sc-kfGgVZ.duybNU", "ABC", { timeout: 30000 })
      .first()
      .click();
    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).should(
      "be.visible"
    );

    // Add assertion that estimation time is removed
    cy.contains("div", "No time logged").should("be.visible");
  });
});
