# Introduction

As stated by [The Pragmatic Programmer](http://pragprog.com/refer/pragpub24/titles/tpp/the-pragmatic-programmer), 
one should "Learn at least one new language every year". `javascript` is considered as a language, oh yeahh, let's
give it a chance through `node.js` infrastructure.

## Preparation

1. Install `nodejs`
2. Ensure "Hello world" works

    ~ echo "console.log('Hello World');" > hello.js
    ~ node hello.js
    Hello World
    ~ _

3. Install `Webworker` (for actor like)

[node-webworker](https://github.com/pgriess/node-webworker)
> A WebWorkers implementation for NodeJS

    ~ npm install webworker
    webworker@0.8.4 ./node_modules/webworker
    ~ _


4. Install `vows` (for BDD)

[VowsJS](http://vowsjs.org/)
> Asynchronous behaviour driven development for Node.

   ~ npm install vows
   vows@0.5.11 ./node_modules/vows 
   └── eyes@0.1.6
   ~ _

5. Install `nodeunit` (for TDD)

    ~ npm install nodeunit
    nodeunit@0.5.5 ./node_modules/nodeunit 
    ~ _ 

6. Install `node-postgres` (Non-blocking PostgreSQL client)

[node-postgres](https://github.com/brianc/node-postgres)

    ~ npm install pg
    ...
    Checking for node prefix                 : ok /usr 
    Checking for program pg_config           : not found 
    .../node_modules/pg/wscript:16: error: The program ['pg_config'] is required
    pg@0.5.8 ./node_modules/pg 
    └── generic-pool@1.0.6
    ~ _

> In the mean time if you get a compilation failure during installation you
> have still successfully installed the module; however, you cannot use the
> native bindings -- only the pure javascript bindings.