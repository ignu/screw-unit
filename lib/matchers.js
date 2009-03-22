var Screw = {};
Screw.Matchers = (function($) {
  return matchers = {
    equal: {
      match: function(expected, actual) {
        if(expected == actual) return true;
        if(actual == undefined) return false;

        if (expected instanceof Array) {
          if (!(actual instanceof Array)) return false;
          for (var i = 0; i < actual.length; i++)
            if (!Screw.Matchers.equal.match(expected[i], actual[i])) return false;
          return actual.length == expected.length;
        } else if (expected instanceof Object) {
          for (var key in expected)
            if (!this.match(expected[key], actual[key])) return false;
          for (var key in actual)
            if (!this.match(actual[key], expected[key])) return false;
          return true;
        }
        return false;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not equal ' : ' to equal ') + $.print(expected);
      }
    },
    
    be_gt: {
      match: function(expected, actual) {
        return actual > expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than ' + $.print(expected);
      }
    },

    be_gte: {
      match: function(expected, actual) {
        return actual >= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than or equal to ' + $.print(expected);
      }
    },

    be_lt: {
      match: function(expected, actual) {
        return actual < expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than ' + $.print(expected);
      }
    },

    be_lte: {
      match: function(expected, actual) {
        return actual <= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than or equal to ' + $.print(expected);
      }
    },

    match: {
      match: function(expected, actual) {
        if (expected.constructor == RegExp)
          return expected.exec(actual.toString());
        else
          return actual.indexOf(expected) > -1;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match ' : ' to match ') + $.print(expected);
      }
    },

    be_empty: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(new Error(actual.toString() + " does not respond to length"));

        return actual.length == 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be empty' : ' to be empty');
      }
    },

    have_length: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(new Error(actual.toString() + " does not respond to length"));

        return actual.length == expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not' : ' to') + ' have length ' + expected;
      }
    },

    be_null: {
      match: function(expected, actual) {
        return actual == null;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be null' : ' to be null');
      }
    },

    be_undefined: {
      match: function(expected, actual) {
        return actual == undefined;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be undefined' : ' to be undefined');
      }
    },

    be_true: {
      match: function(expected, actual) {
        return actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be true' : ' to be true');
      }
    },

    be_false: {
      match: function(expected, actual) {
        return !actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be false' : ' to be false');
      }
    },

    match_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw(new Error(expected.toString() + " must be an instance of jQuery to match against a selector"));
        }

        return actual.is(expected);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match selector ' : ' to match selector ') + expected;
      }
    },

    contain_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw(new Error(expected.toString() + " must be an instance of jQuery to match against a selector"));
        }

        return actual.find(expected).length > 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not contain selector ' : ' to contain selector ') + expected;
      }
    },




have_been_called :  {
    match: function(method, target) {
        return target.parameterStack.length > 0;
    },
    failure_message: function(expected, actual, not) {  // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called.";
    }
},
have_been_called_exactly :{
    match: function(count, target) {
        return target.parameterStack.length == count;
     },
    failure_message: function(expected, actual, not) {   // TODO: test failure_message
        var method_name = (actual.name ? actual.name : $.print(actual) );
        return method_name + " was supposed to " + (not ? 'not ' : '') +
               "have been called exactly " + $.print(expected) + " times ";
    }
},

have_been_called_with : {
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
},
       throw_exception: {
        match: function(expected, actual){
            threw_exception = false;
            try {
                actual();
            }
            catch(ex) {
                threw_exception = true;
            }

            return threw_exception;
        },
        failure_message: function (expected, actual, not) {
            return actual.toString() + " was " + (not ? 'not' : '') + " supposed to throw an exception";
        }
    }
  };
})(jQuery);