Screw.Unit(function() {
    describe("Screw.Mock", function() {

        describe("When mocking an object", function() {
            var person = {};
            Screw.Mock(person, "die");
            Screw.Mock(person, "fly");

            it("can verify a function was called", function() {
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
                var ryu = { throw_fireball : function() {
                    return "hadouken";
                }};
                Screw.Mock(ryu, "throw_fireball");
                expect(ryu.throw_fireball()).to(be_false);
                ryu.unmock();
                expect(ryu.throw_fireball()).to(equal, "hadouken");
            });
        });

        describe("When mocking an object with parameters", function() {
            var internet_explorer = {};
            var request = {url : "http://aol.com", date : "today" };
            Screw.Mock(internet_explorer, "suck");

            internet_explorer.suck(4, "hard", request);

            it("ignores the any parameter and verifies other", function() {
                expect(internet_explorer.suck).to(have_been_called_with, [any,"hard"]);

                expect(function() {
                    expect(internet_explorer.suck).to(have_been_called_with, [3]);
                }).to(throw_exception);
            });

            it("verifies only supplied properties of objects", function() {
                expect(internet_explorer.suck)
                        .to(have_been_called_with, [any, any, {url:"http://aol.com"}]);

                expect(internet_explorer.suck)
                        .to_not(have_been_called_with, [any, any, {arl:"http://aol.com"}]);
            });
        });

        describe("When passed a callback", function() {
            var internet_explorer = {suck: function() {
                return "suck";
            }};
            Screw.Mock(internet_explorer, "run", internet_explorer.suck);

            it("it returns the callback result", function() {
                expect(internet_explorer.run()).to(equal, "suck");
            });
        });


    });
});