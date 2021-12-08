
describe('Google Search', () => {
  beforeEach(() => {
    cy.fixture('searchdata.json')
      .as('urldata')
      .then((searchdata) => {
        cy.visit(searchdata.url)
      })
  });

  it('Testing with no input values', () => {
    cy.get('[role="combobox"]').should("be.empty").type('{enter}')
  });

  it('Testing with input values', () => {
    cy.fixture('searchdata.json').then((searchdata) => {
      cy.get('[role="combobox"]').should("be.empty").type(searchdata.searchvalue)
      cy.get('[aria-label="Clear"]').should('be.visible')
      cy.get('[role="combobox"]').clear()
      cy.get('[role="combobox"]').type(searchdata.searchvalue).then(() => {
        cy.wait(3000)
        cy.get('li').should('contain', searchdata.searchvalue)
        cy.get('li').eq(1).click()
      })
    })
  });

  it('Testing invalid input values', () => {
    cy.fixture('searchdata.json').then((searchdata) => {
      cy.get('[role="combobox"]').type(searchdata.invalidvalue).type('{enter}')
      cy.get('[id="search"]').within(() => {
        cy.xpath('/html/body/div[7]/div/div[10]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div[1]').should('contain', "It looks like there aren't many great matches for your search")
     })
    })
  });

  it("Verifying gmail url", () => {
    cy.get("a").contains("Gmail").should("have.attr", "href", "https://mail.google.com/mail/&ogbl").click();
    cy.url().should("include", "https://www.google.com/intl/en-GB/gmail/about/#")
  });

  it("Verify image url and upload", () => {
    const image = "Automation tester image.jpg";
    cy.get("[id='gb']").contains("Images").should("have.attr", "href", "https://www.google.co.in/imghp?hl=en&ogbl").click();
    cy.get('[role="combobox"]').should("be.empty");
    cy.get('[aria-label="Search by voice"][role="button"]').should("be.visible")
    cy.get('[role="button"][aria-label="Search by image"]').should("be.visible").click()
    cy.fixture('searchdata.json').then((searchdata) => {
      cy.get('[id="Ycyxxc"]').type(searchdata.imageurl)
      cy.get('[id="RZJ9Ub"]').click()
    })
    cy.go(-1)
    cy.get('[role="button"][aria-label="Search by image"]').click()
    cy.get('[id="QDMvGf"]').within(() => {
      cy.get("a").contains("Upload an image").should("have.attr", "href", "about:invalid#zClosurez").click();
      cy.get('input[id="awyMjb"]').attachFile(image, { timeout: 3000, });
    });
  });
  
});
