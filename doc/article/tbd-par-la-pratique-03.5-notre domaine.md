En prenant un peu de recul sur cette série d'article, je me rends compte que j'ai très vite survollé le 
domaine pour m'interesser à l'implémentation de l'application. Même si le domaine est relativement clair
dans ma tête, il est important que je passe un peu de temps à le mettre à plat: c'est d'ailleurs le but 
de cette série d'articles.

Ordinairement, quand on pense modèle on arrive rapidement à dessiner une sorte de diagramme de classe. 
Je ne vais pas y échapper afin d'avoir une base de discussion.

![Domain Overview][domain-overview-01]

<table style="border:0">
	<tr><td>![Project][project]</td><td>&nbsp;           </td><td>&nbsp;       </td></tr>
	<tr><td>![Team][team]      </td><td>![Member][member]</td><td>![User][user]</td></tr>
	<tr><td>![Backlog][backlog]</td><td>![Story][story]  </td><td>![Comment][comment]</td></tr>
	<tr><td>![Sprint][sprint]  </td><td>![Task][task]    </td><td>&nbsp;       </td></tr>
</table>



[domain-overview-01]:https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-01-yuml.png?raw=true
[project]:https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-project-yuml.png?raw=true
[team]:https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-team-yuml.png?raw=true
[backlog]:https://github.com/Arnauld/CQRS-Ramblings/blob/master/doc/images/overall-domain-backlog-yuml.png?raw=true

On y retrouve nos principaux concepts, à savoir:

* Le projet
* L'équipe et ses membres
* Le Backlog et ses Stories
* Les Sprints et leurs Tasks

La notion de projet ajoute une indirection initiale, et permet à une même personne d'appartenir à plusieurs
projet et même d'avoir un rôle différent dans chacun: une personne peut être `developer` dans un projet et
`scrum master` dans un autre, voir être membre de plusieurs projets.

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

Définissons désormais nos entités et nos aggrégats.






