En prenant un peu de recul sur cette série d'article, je me rends compte que j'ai très vite survollé le 
domaine pour m'interesser à l'implémentation de l'application. Même si le domaine est relativement clair
dans ma tête, il est important que je passe un peu de temps à le mettre à plat: c'est d'ailleurs le but 
de cette série d'articles.

Ordinairement, quand on pense modèle on arrive rapidement à dessiner une sorte de diagramme de classe. 
Je ne vais pas y échapper afin d'avoir une base de discussion.

![Domain Overview][domain-overview-01]

[domain-overview-01]:https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-01-75%25-yuml.png?raw=true

On y retrouve nos principaux concepts, à savoir:

* Le projet
* L'équipe et ses membres
* Le Backlog et ses Stories
* Les Sprints et leurs Tasks

<table style="border:0">
	<tr>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-project-75%25-yuml.png?raw=true" alt="Project class">
		</td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-team-75%25-yuml.png?raw=true" alt="Team class">    
		</td>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-member-75%25-yuml.png?raw=true" alt="Member class">
		</td>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-user-75%25-yuml.png?raw=true" alt="User class">
		</td>
	</tr>
	<tr>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-backlog-75%25-yuml.png?raw=true" alt="Backlog class">
		</td>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-story-75%25-yuml.png?raw=true" alt="Story class">
		</td>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-comment-75%25-yuml.png?raw=true" alt="Comment class">
		</td>
	</tr>
	<tr>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-sprint-75%25-yuml.png?raw=true" alt="Sprint class">
		</td>
		<td>
			<img src="https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-task-75%25-yuml.png?raw=true" alt="Task class">
		</td>
		<td>&nbsp;</td>
	</tr>
</table>


La notion de projet ajoute une indirection initiale, et permet à une même personne d'appartenir à plusieurs
projet et même d'avoir un rôle différent dans chacun: une personne peut être `developer` dans un projet et
`scrum master` dans un autre, une même personne peut même être membre de plusieurs projets.

Quantifions un peu les choses, histoire d'avoir une perception de la volumétrie que nous pouvons être amenée
à manipuler.

Tout d'abord, l'équipe. Généralement, une équipe **scrum** est composée de 5 à 15 membres.
Pour un projet donné, il n'est donc pas abérant de conserver les identifiants de tous ses membres ainsi 
que leur rôle en mêmoire. Pour nos calculs, nous prendrons une équipe de 10 personnes.

Considérons les `sprint` désormais. Si nous prenons des `sprints` d'une durée de deux semaines, nous avons 
(52/2=) 26 sprints par an. Si l'on considére que notre outils gérera des projets d'une durée de 5 ans (d'ici
là une nouvelle version de notre outil sera sortie...) cela nous fait (26*5=) 130 sprints! Rajoutons en 20
sprints virtuels (ah on notera que cette fonctionnalité devra intégrée notre propre backlog si ce n'est
déjà fait) utilisés pour la planification et des simulations, et l'on arrive à 150 sprints.

Les `stories` maintenant. Le calcul est déjà plus compliqué puisqu'il faut faire correspondre une échelle
de complexité à un interval de temps. J'entends déjà certains scrum masters hués. Mais c'est un fait, l'équipe
s'engage a effectuer un certain nombre de tâches dans la durée d'un sprint. Nous considérerons donc que nous
avons affaire à une équipe au top! et que son sprint backlog est constitué de petite tâches, qui peuvent être
effectuées, en moyenne, en une demi-journée à deux (le Pair-programming étant de mise!), nous avons donc:

* 9 jours de travail (je n'ai enlevé qu'une demi journée de lancement de sprint, et une demi journée
  d'atterissage)
* soit 18 demi-journées
* avec des `tâches` à 1pt (je vous ai dis que c'était une équipe au top), cela nous fait 18 tâches par sprint.

Comme une `story` peut être découpée en plusieurs tâches nous avons au maximum 18 stories de terminées
par sprint. Transformons le maximum en minimum afin d'avoir une vue au plus large. Notre backlog doit donc être
constitué au minimum de 18 stories par sprint, donc sur 5 ans (18*150=) 2700 stories!
Prenons finalement quelques libertés, en considérant que notre Product Owner a affaire à des interlocuteurs
très demandeurs. Afin de conserver ces demandes, il créé donc bien plus de `stories` que l'équipe en réalise, 
disons 50% (purement arbitraire).
Notre projet possède donc (2700*2=)5400 stories pfiouuuu!

**Pourquoi faire tous ces calculs?** Eh bien tout simplement parce que les cas d'utilisations vont directement
influencer notre modélisation. Dans une approche ORM de type hibernate, on prendra par exemple bien garde à ne
pas définir une relation bidirectionnelle entre un Project (ou son backlog) et ses Stories. Même en `lazy loading`
cela peut avoir des conséquences catastrophique sur la mêmoire de notre application.

Définissons désormais nos entités et nos agrégats.

#### Rappel 

**Une entité (`Entity`) est un objet avec une identité propre. Généralement, l'état d'une entité
évolue dans le temps à travers l'application.** 

**Un agrégat (`Aggregate`) est un ensemble d'objets faisant un tout et maintenu dans un état toujours consistant et 
intègre. Les modifications des objets contenus dans l'agrégat (`Entity` ou `Value Object`) se font toujours à travers 
l'agrégat afin de contrôler et maintenir cette intégrité. 
La racine d'un agrégat (`AggregateRoot`) est ce qui maintient ce tout, il s'agit toujours d'une entité (une 
identité est en effet nécessaire pour charger un agrégat depuis un `Repository`). 
Cette entité est ainsi chargée de contôler tous les accès à ses enfants (les membres de l'agrégat).**


#### Project, User and Member

Tout d'abord les utilisateurs. Il s'agit des personnes qui utiliseront l'application. L'application
doit permettre aux utilisateurs de créer un compte sur l'application, et leur permettre de rejoindre
un ou plusieurs projets.
Un utilisateur est donc une **entité** à part entière qui possède son propre cycle d'évolution.

Note: De manière générale, dans notre discours chaque type d'entité aura un type de `Value Object` dédié
à son identité. Ainsi, les références à une entité se feront en ayant une référence vers le `Value Object`
correspondant.

![User Overview](https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-user-75%25-yuml.png?raw=true)

Un utilisateur sera décrit par son identifiant et son mot de passe dans un premier temps.

```js
    var user_id = UserRepository.next_user_id();
    var user = User.create(user_id, "Arnauld", "Mot de passe");
    UserRepository.store(user);
```

Note: nous prenons parti de **fournir l'identifiant de l'entité à créer** plutôt que de laisser l'entité 
générer elle-même un nouvel identifiant. En faisant ce choix il est ainsi beaucoup plus facile de rendre
la création d'une entité asynchrone. En connaissant déjà l'identifiant de l'entité, il n'est pas 
nécessaire d'effectuer un aller-retour pour fournir l'identifiant de l'entité nouvellement créer à l'appellant.

Si l'on utilise des `UUID`, la génération du prochain identifiant d'utilisateur se résume simplement à:

```js
    var uuid  = require('node-uuid');
    ...
    UserRepository.prototype.next_user_id = uuid;

    ...
    var new_user_id = UserRepository.next_user_id();
```

Il en est de même pour les projets:

```js
    var project_id = ProjectRepository.next_project_id();
    var project = Project.create(project_id, "Njscrum");
    ProjectRepository.store(project);
```

Maintenant que nous avons nos projets et nos utilisateurs, interessons-nous à leurs interactions: un utilisateur
peux rejoindre l'équipe d'un projet avec un rôle identifié parmis: "developer", "scrum-master" ou "product owner".

```js
	var project = ProjectRepository.find(project_id);
    project.add_member(user_id, MemberRole.DEVELOPER);
    ProjectRepository.store(project);
```

En passant, nous permettrons aussi à un membre de l'équipe de changer de rôle.

```js
    project.change_member_role(user_id, MemberRole.SCRUM_MASTER);
```

![Project, User and Member Overview](https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-project-member-75%25-yuml.png?raw=true)


Interessons-nous à la partie 'Command' désormais. Compte-tenu de la simplicité de notre modèle les commandes
sont-elles même très simples:

```js
	var CreateProjectCommand = function(project_id, project_name) {
		assertNotEmpty(command.project_name);
		assertNotEmpty(command.project_id);
		this.project_name = project_name;
		this.project_id   = project_id;
	};

	...

	CreateProjectCommandHandler.prototype.handle = function(command) {
		assertInstanceOf(command, CreateProjectCommand);
		var project = Project.create(command.project_id, command.project_name);
	    ProjectRepository.store(project);
	}
```

```js
	var JoinProjectCommand = function(project_id, user_id, role_id) {
		assertNotEmpty(project_id);
		assertNotEmpty(user_id);
		assertNotEmpty(role_id);
		this.project_name = project_name;
		this.user_id      = user_id;
		this.role_id      = role_id;	
	}

	...

	JoinProjectCommandHandler.prototype.handle = function(command) {
		assertInstanceOf(command, JoinProjectCommand);
		assert(ProjectRepository.exists(command.project_id));
		var user = UserRepository.find(command.user_id);
		user.join_project(command.project_id, command.role_id);
		UserRepository.store(user);
	}
```

Revenons sur le `JoinProjectCommandHandler`, il existe deux alternatives soit l'utilisateur
joint le projet, soit un nouveau membre est ajouté au projet:

* `project.add_member(user_id, role_id);`
* `user.join_project(project_id, role_id);`

Dans le premier cas, le projet est chargé puis modifié. Dans l'autre cas l'utilisateur est chargé puis modifié.
On peux sans grand risque penser que l'activité d'un projet, et donc son historique, sera beaucoup plus importante
que celle d'un utilisateur donné, si celui-ci porte l'intégralité des changements auquel il participe. 
Il est donc fort probable que le chargement d'un utilisateur (depuis son
historique, souvenez-vous l'`Event Sourcing`) soit moins consomateur que le chargement d'un projet.
Cependant l'entité centrale reste le Projet, les observateurs scrutent le projet et ses modifications afin
de détecter qu'un utilisateur rejoint le projet. Ceci nous amène donc à revenir sur l'implémentation de la
gestion de notre dernière commande:

```js
	JoinProjectCommandHandler.prototype.handle = function(command) {
		assertInstanceOf(command, JoinProjectCommand);
		assert(UserRepository.exists(command.user_id));
		var project = ProjectRepository.find(command.project_id);
		project.add_member(command.user_id, command.role_id);
		ProjectRepository.store(project);
	}
```

Hummmm... cela me laisse tout de même perplexe, si l'on se place d'un point de vue du `User` comment
savoir qu'il a rejoint un projet? Doit-on scanner tous projets un à un pour vérifier si l'utilisateur l'a
rejoint et ne l'a pas encore quitté? Et bien la réponse ne se trouve pas de ce côté ci. Mais du côté des 
requêtes. Souvenez-vous la séparation read/write. Nous décrivons ici la partie `write`, la partie `read`
sera abordée dans un prochain article.

Admettons... mais si la reconstruction d'un projet depuis son historique est aussi longue, comment va-t-on
faire? Et bien nous mettrons en place la notion de [`snapshot`](http://blog.jonathanoliver.com/2009/03/event-sourcing-and-snapshots/) 
de nos agrégats. C'est à dire brièvement, que nous prendrons un cliché de cet agrégat à une version donnée, 
qui sera utilisé pour reconstruire cet agrégat directement dans cette version, il ne restera que
l'historique restant à rejouer. Selon la fréquence de nos clichés, la reconstruction de notre agrégat 
sera plus ou moins rapide.

#### Optimistic Locking

Abordons, en passant, un autre point: les accès concurrents. Un projet est un type d'entité qui sera 
potentiellement beaucoup sollicité de manière concurrente par plusieurs utilisateurs: le `PO` créé sans
cesse de nouvelles `Stories`, tandis que de nos utilisateurs rejoignent le projet.

Lorsqu'un projet est récupéré depuis son `Repository`, nous obtenons une instance de ce projet dans une
version donnée (directement liée à la taille de son historique, et oui la taille compte).
Toutes les modifications faites par la suite sont matérialisées par de nouveaux évènements qui devront
être rajoutés à cet historique à condition que celui-ci soit toujours dans la même version (la 
c'est le système de persistence qui va statuer) au moment de la sauvegarde: il s'agit d'une implémentation
simple et efficace de l'[Optimistic Locking](http://docs.jboss.org/hibernate/core/3.3/reference/en/html/transactions.html#transactions-optimistic)

La gestion de ce verrouillage optimiste est ensuite propre à chaque commande: peut-on rejouer la commande
dans ce cas? Eh bien, c'est à chaque commande d'en décider. Dans le cas de notre commande
`JoinProjectCommand` l'état courant du projet importe peu voir pas du tout: on peux sans risque rejouer la
commande.

Nous ajouterons donc dans notre chaîne de traitement un `CommandDispatcher`: il receptionera les commandes
émis par l'utilisateur et les redigera vers le `CommandHandler` adéquat. En cas d'échec de type `Optimistic
Locking`, il sera responsable, si la commande le supporte de la re-distribuer.

```js
    var dispatcher = ...
    
    
    dispatcher.dispatch(command, function(error) {
    	if(error) {
    		log.error("Erf!", error);
    		getChannel(command.errorChannel).send(new CommandInErrorMessage(command,error));
    	}
    	else {
    		log.info("Houra!");
    		getChannel(command.sucessChannel).send(new CommandSucessful(command));
    	}
    });

```


```js

    CommandDispatcher.prototype.dispatch = function(command, callback) {
    	var handler = findHandler(command);
    	if(typeof handler === "undefined") {
    		return callback(new NoHandlerBoundForCommand(command));
    	}

    	var maxRetry = 10; // <======= must be configurable
    	var tryNb = 0;
    	var lastError;
    	for(;tryNb<maxRetry;tryNb++) {
    		try {
    			handler.handle(command);
    			// everything ok: break the loop
    			return callback();
    		}
    		catch(e) {
    			lastError = e;
    			if(typeof e === OptimisticLockingException) {
    				if(!command.canRetry()) { // <=================== the retry behavior
    					// nothing can be done
    					return callback(e);
    				}
    			}
    			else {
    				// rethrow as is
    				return callback(e);
    			}
    		}
    	}
        
    	// erf... still there: OptimisticLockingException
    	callback(lastError);
    }
```


#### Sprint, Story et Task

Au cours de notre projet, nous serons amené à créer des stories, à les commenter, à changer leurs états. Les `Stories`
vont avoir leur propre cycle de vie, et bien qu'elles soient rattachées à un projet, chaque `Story` pourra-t-être
modifiée et gérée directement. Il en est de même pour les `Task` au sein d'un `Sprint`. Nous choisissons donc de
considérer les `Story` et les `Task` comme des entités à part entière et même manipulables directement, c'est à
dire des `AggregateRoot`.

Un `Sprint` est rattaché à un projet (via une référence à `ProjectId`). Il en est de même pour les `Story`.
Une `Task` peut être rattachée à une `Story` et peut aussi être rattachée à un `Sprint`

![Story, Sprint and Task Overview](https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-story-sprint-task-75%25-yuml.png?raw=true)

Interessons-nous rapidement à la création et aux méthodes de manipulation de nos entités.


```js
    var story_id = StoryRepository.next_story_id();
	var story = Story.create(story_id, "As a user, I can create an new account", description);
	StoryRepository.store(story);

	...

	var story = StoryRepository.find(story_id);
	story.comment(user_id, "Don't forget to check credential uniqueness");
	StoryRepository.store(story);
```

```js
	var task_id = TaskRepository.new_task_id();
	var task = Task.create(task_id);
	TaskRepository.store(task);
```

De la même façon qu'une `Story` peut être rattachée à un `Project`, 
une `Task` peut être rattachée à `Sprint` et à une `Story`.

Deux choix apparaissent alors pour `Story/Project`:

```js
	var story = StoryRepository.find(story_id);
	story.attach_to_project(project_id);
```

ou

```js
	var project = ProjectRepository.find(project_id);
	project.attach_story(story_id);
```

de même pour `Story/Task`:


```js
	var task  = TaskRepository.find(task_id);
	var task.attach_to_story(story_id);
```

ou

```js
	var story = StoryRepository.find(story_id);
	story.attach_task(task_id);
```

et enfin pour `Sprint/Task`:

```js
	var task  = TaskRepository.find(task_id);
	var task.attach_to_sprint(sprint_id);
```

ou

```js
	var sprint = SprintRepository.find(sprint_id);
	sprint.attach_task(task_id);
```

Il est interessant de constater que l'on retrouve la notion contenant/contenu dans la terminologie
générique choisie: `attach_xxx` et `attach_to_xxx` respectivement. Si l'on se place en tant qu'observateur
de ces changements, il est donc plus facile de regarder le contenant changé, que chacun des objets qui lui
est affecté.



Si l'on utilise une terminologie plus métier cette notion est effacée au profit
d'une sémantique plus riche:

* Une `Story`  est un élément du `Backlog` d'un `Project`
* Une `Story` est découpée en `Task`
* Une `Task` est affectée à un `Sprint`

Nos méthodes deviennent alors:

```js
    var project = ProjectRepository.find(project_id);
	project.add_backlog_item(story_id);

	...

	var story = StoryRepository.find(story_id);
	story.add_sub_task(task_id);

	...

	var task = TaskRepository.find(task_id);
	task.affect_to(sprint_id);
```

#### Résumé

En bref et synthétique pour un développeur, nous voulons pour la partie commande et `domain` de notre application:

```scala
    case class UserId extends UUID
    case class ProjectId extends UUID
    case class StoryId extends UUID
    case class SprintId extends UUID
    case class TaskId extends UUID
``` 

```scala
    trait CommentAware {
        def comment(author:UserId, message:String);
    }
```

```scala
	case class CommentAdded(commentee:UUID, author:UserId, message:String) extends Event
```

```scala
    abstract class Event {
    	def createdBy(creator:UserId);
    }
```

```scala
    object User {
    	def create(user_id:UserId, login:String, password:String);
    }
    class User extends AggregateRoot with CommentAware {
    }
```

```scala
	case class UserCreated(user_id:UserId, login:String, password:String) extends Event
	case class UserLoginChanged(user_id:UserId, login:String) extends Event
```

```scala
	object Project {
    	def create(project_id:ProjectId, project_name:String, owner:UserId);
    }
    class Project extends AggregateRoot with CommentAware {
        def add_member(user_id:UserId, role:TeamMemberRole);
        def change_member_role(user_id:UserId, role:TeamMemberRole);
        def add_backlog_item(story_id:StoryId);
    }
```

```scala
	case class ProjectCreated(project_id:ProjectId, project_name:String, owner:UserId) extends Event
	case class ProjectOwnerChanged(project_id:ProjectId, owner:UserId) extends Event
	case class MemberJoined(project_id:ProjectId, user_id:UserId, role:TeamMemberRole) extends Event
	case class MemberRoleChanged(project_id:ProjectId, user_id:UserId, role:TeamMemberRole) extends Event
	case class MemberLeft(project_id:ProjectId, user_id:UserId) extends Event
	case class MemberFired(project_id:ProjectId, user_id:UserId) extends Event

	case class StoryAdded(project_id:ProjectId, story_id:StoryId) extends Event
	case class StoryDeleted(project_id:ProjectId, story_id:StoryId) extends Event
	case class StoryReassigned(project_id:ProjectId, new_project_id:ProjectId, story_id:StoryId) extends Event
```


```scala
	object Story {
		def create(story_id:StoryId, story_title:String, story_description:String);
    }
    class Story extends AggregateRoot with CommentAware {
        def attach_task(task_id:TaskId);
    }
```

```scala
	case class StoryCreated(story_id:StoryId, story_title:String, story_description:String) extends Event
	case class TaskAttachedToStory(story_id:StoryId, task_id:TaskId) extends Event
```


```scala
	object Sprint {
		def create(sprint_id:SprintId, sprint_objectives:String);
    }
    class Sprint extends AggregateRoot with CommentAware {
        def define_range(date_range:DateRange);
    }
```

```scala
	object Task {
		def create(task_id:TaskId, task_title:String);
    }
    class Task extends AggregateRoot with CommentAware {
        def affect_to(sprint_id:SprintId);
        def change_state(new_state:TaskState);
    }
```
