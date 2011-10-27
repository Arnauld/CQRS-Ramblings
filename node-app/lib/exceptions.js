
// see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
// Create a new object, that prototypally inherits from the Error constructor.  
function MyError(message) {  
    this.name = "MyError";  
    this.message = message || "Default Message";  
}  
MyError.prototype = new Error();  
MyError.prototype.constructor = MyError;  

/**
 *  UnsupportedException
 */
function UnsupportedException(message) {
	this.name = "UnsupportedException";
	this.message = message || "Unsupported call";
}
UnsupportedException.prototype = new Error();
UnsupportedException.prototype.constructor = UnsupportedException

exports.UnsupportedException = UnsupportedException;


/**
 *  OptimisticLockingException
 */
function OptimisticLockingException(aggregate_id, actual_version, expected_version) {
	this.name = "OptimisticLockingException";
	this.message = "Mid-air collision! for aggregate <" + aggregate_id + " expect " + expected_version + " but got " + actual_version;
	this.actual_version = actual_version;
	this.expected_version = expected_version;
	this.aggregate_id = aggregate_id;
}
OptimisticLockingException.prototype = new Error();
OptimisticLockingException.prototype.constructor = OptimisticLockingException

exports.OptimisticLockingException = OptimisticLockingException;


/**
 *  AggregateNotFound
 */
function AggregateNotFound(aggregate_id) {
	this.name = "AggregateNotFound";
	this.message = "Aggregate <" + aggregate_id + "> not found";
	this.aggregate_id = aggregate_id;
}
AggregateNotFound.prototype = new Error();
AggregateNotFound.prototype.constructor = AggregateNotFound

exports.AggregateNotFound = AggregateNotFound;