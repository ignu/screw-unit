Screw.Mock = function(obj, func, callback) {

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
        return target.parameterStack.length > 0;
    },
    failure_message: function(expected, actual, not) {  // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called.";
    }
};

Screw.Matchers["have_been_called_exactly"] = {
    match: function(count, target) {
        return target.parameterStack.length == count;
     },
    failure_message: function(expected, actual, not) {   // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called exactly " + $.print(expected) + " times ";
    }
};

Screw.Matchers["have_been_called_with"] = {
    match: function(parameters, mock) {

        if (!mock.parameterStack.length > 0 ) return false;

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

            if (parameters[counter] != any) {

                var match_found = false;

                for(var parmStackCounter = 0; parmStackCounter < mock.parameterStack.length; parmStackCounter++)
                {
                    if (match_parameters(parameters[counter], mock.parameterStack[parmStackCounter][counter]))
                        match_found = true;
                }

                if (!match_found)
                    return false;
            }
        }

        return true;
    },
    failure_message: function(expected, actual, not) {   // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called with " + $.print(expected) + " but was called with " +
               $.print(actual.parameterStack[0]);
    }
};

var any = "anything";