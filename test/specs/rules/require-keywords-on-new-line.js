var Checker = require('../../../lib/checker');
var expect = require('chai').expect;

describe.skip('rules/require-keywords-on-new-line', function() {
    var checker;
    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });
    it('should report illegal keyword placement', function() {
        checker.configure({ requireKeywordsOnNewLine: ['else'] });
        assert(
            checker.checkString(
                'if (x) {\n' +
                    'x++;\n' +
                '} else {\n' +
                    'x--;\n' +
                '}'
            ).getValidationErrorCount() === 1
        );
    });
    it('should not report legal keyword placement', function() {
        checker.configure({ requireKeywordsOnNewLine: ['else'] });
        assert(
            checker.checkString(
                'if (x) {\n' +
                    'x++;\n' +
                '}\n' +
                'else {\n' +
                    'x--;\n' +
                '}'
            ).isEmpty()
        );
    });
});
