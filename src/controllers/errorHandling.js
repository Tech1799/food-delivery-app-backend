// handle errors
module.exports = function (handleErrors){
    console.log(handleErrors.message, handleErrors.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (handleErrors.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (handleErrors.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (handleErrors.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (handleErrors.message.includes('user validation failed')) {
      // console.log(handleErrors);
      Object.values(handleErrors.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
}