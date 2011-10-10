# Introduction

Le but de ce projet est d'implémenter une application complète en reprenant les principes et motifs
CQRS. Le développement de l'application sera guidé par les approches DDD, TDD et BDD.

Dans [The Pragmatic Programmer](http://pragprog.com/refer/pragpub24/titles/tpp/the-pragmatic-programmer), 
il est conseillé que "l'on apprenne au moins un langage de programmation chaque année" (
*"Learn at least one new language every year"*). Il paraitrait que le `javascript` soit un vrai langage,
hummm... nous allons donc lui donner sa chance, et plus précisement utiliser la plateforme **NodeJS**
comme infrastructure de notre application.

Commençons par glaner à gauche et à droite les modules dont nous aurons besoin, nous voulons:

* un module pour faire du BDD
* un module pour faire du TDD
* un module pour la persistence de notre modèle, nous prendrons dans un 1er temps une base de données postgres
* un module pour effectuer des tâches asynchrones (~actor)

## Preparation

### Installer **nodejs**
 
Assurons-nous que le simple "Hello world" marche:

```shell
    ~ echo "console.log('Hello World');" > hello.js
    ~ node hello.js
    Hello World
    ~ _
```

### Installer **Webworker** (for actor like)
  
[node-webworker](https://github.com/pgriess/node-webworker)

> A WebWorkers implementation for NodeJS


```shell
    ~ npm install webworker
    webworker@0.8.4 ./node_modules/webworker
    ~ _
```

### Installer **vows** (for BDD)
  
[VowsJS](http://vowsjs.org/)

> Asynchronous behaviour driven development for Node.
  
```shell
    ~ npm install vows
    vows@0.5.11 ./node_modules/vows 
    └── eyes@0.1.6
    ~ _
```

### Installer **nodeunit** (for TDD)

```shell
    ~ npm install nodeunit
    nodeunit@0.5.5 ./node_modules/nodeunit 
    ~ _ 
```

### Installer **node-postgres** (Non-blocking PostgreSQL client)

[node-postgres](https://github.com/brianc/node-postgres)

```shell
    ~ npm install pg
    ...
    Checking for node prefix                 : ok /usr 
    Checking for program pg_config           : not found 
    .../node_modules/pg/wscript:16: error: The program ['pg_config'] is required
    pg@0.5.8 ./node_modules/pg 
    └── generic-pool@1.0.6
    ~ _
```

  > In the mean time if you get a compilation failure during installation you
  > have still successfully installed the module; however, you cannot use the
  > native bindings -- only the pure javascript bindings.

## Simplifions et centralisons les dépendences...

Installer toutes ces dépendances une à une devient rapidement fastidieux, surtout s'il faut le répéter à chaque fois
que le projet est récupérer depuis les sources. Heureusement, il existe un moyen de centraliser et conserver ces
dépendances en créant un fichier `package.json`. Ce fichier est très similaire au fichier `pom.xml` de Maven.
Il décrit de manière succinte l'appplication ainsi que ses dépendances.

Par example:

    {
      "author": "Arnauld",
      "name": "scrum-board",
      "description": "Scrum board: rambling around [D|T|B]DD",
      "version": "0.0.1",
      "repository": {
        "url": ""
      },
      "engines": {
        "node": "*"
      },
      "dependencies": {
        "webworker": "*",
        "vows": "*",
        "nodeunit": "*",
        "pg": "*"
      },
      "devDependencies": {},
      "main": "app.js"
    }

Du coup, la récupération des dépendances est beaucoup plus immédiate grâce à la commande `npm install`. Toutes les dépendances
sont ainsi installées en une unique commande.
