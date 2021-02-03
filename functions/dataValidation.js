
module.exports = {
    /*
    returns the following errors
    0 - everithying is ok
    1 - firstname is invalid
    2 - lastname is invalid 
    3 - email is invalid
    4 - password is invalid
    5 - passwords does not match
    */
   validateRegistration : function (clientData)
  {
    
    const firstname = clientData["firstname"];
    const lastname = clientData["lastname"];
    const email = clientData["email"];
    const password = clientData["password"];
    const passwordAgain = clientData ["passwordAgain"];

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    //must contain least 8 characters, 1 number, 1 upper and 1 lowercase [duplicate]
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (password != passwordAgain) return 5;

    if (firstname == undefined || firstname.length < 2 || firstname.length > 20) return 1;
    if (lastname == undefined || lastname.length < 2 || lastname.length > 20) return 2;

    if (email == undefined || !emailRegex.test(email)) return 3;
    if (password == undefined || !passwordRegex.test(password) ) return 4;

    return 0;


  }
}
