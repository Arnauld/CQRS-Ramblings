# [T|B|D]DD par la pratique

Dans cette série, nous allons tenter de mettre en pratique la théorie autour des notions d'Event Sourcing et de CQRS. 
Pour ce faire, nous allons développer une nouvelle application selon les principes du Test Driven Developpement,
du Behavior Driven Developpement et du Domain Driven Developpement.

Dans [The Pragmatic Programmer](http://pragprog.com/refer/pragpub24/titles/tpp/the-pragmatic-programmer), 
il est conseillé que "l'on apprenne au moins un langage de programmation chaque année" (
*"Learn at least one new language every year"*) et il paraitrait que le `javascript` soit un vrai langage,
hummm... nous allons donc lui donner sa chance, et plus précisement utiliser la plateforme **NodeJS**
comme infrastructure de notre application. Il s'agira pour moi de découvrir NodeJS et une tentative de
se reconcillier avec le javascript.


## Notre domaine et notre langage commun (Ubiquitous language)

Le but de notre application d'example est de facilité la mise en place et la pratique de Scrum dans une équipe.
Nous souhaitons ainsi fournir un moyen de:

* crééer les tâches qui constitueront notre backlog
* pouvoir définir un sprint sur une periode de temps donnée
* pouvoir associer certaines cartes à un sprint
* permettre aux membres de l'équipes de déplacer les cartes d'un sprint à mesure de l'avancement des tâches
* ...

Afin de formaliser un peu plus le contexte de notre application, et les fonctionnalités requises, décrivons nos besoins sous
forme de `User Story`. Nous definirons ainsi par la même occasion notre langage commun, c'est à dire la terminologie employée
pour décrire notre domaine. En definissant un language commun, nous limitons les confusions et, ensemble, nous utilisons les 
mêmes mots pour décrire les mêmes idées. Nous pousserrons jusqu'au bout l'idée de ce langage commun en l'utilisant même dans
le code de notre application. Ce langage doit être omniprésent (Ubiquitous Language), et ce, dans nos discussions et notre 
code. Le code reflètera ainsi directement les concepts de l'application, ce qui devrait le rendre d'autant plus compréhensible
pour quiconque connait notre langage commun. Ceci a aussi pour conséquence, que même en tant que développeur je parle le 
même langage que mon client.

### Le contexte

Nous allons faire un bref rappel de la terminologie et des différents concepts que nous utiliserons dans le cadre
notre application (pour un présention plus poussées et plus précise se référer à []()).
En précisant, le cadre de notre langage nous definissons ainsi son contexte d'application (Bounded Context) ainsi,
même si dans d'autre situation les mots ont une autre signification, voici ici la leur. Et si la théorie de
scrum a une autre définition ou une autre terminologie, nous sommes protégé par notre contexte, qui défini les
frontières d'application de notre vocabulaire à notre application.

Afin de limiter les confusions, nous utiliserons essentiellement les termes anglais relatifs à scrum.

Notre application devra permettre de gérer plusieurs **projets**. A chaque **projet** sera associé un **backlog**,
une **équipe** et un ensemble de **sprint**.
Le **backlog** servira à récolter les besoins fonctionnels ou techniques émis par le client, ces entrées seront
appellées **story**. Une **équipe** sera constituée d'un **product owner**, d'un **scrum master** et de plusieurs
**developer**s. Le **product owner** ainsi que le **scrum master** pourront définir des **sprints** et leurs
associés des tâches (**task**). Ces **tâches**s pourront être attachées à une **story** mais ce n'est pas obligatoire, et ce,
afin d'avoir une plus grande souplesse d'organisation, notament concernant les tâches techniques. En revanche, il est
quasi systématique qu'une **story** ait une ou plusieurs **tâches** qui lui soit rattachées. En effet, une **story**
complexe pourra-t-être découpées en plusieurs **tâches**.

L'état d'une tache pourra (et devra!) évoluer au cours d'un sprint à mesure de son avancement dans sa réalisation, 
sa validation et son acceptation par le **product owner**. Par défaut, les différents états que peux prendre une tâche 
seront: `ready for developpement`, `in developpement`, `ready for testing`, `in testing`, `ready for signoff`, `accepted`.
Seul le **product owner** pourra associer l'état `accepted` à une tâche. 

Les différentes transitions entre états ne seront pas dans un premier temps soumis à des rêgles particulières. 
Il devra être possible **plus tard** de rajouter des rêgles, indiquant qu'il n'est pas possible de démarrer 
le développement d'une carte si trop de carte sont déjà en **cours** par exemple (voir [Kanban et Scrum][kanban-scrum-fr]).

[kanban-scrum-fr]:http://www.infoq.com/resource/news/2010/01/kanban-scrum-minibook/en/resources/KanbanAndScrum-French.pdf


Afin de décrire nos propres `User Story` nous utiliserons le modèle *standard* ("As a... I want... so that..."):

* En tant que  < Rôle d’utilisateur >,
* Je peux  < But >,
* Si bien que  < Justification >

C'est parti!!

### Generalités: Projet, Equipe

* En tant qu'**administrateur (de l'application)**, je peux créer un nouveau projet si bien que je pourrais 
  regrouper les besoins fonctionnels du produit.
* En tant qu'**administrateur**, je peux associer une équipe à un projet si bien que son 
  activité pourra être suivie par l'application.
* En tant qu'**administrateur**, je peux définir les membres de l'équipes si bien que l'on pourra définir
  les rôles scrum de chaque membre.
* En tant qu'**administrateur**, je peux assigner à chaque membre de l'équipe un rôle parmis `scrum master`,
  `product owner` ou `developper`.


### Backlog

* En tant que **membre de l'équipe**, je peux créer de nouvelles entrées dans le backlog du projet, si bien que les besoins fonctionnels de notre projet pourront être récolter. 
  Une `story` sera définie par un titre, une description, une évaluation en points de sa complexité, ainsi que sa valeur cliente `business value`.
* En tant que **membre de l'équipe**, je peux completer une entrée du backlog en modifiant ses informations ou en 
  ajoutant un commentaire, si bien que cette entrée disposera de plus amples informations à mesure des reflexions
  qu'elle peux suciter.

### Sprint

* En tant que **product owner**, je peux definir des nouveaux sprint si bien que je pourrais planifier mes releases,
  et organiser les tâches à developper à chaque itération.
* En tant que **product owner**, je peux modifier l'intervalle de temps couvert par un sprint non commencé, si bien que
  je peux ajuster et réorganiser mes sprints dans le temps. 
* En tant que **product owner** ou **scrum master**, je peux associer une entrée du backlog à une tâche du sprint si bien
  que cette entrée pourra être développée au cours du sprint.
* En tant que **membre de l'équipe**, je peux ajouter une tâche a faire dans un sprint si bien qu'il est possible
  de rajouter des tâches techniques qui n'apparaissent pas forcément directmement dans le backlog.
* En tant que **membre de l'équipe**, je peux associer une tâche du sprint à une entrée du backlog, si bien qu'il est 
  possible de décomposer les entrées du backlog en sous-tâches. 
* En tant que **membre de l'équipe**, je peux lister l'ensemble des tâches associées à une entrée du backlog 
  si bien que je serais capable de déterminer si le développement de cette entrée est terminé.
* En tant que **membre de l'équipe**, je peux changer l'état d'une tâche du sprint, si bien qu'il sera possible de suivre
  son avancement. 
* En tant que **product owner** ou **scrum master**, je peux déclarer le début d'un sprint si bien que ce sprint sera
  considéré comme le sprint courant.
* En tant que **product owner** ou **scrum master**, je peux déclarer la fin d'un sprint si bien que ce sprint ne sera
  plus considéré comme le sprint courant.
* En tant que **membres de l'équipe**, je peux consulter la liste des sprints terminés mais je ne peux
  pas les modifier si bien que je peux toujours consulter les archives.



