class Loginpage{
    constructor(){
        this.campEmail = "#user-name";
        this.campPass = "#password";
        this.camplogin = "#login-button";
    }

    setemail(email){
        cy.get(this.campEmail).type(email)
        
    }

    setpass(password){
        cy.get(this.campPass).type(password)
    }

    buttonLogin(){
        cy.get(this.camplogin).click();
    }

    login(email, password){
        this.setemail(email);
        this.setpass(password);
        this.buttonLogin();
    }

}

export default Loginpage;
         


