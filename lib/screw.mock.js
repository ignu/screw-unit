Screw.Mock = function(obj, func, callback) {

        if (obj.expecting) {
            throw("This object is either being mocked twice without a rest, or actually has" +
                    "conflicting method names.");            
        }
    
        obj["previous_"+ func] = obj[func];
        obj[func + "wasCalled"] = false;

        // replace the actual function
        obj[func] = function(f,a,k,e,r) {
            obj[func + "parameters_"] = [f,a,k,e,r];
            obj[func + "wasCalled"] = true;
            if (callback)
                return callback();
            return false;  // to cancel any further events.
        };


        var revert = function(){
            obj[func] = obj["previous_" + func];
        };

        obj["Parameters"] = function(name) {
            return obj[name + "parameters_"];
        };
    };


Screw.Matchers["have_called"] = {
  match: function(method, target) {
    return target[method + "wasCalled"];
  },
  failure_message: function(expected, actual, not) {
    return $.print(expected) + "." + $.print(actual)
      + "was not called... " + not;
  }
};