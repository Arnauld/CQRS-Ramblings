/* Jison generated parser */
var cqrs = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"file":3,"elementDefList":4,"EOF":5,"elementDef":6,"aggregateDef":7,"optionDef":8,"OPTION":9,"identifier":10,"optional_value":11,"string":12,"AGGREGATE":13,"optional_extends":14,"{":15,"featureDefList":16,"}":17,"EXTENDS":18,"identifierList":19,"featureDef":20,"FACTORY":21,"(":22,"argumentList":23,")":24,"DEF":25,":":26,"optional_factory":27,"argument":28,",":29,"IDENTIFIER":30,"STRING_LIT":31,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",9:"OPTION",13:"AGGREGATE",15:"{",17:"}",18:"EXTENDS",21:"FACTORY",22:"(",24:")",25:"DEF",26:":",29:",",30:"IDENTIFIER",31:"STRING_LIT"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[8,3],[11,1],[11,0],[7,6],[14,2],[14,0],[16,2],[16,1],[20,5],[20,5],[20,3],[27,1],[27,0],[23,3],[23,1],[23,0],[28,3],[19,3],[19,1],[10,1],[10,1],[12,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 2:this.$ = $$[$0]; $$[$0].unshift($$[$0-1]);
break;
case 3:this.$ = [$$[$0]];
break;
case 6:this.$ = yy.option($$[$0-1], $$[$0]);
break;
case 7:this.$=$$[$0]
break;
case 8:this.$=null
break;
case 9:this.$ = yy.aggregate_root($$[$0-4], $$[$0-3], $$[$0-1]);
break;
case 10:this.$ = $$[$0];
break;
case 11:this.$ = [];
break;
case 12:this.$ = $$[$0]; $$[$0].unshift($$[$0-1]);
break;
case 13:this.$ = [$$[$0]];
break;
case 14:this.$ = yy.factory($$[$0-3], $$[$0-1]);
break;
case 15:this.$ = yy.def($$[$0-3], $$[$0-1]);
break;
case 16:this.$ = yy.field($$[$0-2], $$[$0]);
break;
case 17:this.$ = true;
break;
case 18:this.$ = false;
break;
case 19:this.$ = $$[$0]; $$[$0].unshift($$[$0-2]);
break;
case 20:this.$ = [$$[$0]];
break;
case 21:this.$ = [];
break;
case 22:this.$ = yy.argument($$[$0-2], $$[$0]);
break;
case 23:this.$ = $$[$0]; $$[$0].unshift($$[$0-2]);
break;
case 24:this.$ = [$$[$0]];
break;
case 26:this.$ = yytext;
break;
case 27:this.$ = yytext.substr(1,yyleng-2); 
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:[1,7],13:[1,6]},{1:[3]},{5:[1,8]},{4:9,5:[2,3],6:3,7:4,8:5,9:[1,7],13:[1,6]},{5:[2,4],9:[2,4],13:[2,4]},{5:[2,5],9:[2,5],13:[2,5]},{10:10,12:11,30:[1,12],31:[1,13]},{10:14,12:11,30:[1,12],31:[1,13]},{1:[2,1]},{5:[2,2]},{14:15,15:[2,11],18:[1,16]},{5:[2,25],9:[2,25],13:[2,25],15:[2,25],17:[2,25],18:[2,25],21:[2,25],22:[2,25],24:[2,25],25:[2,25],26:[2,25],29:[2,25],30:[2,25],31:[2,25]},{5:[2,26],9:[2,26],13:[2,26],15:[2,26],17:[2,26],18:[2,26],21:[2,26],22:[2,26],24:[2,26],25:[2,26],26:[2,26],29:[2,26],30:[2,26],31:[2,26]},{5:[2,27],9:[2,27],13:[2,27],15:[2,27],17:[2,27],18:[2,27],21:[2,27],22:[2,27],24:[2,27],25:[2,27],26:[2,27],29:[2,27],30:[2,27],31:[2,27]},{5:[2,8],9:[2,8],11:17,12:18,13:[2,8],31:[1,13]},{15:[1,19]},{10:21,12:11,19:20,30:[1,12],31:[1,13]},{5:[2,6],9:[2,6],13:[2,6]},{5:[2,7],9:[2,7],13:[2,7]},{10:26,12:11,16:22,20:23,21:[1,24],25:[1,25],30:[1,12],31:[1,13]},{15:[2,10]},{15:[2,24],29:[1,27]},{17:[1,28]},{10:26,12:11,16:29,17:[2,13],20:23,21:[1,24],25:[1,25],30:[1,12],31:[1,13]},{10:30,12:11,30:[1,12],31:[1,13]},{10:31,12:11,30:[1,12],31:[1,13]},{26:[1,32]},{10:21,12:11,19:33,30:[1,12],31:[1,13]},{5:[2,9],9:[2,9],13:[2,9]},{17:[2,12]},{22:[1,34]},{22:[1,35]},{10:36,12:11,30:[1,12],31:[1,13]},{15:[2,23]},{10:39,12:11,23:37,24:[2,21],28:38,30:[1,12],31:[1,13]},{10:39,12:11,23:40,24:[2,21],28:38,30:[1,12],31:[1,13]},{17:[2,16],21:[2,16],25:[2,16],30:[2,16],31:[2,16]},{24:[1,41]},{24:[2,20],29:[1,42]},{26:[1,43]},{24:[1,44]},{17:[2,14],21:[2,14],25:[2,14],30:[2,14],31:[2,14]},{10:39,12:11,23:45,24:[2,21],28:38,30:[1,12],31:[1,13]},{10:46,12:11,30:[1,12],31:[1,13]},{17:[2,15],21:[2,15],25:[2,15],30:[2,15],31:[2,15]},{24:[2,19]},{24:[2,22],29:[2,22]}],
defaultActions: {8:[2,1],9:[2,2],20:[2,10],29:[2,12],33:[2,23],45:[2,19]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* skip comment */
break;
case 2:/* skip comment */
break;
case 3:return 26
break;
case 4:return 29
break;
case 5:return 22
break;
case 6:return 24
break;
case 7:return 15
break;
case 8:return 17
break;
case 9:return '['
break;
case 10:return ']'
break;
case 11:return 9
break;
case 12:return 13
break;
case 13:return 'EVENT'
break;
case 14:return 25
break;
case 15:return 18
break;
case 16:return 21
break;
case 17:return 31;
break;
case 18:return 'NUMBER_LIT';
break;
case 19:return 30;
break;
case 20:return 5;
break;
}
};
lexer.rules = [/^\s+/,/^\/\/[^\n]*/,/^#[^\n]*/,/^:/,/^,/,/^\(/,/^\)/,/^\{/,/^\}/,/^\[/,/^\]/,/^--/,/^aggregateRoot\b/,/^event\b/,/^def\b/,/^extends\b/,/^factory\b/,/^"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,/^-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,/^[A-Za-z_0-9-]+/,/^$/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = cqrs;
exports.parse = function () { return cqrs.parse.apply(cqrs, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}