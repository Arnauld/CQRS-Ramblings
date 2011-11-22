
[Jison](http://zaach.github.com/jison/docs/)
[mustache](https://github.com/janl/mustache.js)

    cd dsl
    npm install jison
    npm install mustache

or

    cd dsl
    npm update


Generate the parser from the grammar, and copy the generated file into `lib`

    ./node_modules/.bin/jison lib/cqrs.y
    mv cqrs.js lib/parser.js

	./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js

Parse the given file

    node lib/dsl.js test/sample01.cqrs        

Apply the transformer `templates/event` on the given file

	node lib/dsl.js test/sample01.cqrs templates/event


