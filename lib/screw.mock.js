Screw.Mock = function(obj, func, callback) {
       obj["previous_"+ func] = obj[func];

        // replace the actual function
        obj[func] = function(f,a,k,e,r) {
//            obj[func + "parameters_"] = [f,a,k,e,r];
            obj[func].was_called = true;
//            if (callback)
//                return callback();
            return false;  // to cancel any further events.
        };

//        obj[func].revert = function(){
//            obj[func] = obj["previous_" + func];
//            obj["previous_" + func] = null;
//        };

//        obj["Parameters"] = function(name) {
//            return obj[name + "parameters_"];
//        };

        return obj;
    };


Screw.Matchers["have_been_called"] = {
  match: function(method, target) {
    return target.was_called;
  },
  failure_message: function(expected, actual, not) {
    return $.print(expected) + "." + $.print(actual)
      + "was not called... " + not;
  }
};