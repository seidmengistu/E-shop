/*

The below code defines a custom error class named ErrorHandler, which extends the built-in Error class in JavaScript.
 This custom error class allows you to create and handle specific types of errors with additional properties, such as a custom statusCode property.

Let's break down the code step by step:

1:The ErrorHandler class is declared and extends the built-in Error class. By extending Error, the ErrorHandler class inherits all the properties and methods of the Error class.

2:The constructor function is defined for the ErrorHandler class. When a new instance of ErrorHandler is created, this constructor function will be called.

3:The constructor function takes two parameters: message and statusCode. These parameters are used to set the message and statusCode properties of the ErrorHandler instance.

4:super(message) is called inside the constructor, which calls the constructor of the parent class (Error in this case).
 The message parameter passed to the ErrorHandler constructor is forwarded to the Error class constructor, allowing the message property of the error object to be set.

5:The statusCode parameter is used to set the statusCode property of the ErrorHandler instance.

6:Error.captureStackTrace(this, this.constructor) is used to capture the stack trace of the error instance. 
This will provide a stack trace with detailed information about the point in the code where the ErrorHandler was created, making it easier to debug.

7:Finally, the ErrorHandler class is exported as a module so that it can be used in other parts of the codebase.

To use this custom error class, you would typically create a new instance of ErrorHandler with an appropriate message and statusCode and throw it when you encounter an error situation that matches the error condition handled by this custom error class.

For example:

javascript

const ErrorHandler = require('./ErrorHandler');

// Example usage
function someFunction() {
  // Some error condition
  if ( some condition ) {
    throw new ErrorHandler('Some error message', 404);
  }
}
In this example, when someFunction() is called and the specified error condition is met, it will throw an instance of the ErrorHandler class with the given message and status code. This can be caught and handled by an appropriate error handler in the calling code or higher up in the call stack.
*/
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        

        Error.captureStackTrace(this,this.constructor);

    }
    
}
module.exports = ErrorHandler