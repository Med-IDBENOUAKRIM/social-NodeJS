exports.signUpErrors = error => {
    let errors = {username: '', email: '', password: ''};

    if(error.message.includes("username"))
        errors.username = "username incorrect or already taken";

    if(error.message.includes("email"))
        errors.email = "email incorrect or already taken";

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes("username"))
        errors.username = "This username  already taken";

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes("email"))
        errors.email = "This email  already taken";

    return errors
}