## L'Event sourcing c'est quoi?

voir [Event Sourcing](event-sourcing]:http://martinfowler.com/eaaDev/EventSourcing.html)

> Captures all changes to an application state as a sequence of events.

En bref, au lieu de conserver le dernier état d'un objet, on conserve toutes les transitions qui ont amené à cet état.
En conservant l'ensemble de ces transitions, il est ainsi possible de rejouer les différents états pris par l'objet 
au cours de son cycle de vie. Plus important encore, ce n'est pas seulement le changement d'état qui est
conservé, mais l'intention de l'utilisateur qui a provoqué ce changement.

Supposons que l'on se promène sur amazon. A chaque fois que l'on tombe sur un livre qui nous plait, on l'ajoute à notre
panier.
Au bout d'un moment, notre panier pourrait ressembler à cela:

```javascript
    [
      "Domain-Driven Design: Tackling Complexity in the Heart of Software",
      "Applying Domain-Driven Design and Patterns: With Examples in C# and .NET",
      "Event Centric: Finding Simplicity in Complex Systems",
      "Streamlined Object Modeling: Patterns, Rules, and Implementation"
    ]
```

Quand on se décide finalement de passer la commande, oh stupeur on en a pour $201.20. Notre budget ne le permettant pas, 
après une sélection drastique notre panier se déleste de deux livres, et on ne conserve que:

```javascript
    [
      "Domain-Driven Design: Tackling Complexity in the Heart of Software",
      "Streamlined Object Modeling: Patterns, Rules, and Implementation"
    ]
```

Le montant s'élève alors à $97.66, ce qui est acceptable pour notre budget actuel. La commande passée, il ne reste plus rien
des deux livres que nous souhaitions acheter et que nous avons dû mettre de côté faute de moyen.

Si maintenant, on conserve l'intégralité des changements d'états, l'historique de notre panier (vu d'un point de vue technique)
pourrait être similaire à:

```javascript
   [
     BookAdded("Domain-Driven Design: Tackling Complexity in the Heart of Software"),
     BookAdded("Patterns of Enterprise Application Architecture"),
     BookAdded("Applying Domain-Driven Design and Patterns: With Examples in C# and .NET"),
     BookRemoved("Patterns of Enterprise Application Architecture"),
     BookAdded("Event Centric: Finding Simplicity in Complex Systems"),
     BookAdded("Streamlined Object Modeling: Patterns, Rules, and Implementation"),
     BookRemoved("Event Centric: Finding Simplicity in Complex Systems"),
     BookRemoved("Streamlined Object Modeling: Patterns, Rules, and Implementation")
   ]
```

En conservant, l'ensemble des changements d'états on se rend compte que le livre 
"Patterns of Enterprise Application Architecture" a fait une apparition aussi dans le panier, ainsi que les deux livres
enlevés à la fin.

Maintenant en conservant l'historique, les intentions de l'utilisateurs on obtient:

```javascript
   [
     BookAdded("Domain-Driven Design: Tackling Complexity in the Heart of Software"),
     PeopleAlsoBought("Patterns of Enterprise Application Architecture"),
     BookAdded("Patterns of Enterprise Application Architecture"),
     PeopleAlsoBought("Applying Domain-Driven Design and Patterns: With Examples in C# and .NET"),
     BookAdded("Applying Domain-Driven Design and Patterns: With Examples in C# and .NET"),
     BookRemoved("Patterns of Enterprise Application Architecture"),
     Search("event centric"),
     BookAdded("Event Centric: Finding Simplicity in Complex Systems"),
     BookAdded("Streamlined Object Modeling: Patterns, Rules, and Implementation"),
     BookRemovedOnBilling("Event Centric: Finding Simplicity in Complex Systems"),
     BookRemovedOnBilling("Streamlined Object Modeling: Patterns, Rules, and Implementation")
   ]
```
On peux désormais constater que les deux derniers livres ont été enlevés du panier dans le cadre du paiement.

 D'autre part, on constate que le choix de certains livres a été fait
en cliquant sur les livres présentées dans la section "Les clients ayant acheté cet article ont également acheté",
ce qui renforce l'interêt de cette section. Ceci est très instructifs, et va permettre
de cibler les prochaines suggestions d'achats en privilégiant ces livres. En effet, s'ils ont déjà suscité de 
l'interêt jusqu'au moment de l'achat, il est for probable que cela se reproduise.


Ce qui est interessant, c'est que même si l'on ne dispose pas encore de notre mécanique de suggestions ou de nos
outils d'analyse, l'information est présente et pourra être analysée lorsque nous aurons les outils adéquats.
D'autre part, on dispose de toutes les informations pour "rejouer" la constitution de notre panier.

