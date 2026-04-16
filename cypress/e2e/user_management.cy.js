describe('User Management API E2E Tests - Deterministic', () => {
  const apiUrl = Cypress.env('apiUrl');
  const authToken = 'mysecrettoken';

  // Static user data
  const testUser = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    age: 5    
  };

  const updatedUser = {
    name: "Jane Updated",
    email: "jane.doe@example.com",
    age: 35
  };

    // Helper to ensure clean state for specific tests if needed
  const cleanup = (email) => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${email}`,
      headers: { 'Authentication': 'mysecrettoken' },
      failOnStatusCode: false
    });
  };

  beforeEach(() => {
    // PRE-TEST CLEANUP: 
    // We try to delete the user first so the 'Create' tests don't fail with 409.
    // failOnStatusCode: false is used because if the user doesn't exist, a 404 is fine here.
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${testUser.email}`,
      headers: { 'Authentication': authToken },
      failOnStatusCode: false 
    });
  });

  it('should create the static user (POST /users)', () => {
    cy.request('POST', `${apiUrl}/users`, testUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.email).to.eq(testUser.email);
      expect(response.body.name).to.eq("Jane Doe");
    });
  });

  it('should return 409 when creating the same user twice', () => {
    // Create first time
    cy.request('POST', `${apiUrl}/users`, testUser);
    
    // Attempt second time
    cy.request({
      method: 'POST',
      url: `${apiUrl}/users`,
      body: testUser,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(409);
    });
  });

  it('should fetch the static user (GET /users/{email})', () => {
    cy.request('POST', `${apiUrl}/users`, testUser);
    cy.request('GET', `${apiUrl}/users/${testUser.email}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(testUser.name);
    });
  });

  it('should update the static user (PUT /users/{email})', () => {
    cy.request('POST', `${apiUrl}/users`, testUser);
    
    cy.request('PUT', `${apiUrl}/users/${testUser.email}`, updatedUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("Jane Updated");
      expect(response.body.age).to.eq(35);
    });
  });

  it('should delete the static user successfully', () => {
    cy.request('POST', `${apiUrl}/users`, testUser);
    
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/users/${testUser.email}`,
      headers: { 'Authentication': authToken }
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });
    it('BUG SEARCH: Age Maximum Boundary (POST /users with age 151)', () => {
    const email = "too_old@example.com";
    cleanup(email);

    cy.request({
      method: 'POST',
      url: `${apiUrl}/users`,
      body: { name: "Old Person", email: email, age: 151 }, // Spec says max 150
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400, "Should return 400 for age above maximum 150");
    });
  });

    it('BUG SEARCH: Path and Body Email Mismatch (PUT /users/{email})', () => {
    const urlEmail = "user_a@example.com";
    const bodyEmail = "user_b@example.com";
    
    cleanup(urlEmail);
    cleanup(bodyEmail);

    // Create User A
    cy.request('POST', `${apiUrl}/users`, { name: "User A", email: urlEmail, age: 20 });

    // Attempt to update User A using User A's URL, but putting User B's email in the JSON body
    cy.request({
      method: 'PUT',
      url: `${apiUrl}/users/${urlEmail}`,
      body: {
        name: "Malicious Update",
        email: bodyEmail, // Mismatch!
        age: 25
      },
      failOnStatusCode: false
    }).then((response) => {
      /* 
         Logic: Usually, an API should either:
         1. Return 400 because the URL and Body don't match.
         2. Ignore the email in the body and only update User A.
         
         If it creates User B or overwrites User A's email without checking 
         for duplicates, it is a bug.
      */
      expect(response.status).to.be.oneOf([400, 409], "API should reject mismatched body/path emails");
    });
  });

});