var assert = require('assert');
var sinon = require('sinon');
var esprima = require('esprima');
var JsFile = require('../lib/js-file');
var TokenAssert = require('../lib/token-assert');

describe('modules/token-assert', function() {

    function createJsFile(sources) {
        return new JsFile(
            'example.js',
            sources,
            esprima.parse(sources, {loc: true, range: true, comment: true, tokens: true})
        );
    }

    describe('whitespaceBetween', function() {
        it('should trigger error on missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Missing space between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should accept message for missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert(onError.getCall(0).args[0].message, 'Custom message');
        });

        it('should not trigger error on existing whitespace between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should trigger error on invalid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 2
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, '2 spaces required between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 2
            });

            assert(!onError.called);
        });

        it('should not trigger error on valid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 3
            });

            assert(!onError.called);
        });

        it('should accept message for invalid space count between tokens', function() {
            var file = createJsFile('x   =   y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.whitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                spaces: 2,
                message: 'Custom message'
            });

            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });
    });

    describe('noWhitespaceBetween', function() {
        it('should trigger error on existing whitespace between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Unexpected whitespace between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should trigger error on newline between tokens with disallowNewLine option', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                disallowNewLine: true
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Unexpected whitespace between x and =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on missing whitespace between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should accept message for existing space count between tokens', function() {
            var file = createJsFile('x = y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noWhitespaceBetween({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });
    });

    describe('sameLine', function() {
        it('should trigger error on unexpected newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.sameLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'x and = should be on the same line');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on missing newline between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.sameLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should accept message for unexpected newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.sameLine({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });

        it('should not throw if token or nextToken properties are undefined', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);

            tokenAssert.sameLine({
                token: undefined,
                nextToken: undefined
            });
        });
    });

    describe('differentLine', function() {
        it('should trigger error on missing newline between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.differentLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'x and = should be at least 1 line(s) apart');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on existing newline between tokens', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.differentLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should not trigger on additional newlines between tokens', function() {
            var file = createJsFile('x\n\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.differentLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.called);
        });

        it('should not trigger on additional newlines between tokens', function() {
            var file = createJsFile('x\n\n=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.differentLine({
                token: tokens[0],
                nextToken: tokens[1]
            });

            assert(!onError.calledOnce);
        });

        it('should accept message for missing newline between tokens', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.differentLine({
                token: tokens[0],
                nextToken: tokens[1],
                message: 'Custom message'
            });

            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });

        it('should not throw if token or nextToken properties are undefined', function() {
            var file = createJsFile('x\n=y;');

            var tokenAssert = new TokenAssert(file);

            tokenAssert.differentLine({
                token: undefined,
                nextToken: undefined
            });
        });
    });

    describe('linesBetween', function() {
        describe('error messages', function() {
            beforeEach(function() {
                var file = createJsFile('x=y;');

                this.tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                this.tokenAssert.on('error', onError);

                this.tokens = file.getTokens();
            });

            it('should throw if no options are specified', function() {
                assert.throws((function() {
                    this.tokenAssert.linesBetween({
                        token: this.tokens[0],
                        nextToken: this.tokens[1],
                    });
                }).bind(this),
                /You must specify at least one option/);
            });

            it('should throw if atLeast and exactly are specified', function() {
                assert.throws((function() {
                    this.tokenAssert.linesBetween({
                        token: this.tokens[0],
                        nextToken: this.tokens[1],
                        atLeast: 2,
                        exactly: 1
                    });
                }).bind(this),
                /You cannot specify atLeast or atMost with exactly/);
            });

            it('should throw if atMost and exactly are specified', function() {
                assert.throws((function() {
                    this.tokenAssert.linesBetween({
                        token: this.tokens[0],
                        nextToken: this.tokens[1],
                        atMost: 2,
                        exactly: 1
                    });
                }).bind(this),
                /You cannot specify atLeast or atMost with exactly/);
            });

            it('should throw if atLeast and atMost are in conflict', function() {
                assert.throws((function() {
                    this.tokenAssert.linesBetween({
                        token: this.tokens[0],
                        nextToken: this.tokens[1],
                        atLeast: 3,
                        atMost: 2
                    });
                }).bind(this),
                /atLeast and atMost are in conflict/);
            });
        });

        it('should not throw if token or nextToken properties are undefined', function() {
            var file = createJsFile('x\n=y;');
            var tokenAssert = new TokenAssert(file);

            tokenAssert.linesBetween({
                token: undefined,
                nextToken: undefined,
                exactly: 1
            });
        });

        describe('exact', function() {
            it('should trigger error on too few newlines', function() {
                var file = createJsFile('x\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    exactly: 2
                });

                assert(onError.calledOnce);

                var error = onError.getCall(0).args[0];
                assert.equal(error.message, 'x and = should have exactly 2 line(s) between them');
            });

            it('should trigger error on too many specified newlines', function() {
                var file = createJsFile('x\n\n\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    exactly: 2
                });

                assert(onError.calledOnce);
                var error = onError.getCall(0).args[0];
                assert.equal(error.message, 'x and = should have exactly 2 line(s) between them');
            });

            it('should not trigger error on correct specified newlines', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    exactly: 2
                });

                assert(!onError.called);
            });

            it('should not trigger error on exactly 0 blank lines', function() {
                var file = createJsFile('x\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    exactly: 1
                });

                assert(!onError.called);
            });

            it('should not trigger error on multiple specified newlines negative', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[1],
                    nextToken: tokens[0],
                    exactly: 2
                });

                assert(!onError.called);
            });
        });

        describe('atLeast', function() {
            it('should trigger on too few lines', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 3
                });

                assert(onError.calledOnce);
                var error = onError.getCall(0).args[0];
                assert.equal(error.message, 'x and = should have at least 3 line(s) between them');
            });

            it('should not trigger with exact lines', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 2
                });

                assert(!onError.called);
            });

            it('should not trigger error on too many lines', function() {
                var file = createJsFile('x\n\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 2
                });

                assert(!onError.called);
            });
        });

        describe('atMost', function() {
            it('should not trigger on too few lines', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atMost: 2
                });

                assert(!onError.called);
            });

            it('should not trigger with exact lines', function() {
                var file = createJsFile('x\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atMost: 2
                });

                assert(!onError.called);
            });

            it('should trigger error on too many lines', function() {
                var file = createJsFile('x\n\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atMost: 1
                });

                assert(onError.calledOnce);
                var error = onError.getCall(0).args[0];
                assert.equal(error.message, 'x and = should have at most 1 line(s) between them');
            });
        });

        describe('between', function() {
            it('should not trigger if within range', function() {
                var file = createJsFile('x\n\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 1,
                    atMost: 3
                });

                assert(!onError.called);
            });

            it('should trigger if below range', function() {
                var file = createJsFile('x\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 2,
                    atMost: 3
                });

                assert(onError.calledOnce);
            });

            it('should trigger if above range', function() {
                var file = createJsFile('x\n\n\n\n=y;');

                var tokenAssert = new TokenAssert(file);
                var onError = sinon.spy();
                tokenAssert.on('error', onError);

                var tokens = file.getTokens();
                tokenAssert.linesBetween({
                    token: tokens[0],
                    nextToken: tokens[1],
                    atLeast: 1,
                    atMost: 2
                });

                assert(onError.calledOnce);
            });
        });
    });

    describe('tokenBefore', function() {
        it('should trigger error on missing token itself before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.tokenBefore({
                token: tokens[0],
                expectedTokenBefore: {value: 'something'}
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'something was expected before x but document start found');
            assert.equal(error.line, 1);
            assert.equal(error.column, 0);
        });

        it('should trigger error on missing token value before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.tokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'z'
                }
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'z was expected before = but x found');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should trigger error on missing token type before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.tokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Keyword',
                    value: 'x'
                }
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'x (Keyword) was expected before = but x (Identifier) found');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on correct token before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.tokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'x'
                }
            });

            assert(!onError.called);
        });

        it('should accept message for missing token before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.tokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'z'
                },
                message: 'Custom message'
            });
            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });
    });

    describe('noTokenBefore', function() {
        it('should not trigger error on document start before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noTokenBefore({
                token: tokens[0],
                expectedTokenBefore: {value: 'something'}
            });

            assert(onError.notCalled);
        });

        it('should trigger error on illegal token value before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noTokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'x'
                }
            });

            assert(onError.calledOnce);

            var error = onError.getCall(0).args[0];
            assert.equal(error.message, 'Illegal x was found before =');
            assert.equal(error.line, 1);
            assert.equal(error.column, 1);
        });

        it('should not trigger error on missing token value before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noTokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'z'
                }
            });

            assert(!onError.called);
        });

        it('should not trigger error on missing token type before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noTokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Keyword',
                    value: 'x'
                }
            });

            assert(!onError.called);
        });

        it('should accept message for illegal token before', function() {
            var file = createJsFile('x=y;');

            var tokenAssert = new TokenAssert(file);
            var onError = sinon.spy();
            tokenAssert.on('error', onError);

            var tokens = file.getTokens();
            tokenAssert.noTokenBefore({
                token: tokens[1],
                expectedTokenBefore: {
                    type: 'Identifier',
                    value: 'x'
                },
                message: 'Custom message'
            });
            assert.equal(onError.getCall(0).args[0].message, 'Custom message');
        });
    });
});
