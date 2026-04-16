import Loginpage from "../pages/Loginpage";

describe('login en swapp', () => {
    const loginPage = new Loginpage();

    it('login ok', ()=> {
        cy.visit('/')
        loginPage.login("standard_user", "secret_sauce")
    })



})