// describe("User", () => {
    
//     describe("#create()", => {

//         it("should create a User object with a name, valid email and password and zipcode", (done) => {
//             User.create({
//                 firstName: "Kenton",
//                 lastName: "Wan",
//                 email: "email@example.com",
//                 password: "password",
//                 zipcode: "90024"
//             })
//             .then((user)=> {
//                 expect(user.firstName).toBe("Kenton");
//                 expect(user.email).toBe("email@example.com");
//                 expect(user.password).toBe("password");
//                 done();
//             })
//             .catch((err)=> {
//                 console.log(err);
//                 done();
//             })
//         })
//     })
// })