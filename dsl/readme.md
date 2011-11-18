
[Jison](http://zaach.github.com/jison/docs/)

    mkdir mda && cd dsl
    npm install jison


    ./node_modules/.bin/jison lib/cqrs.y
    mv cqrs.js lib/parser.js

	./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js

    node lib/dsl.js test/sample01.cqrs        




