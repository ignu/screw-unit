Screw.Mock = function(obj, func, callback) {

    Screw.Mock.mocks.push(obj);

    Screw.current_description().add_after(function() { obj.unmock();});
    
    // store previous value
    if (!obj.previous_functions) obj.previous_functions = new Array();
    obj.previous_functions.push({ name: func, func : obj[func]});

    // replace the actual function
    obj[func] = function(f, a, k, e, r) {
        obj[func].parameterStack.push([f,a,k,e,r]);
        if (callback) return callback();
        return false;  // to cancel any further events.
    };

    obj[func].parameterStack = [];

    obj[func].name = func;

    obj.unmock = function() {
        while (obj.previous_functions && obj.previous_functions.length > 0) {
            var old_function = obj.previous_functions.pop();
            obj[old_function.name] = old_function.func;
        }
        obj.previous_functions = null;
    };
    return obj;
};

Screw.Mock.mocks = [];
Screw.Mock.reset_mocks = function() {
    var obj;
    while(obj = Screw.Mock.mocks.pop())
    {
        obj.unmock();
    }
};
var any = "anything";

