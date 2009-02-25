Screw.Mock = function(obj, func, callback) {

    // store previous value
    if (!obj.previous_functions) obj.previous_functions = new Array();
    obj.previous_functions.push({ name: func, func : obj[func]});

    // replace the actual function
    obj[func] = function(f, a, k, e, r) {
        obj[func].was_called = true;
        obj[func].parameters = [f,a,k,e,r];
        if (callback) return callback();
        return false;  // to cancel any further events.
    };

    obj[func].name = func;

    obj.unmock = function() {
        while (obj.previous_functions.length > 0) {
            var old_function = obj.previous_functions.pop();
            obj[old_function.name] = old_function.func;
        }
        obj.previous_functions = null;
    };
    return obj;
};


Screw.Matchers["have_been_called"] = {
    match: function(method, target) {
        return target.was_called;
    },
    failure_message: function(expected, actual, not) {  // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called.";
    }
};

Screw.Matchers["have_been_called_with"] = {
    match: function(parameters, target) {

        if (!target.was_called) return false;

        function match_parameters(expected, actual) {
            if (typeof expected == 'object') {
                for (property in expected) {
                    if (actual[property] != expected[property])
                        return false;
                }
                return true;
            }
            return expected == actual;
        }

        for (var counter = 0; counter < parameters.length; counter++) {
            if (parameters[counter] != any && !match_parameters(parameters[counter], target.parameters[counter]))
                return false;
        }

        return true;
    },
    failure_message: function(expected, actual, not) {   // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called with " + $.print(expected) + " but was called with " +
               $.print(actual.parameters);
    }
};

var any = "anything";