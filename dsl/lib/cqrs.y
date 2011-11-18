/* cqrs code generation */

%lex
digit                       [0-9]
esc                         "\\"
int                         "-"?(?:[0-9]|[1-9][0-9]+)
exp                         (?:[eE][-+]?[0-9]+)
frac                        (?:\.[0-9]+)

%%
\s+                                                           /* skip whitespace */
\/\/[^\n]*                                                    /* skip comment */
\#[^\n]*                                                      /* skip comment */
":"                                                           return ':'
","                                                           return ','
"("                                                           return '('
")"                                                           return ')'
"{"                                                           return '{'
"}"                                                           return '}'
"["                                                           return '['
"]"                                                           return ']'
"aggregateRoot"                                               return 'AGGREGATE'
"event"                                                       return 'EVENT'
"def"                                                         return 'DEF'
"extends"                                                     return 'EXTENDS'
"factory"                                                     return 'FACTORY'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\" return 'STRING_LIT';
{int}{frac}?{exp}?\b                                          return 'NUMBER_LIT';
[A-Za-z_0-9-]+                                                return 'IDENTIFIER';
<<EOF>>                                                       return 'EOF';

/lex

%%

file
    : elementDefList EOF
        {return $1;}
    ;

elementDefList
	: elementDef elementDefList
		{$$ = $2; $2.unshift($1);}
	| elementDef
		{$$ = [$1];}
	;

elementDef
	: aggregateDef
/*	| valueObjectDef*/
	;

aggregateDef
	: AGGREGATE identifier optional_extends '{' 
		featureDefList
	  '}'
		{$$ = yy.aggregate_root($2, $3, $5);}
	;

optional_extends
	: EXTENDS identifierList
		{$$ = $2;}
    | 
        {$$ = [];}
	;

featureDefList
	: featureDef featureDefList
		{$$ = $2; $2.unshift($1);}
	| featureDef
		{$$ = [$1];}
	;

featureDef
	: optional_factory identifier  '(' argumentList ')'
		{$$ = yy.method($2, $4, $1);}
	;

optional_factory
	: FACTORY
		{$$ = true;}
    | 
        {$$ = false;}
	;

argumentList
	: argument ',' argumentList
		{$$ = $3; $3.unshift($1);}
	| argument
		{$$ = [$1];}
	| 
        {$$ = [];}
	;

argument
	: identifier ':' identifier
		{$$ = yy.argument($1, $3);}
	;

identifierList
	: identifier ',' identifierList
		{$$ = $3; $3.unshift($1);}
	| identifier
		{$$ = [$1];}
	;

identifier
    : string
    | IDENTIFIER
        {$$ = yytext;}
    ;

string
    : STRING_LIT
        {$$ = yytext.substr(1,yyleng-2); }
    ;











