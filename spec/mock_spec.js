Screw.Unit(function() {
    describe("Screw.Mock",function(){

        describe("When mocking an object", function(){
            var person = {};
            Screw.Mock(person, "die");
            Screw.Mock(person, "fly");

            it("can verify a function was called", function(){
                person.die();
                expect(person.die).to(have_been_called);
            });

            it("can verify a function was not called", function() {
                expect(person.fly).to_not(have_been_called);
                person.fly();
                expect(function() {
                    expect(person.fly).to_not(have_been_called);
                }).to(throw_exception);
            });
        });

//        describe("When mocking an object with parameters", function() {
//            var internet_explorer = {};
//            //Screw.Mock(internet_explorer, "suck").expecting([,"hard"]);
//
//            it("can verify correct parameters were passed in", function() {
//
//            });
//        });

     
    });
});