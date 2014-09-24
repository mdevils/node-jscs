var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/require-spaces-in-call-expression', function() {
    var checker;
    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
        checker.configure({ requireSpacesInCallExpression: true });
    });

    it('should report missing space before round brace in CallExpression', function() {
        assert(checker.checkString('var x = foobar();').getErrorCount() === 1);
        assert(checker.checkString('var x = foo.bar();').getErrorCount() === 1);
        assert(checker.checkString('var x = foo. bar();').getErrorCount() === 1);
        assert(checker.checkString('var x = (foo .bar)();').getErrorCount() === 1);
    });

    it('should not report space before round brace in CallExpression', function() {
        assert(checker.checkString('var x = foobar ();').isEmpty());
        assert(checker.checkString('var x = foo.bar ();').isEmpty());
        assert(checker.checkString('var x = foo. bar ();').isEmpty());
        assert(checker.checkString('var x = (foo .bar) ();').isEmpty());
    });
});
