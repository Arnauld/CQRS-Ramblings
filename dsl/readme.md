
[Jison](http://zaach.github.com/jison/docs/)
[mustache](https://github.com/janl/mustache.js)
[Sslac](https://github.com/Jakobo/Sslac)

    cd dsl
    npm update

Due to version mismatch, jison cannot be installed with current nodejs version `0.6.2`

    cd ~/Projects/nodejs-modules
    git clone git://github.com/zaach/jison.git
    mate package.json

And add the required version 

    ...
    "engines": {
        "node": "0.4 || 0.5 || 0.6"
      },
    ...

Then install the module using the folder...

    npm install ~/Projects/nodejs-modules/jison/



Generate the parser from the grammar, and copy the generated file into `lib`

    ./node_modules/.bin/jison lib/cqrs.y
    mv cqrs.js lib/parser.js

	./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js

Parse the given file

    node lib/dsl.js test/sample01.cqrs        

Apply the transformer `templates/event` on the given file

	node lib/dsl.js test/sample01.cqrs views/event


