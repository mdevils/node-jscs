/* globals require, module, describe, it, beforeEach */
/* jshint -W097 */
'use strict';

var Checker = require('../../lib/checker');
var assert = require('assert');

describe('rules/require-aligned-object-values', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('object{mode:all,tabSize:4} option', function() {
        beforeEach(function() {
            checker.configure({
                requireAlignedObjectValues: {
                    mode: 'all',
                    tabSize: 4
                }
            });
        });

        it('should not report any errors for tab alignment', function() {
            assert(checker.checkString('var x = {\n').isEmpty());
        });
    });

    describe('all option', function() {
        beforeEach(function() {
            checker.configure({ requireAlignedObjectValues: 'all' });
        });

        it('should not report for empty object', function() {
            assert(checker.checkString('var x = {};').isEmpty());
        });

        it('should not report for single-line object', function() {
            assert(checker.checkString('var x = {a: 1, bcd: 2};').isEmpty());
        });

        it('should not report if aligned', function() {
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a   : 1,\n' +
                        'bcd : 2\n' +
                    '};'
                ).isEmpty()
            );
        });

        it('should report invalid alignment', function() {
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        '\n' +
                        'foo : function() {},\n' +
                        'bcd : 2\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });
    });

    describe('ignoreFunction option', function() {
        it('should not report function with skipWithFunction', function() {
            checker.configure({ requireAlignedObjectValues: 'skipWithFunction' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        'foo : function() {},\n' +
                        'bcd : 2\n' +
                    '};'
                ).isEmpty()
            );
        });

        it('should not report function with ignoreFunction', function() {
            checker.configure({ requireAlignedObjectValues: 'ignoreFunction' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        'foo : function() {},\n' +
                        'bcd : 2\n' +
                    '};'
                ).isEmpty()
            );
        });
    });

    describe('ignoreLineBreak option', function() {
        it('should not report with line break between properties', function() {
            checker.configure({ requireAlignedObjectValues: 'skipWithLineBreak' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        '\n' +
                        'bcd : 2\n' +
                    '};'
                ).isEmpty()
            );
        });

        it('should report invalid alignment in nested object', function() {
            checker.configure({ requireAlignedObjectValues: 'skipWithLineBreak' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        '\n' +
                        'nested : {\n' +
                            'sdf : \'sdf\',\n' +
                            'e : 1\n' +
                        '},\n' +
                        'bcd : 2\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });

        it('should not report with line break between properties', function() {
            checker.configure({ requireAlignedObjectValues: 'ignoreLineBreak' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        '\n' +
                        'bcd : 2\n' +
                    '};'
                ).isEmpty()
            );
        });

        it('should report invalid alignment in nested object', function() {
            checker.configure({ requireAlignedObjectValues: 'ignoreLineBreak' });
            assert(
                checker.checkString(
                    'var x = {\n' +
                        'a : 1,\n' +
                        '\n' +
                        'nested : {\n' +
                            'sdf : \'sdf\',\n' +
                            'e : 1\n' +
                        '},\n' +
                        'bcd : 2\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });
    });
});
