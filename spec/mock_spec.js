Screw.Unit(function() {
    describe("Mock",function(){

        describe("When mocking an object", function(){
            var person = {};
            Screw.Mock(person, "die");

            person.die();
            it("can verify a function was called", function(){
                expect(person).to(have_called, "die");
            });

            it("can verify a function was not called", function() {
                Screw.Mock(person, "fly");
                expect(person).to_not(have_called, "fly");
            });
        });

        describe("When mocking an object with parameters", function() {
            var internet_explorer = {};
            //Screw.Mock(internet_explorer, "suck").expecting([,"hard"]);

            it("can verify correct parameters were passed in", function() {

            });
        });

        describe("If a mock will replace an existing function", function(){
            var pregnant = {expecting:function() { alert('...');}};
            var threw_an_error = false;

            try {
                Screw.Mock(pregnant, "GiveBirth");
            }
            catch(ex) {
               threw_an_error = true;
            }

            it("will throw an error", function() {
                expect(threw_an_error).to(equal, true);
            });
        });

    });
});