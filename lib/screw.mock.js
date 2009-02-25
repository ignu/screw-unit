Screw.Mock = function(obj, func, callback) {

    // store previous value
    if (!obj.previous_functions) obj.previous_functions = new Array();
    obj.previous_functions.push({ name: func, func : obj[func]});

    // replace the actual function
    obj[func] = function(f,a,k,e,r) {
        obj[func].was_called = true;
        return false;  // to cancel any further events.
     };

   obj.unmock = function(){
        while(obj.previous_functions.length > 0) {
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
  failure_message: function(expected, actual, not) {
    return $.print(expected) + "." + $.print(actual)
      + "was not called... " + not;
  }
};