Cypress.Commands.add(
  "ouiaId",
  { prevSubject: ["optional", "element"] },
  (subject, id: string, type?: string, options = {}) => {
    const typeSelector = type ? ouiaAttrSelector("component-type", type) : "";
    const idSelector = ouiaAttrSelector("component-id", id);
    if (subject) {
      if (type) {
        cy.wrap(subject, options).find(typeSelector + idSelector, options);
      } else {
        cy.wrap(subject).filter(idSelector);
      }
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(typeSelector + idSelector, options);
    }
  }
);

Cypress.Commands.add(
  "ouiaType",
  { prevSubject: ["optional", "element"] },
  (subject, type: string, options = {}) => {
    const typeSelector = ouiaAttrSelector("component-type", type);
    if (subject) {
      cy.wrap(subject, options).find(typeSelector, options);
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(typeSelector, options);
    }
  }
);

Cypress.Commands.add(
  "ouiaSafe",
  { prevSubject: ["element"] },
  (subject, options = {}) => {
    cy.wrap(subject).filter(ouiaSafeSelector(), options);
  }
);

const ouiaAttrSelector = (name: string, value?: string): string => {
  return `[data-ouia-${name}` + (value ? `='${value}']` : "]");
};

const ouiaSafeSelector = (): string => {
  return ouiaAttrSelector("safe", "true");
};

Cypress.Commands.add(
  "ouiaNavigationName",
  { prevSubject: ["optional", "element"] },
  (subject, value?: string, options = {}) => {
    const selector = ouiaAttrSelector("navigation-name", value);
    if (subject) {
      cy.wrap(subject, options).find(selector, options);
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(selector, options);
    }
  }
);

Cypress.Commands.add("login", () => {
  //https://docs.cypress.io/guides/core-concepts/conditional-testing#Element-existence
  cy.get("body", { timeout: 10000 })
    .should("be.visible")
    .then(($body) => {
      if ($body.find('div[class="truste_overlay"]').length) {
        // the form was found, do something else here
        cy.get("button:contains('Accept default')").click().should("not.exist");
      } else {
        cy.log("Cookie's choise is not present");
      }
    });
  cy.get("#username-verification").type(Cypress.env("USER"));
  cy.get("#login-show-step2").click();
  cy.get("#password")
    .should("be.visible")
    .type(Cypress.env("PASSWORD"), { log: false });
  cy.get("#rh-password-verification-submit-button").click();
});
