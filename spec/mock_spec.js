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

            it("mocked functions return false and can be unmocked", function() {
                var ryu = { throw_fireball : function() { return "hadouken";}};
                Screw.Mock(ryu, "throw_fireball");
                expect(ryu.throw_fireball()).to(be_false);
                ryu.unmock();
                expect(ryu.throw_fireball()).to(equal, "hadouken");
            });            
        });

        describe("When mocking an object with parameters", function() {
            var internet_explorer = {};
            Screw.Mock(internet_explorer, "suck");

            internet_explorer.suck(4,"hard");

            it("can verify correct parameters were passed in", function() {
                expect(internet_explorer.suck)
                        .to(have_been_called_with, [any,"hard"]);

                expect(function() {
                    expect(internet_explorer.suck)
                        .to(have_been_called_with, [3]);
                }).to(throw_exception);
            });
        });

     
    });
});