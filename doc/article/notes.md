# 

Remember back in 1988 in [Object-oriented Software Construction][Meyer], Bertand Meyer stated 
(2Ed pg.748 and pg.751):

> The features that characterize a class are divided into commands and queries. A command serves to 
> modify objects, a query to return information about objects. A command is implemented as a procedure. 
> A query may be implemented either as an attribute (...) or a function.
> (...)
> **Command-Query Separation (CQS) principle**
> Functions should not produce abstract side effects. As a result of the principle, only commands 
> (procedures) will be permitted to produce side effects. (In fact, as noted, we not only permit but 
> expect them to change objects.

This principle, originally applied on an object based level, can be raised in abstraction and applied 
to a full system, as an other complete approach to architecture and organize your system: separate
the reads from the write. According to this, recently new approaches have been emerged and new terms 
have coined. The most known is CRQS, an all-in-one word that embraces Domain Driven Design, CQS and 
Event Sourcing concepts. One of its evangelist Greg Young is strongly encouraging this approach, 
and gives some really cool articles and interviews around this (e.g. recently on QCon London 2011).

![CQRS Overview][cqrs-overview]

[Meyer]:http://www.amazon.com/Object-Oriented-Software-Construction-Book-CD-ROM/dp/0136291554
[cqrs-overview]:https://lh5.googleusercontent.com/-75O4GDGMdyI/Tlk0Tpmp38I/AAAAAAAADIM/k9Y9aecZs5s/s800/overview.png

Let's describe how it works on a concrete case, with some greasy implementation details. But first
one must describe our domain.

# Domain

Our sample application will deal with email management.
Any times a **customer** wants to interact with an organization, he sends an **email**. Such **email** 
can either create a new **ticket** or can be added to an already existing **ticket** to provide additional
**feedback**. 
For example if the customer does not have received an answer in time and ask again for informations, 
or provides additionals informations.
A **customer** can open several different **tickets** at the same time. Each **ticket** has its own
lifecycle. Each **ticket** belongs to a **customer** and is answered by an **agent** of the organisation. 
The application is responsible for finding the most appropriate **agent** (or **group of agent**) and
to **assign** the **ticket** to him.

In order to answer to the customer's question, an **agent** can ask for additionnal information, this
leaves the **ticket** open and send an **email** to the customer with the agent's question.  It is 
also possible for an **agent** to add a **comment** within a **ticket** to keep track of informations,
those **comments** shouldn't be seen by the customer as they are for the organisation internal usage 
only. 

If an **agent** cannot answer to the customer, it is possible for him to **ask for help** to other 
**agent** (or **group of agents**). In such case, the **ticket** still belongs to the **agent** but
the the other **agent** receive a notification that someone is querying its help. 

In some situations, it is also possible for an **agent** to **forward** the **ticket** to another 
**agent** (or **group of agent**) when he thinks he is not the most appropriate person to answer it, 
or if he does not have enough **rights** (**permission**) to continue to manage the **ticket**: for 
example, if an agent does not have the right to answer directly to a **customer**, he can forward the 
**ticket** with the right answer to the next **agent** in the process.

When a question is successfully answered, an **agent** can **close** the ticket. If the **customer** 
provides additional feedback to a **closed** **ticket**, it is **reopened** and automatically 
**assigned** to the last **agent** that answered it.

There are two kinds of users that can be connected to the application: the **agents** and the 
**administrator**. Both of them needs to be authentified when connecting to the application. An 
**administrator** is responsible for managing the application itself, while an **agent** is responsible 
for managing the **ticket**. An **administrator** defines the **mailboxes** that are popped to retrieve 
the **email** that feed the system. An **administrator** can create, update, activate or deactivate 
**agent** in the application, and modify the **set of permission** of each **agent**.
**agent** can be organized into **group**, each **group** can also contains subgroups and **agents**.


# CQRS

## Command

    PersonChangeNameCommand(personId:ID, newName:String)
    PersonReadBookCommand(personId:ID, bookId:ID)
    PersonMovedUpCommand(personId:ID, newAddress:Address)
    PersonAddressStree

##

> The whole point of an aggregate boundary is that everything inside is
> consistent. - Greg Young

One can note this is very similar to the distinction of the operational database and the data warehouse
used for reporting. This acts exactly the same: one builds query-oriented database to optimize the read.

> This is the sound philosophy of CQRS. Separate the commands from queries.
> The commands change the state of the system and should be transactional and act on small consistent
> chuncks (Aggregate Roots in DDD). These chunks can well be stored as Blob in a NoSql database. 
> When the state as changed, the command publish an event that can be subscribed by the Query/Reporting
> context. In this context you can denormalize the value in a RDBMS (for lists) or in an OLAP cube 
> (for stats) to show data to your users. No need to have the same model when changing the system and
> when querying it, these are different concerns.


[wikipedia-datawarehouse]:http://en.wikipedia.org/wiki/Data_warehouse

# Links and related notes

## Articles

* [Mark Nijhof - Fohjin](https://github.com/MarkNijhof/Fohjin)
* [Mark Nijhof - Blog](http://cre8ivethought.com/blog)
  * [CQRS à la Greg Young](http://cre8ivethought.com/blog/2009/11/12/cqrs--la-greg-young)
  * [CQRS Domain Events](http://cre8ivethought.com/blog/2009/11/20/cqrs-domain-events)
  * [CQRS Trying to make it re-usable](http://cre8ivethought.com/blog/2009/11/28/cqrs-trying-to-make-it-re-usable)
  * [CQRS Domain State](http://cre8ivethought.com/blog/2009/12/08/cqrs-domain-state)
  * [Using conventions with Passive View](http://cre8ivethought.com/blog/2009/12/19/using-conventions-with-passive-view)
  * [CQRS Event Sourcing](http://cre8ivethought.com/blog/2010/02/05/cqrs-event-sourcing)
  * [CQRS Event Versioning](http://cre8ivethought.com/blog/2010/02/09/cqrs-event-versioning)
  * [CQRS Scalability](http://cre8ivethought.com/blog/2010/02/09/cqrs-scalability)
* [Udi Dahan - website](http://www.udidahan.com/)
  * [Udi Dahan - Clarified CQRS](http://www.udidahan.com/2009/12/09/clarified-cqrs/)
  * [CQRS isn’t the answer – it’s just one of the questions](http://www.udidahan.com/2010/05/07/cqrs-isnt-the-answer-its-just-one-of-the-questions/)
  * [Race Conditions Don’t Exist](http://www.udidahan.com/2010/08/31/race-conditions-dont-exist/)
  * [When to avoid CQRS](http://www.udidahan.com/2011/04/22/when-to-avoid-cqrs/)
* [Rinat Abdullin - CQRS Starting Page](http://abdullin.com/cqrs/)
* [Rinat Abdullin - CQRS Architecture and Definitions](http://abdullin.com/journal/2010/11/3/cqrs-architecture-and-definitions.html)
* [CQRS info - Lot of Links](http://cqrsinfo.com/)
* [Greg Young - Blogs](http://codebetter.com/gregyoung/)
* [Think Before Coding - CQRS](http://thinkbeforecoding.com/tag/CQRS)
* [DDD/CQRS Google Group](http://groups.google.com/group/dddcqrs)
* [Julien's blog - Software crafting and .NET tips, the agile way](http://julienletrouit.com/?tag=cqrs&lang=en)
* [CQRS sur Windows Azure - in French](http://msdn.microsoft.com/fr-fr/magazine/gg983487.aspx)
* [Fornax Sculptor](http://fornax-sculptor.blogspot.com/2010/09/eda-cqrs-betting-sample.html)
* [CQRS with Axon framework](http://www.infoq.com/articles/cqrs_with_axon_framework)
* [CQRS Event Store](http://blog.jonathanoliver.com/2010/07/cqrs-event-store/)

## Podcast

* [Distributed Podcast](http://distributedpodcast.com/category/podcasts)
  1. [Episode 1 - Host Introduction](http://distributedpodcast.com/2010/episode-1-host-introductions)
  2. [Episode 2 - CQRS Building block](http://distributedpodcast.com/2011/episode-2-cqrs-building-block)
  3. [Episode 3 - Messaging](http://distributedpodcast.com/2011/episode-3-messaging)
    * Poisoned message goes to poisoned queue
    * Command and Event are both messages. Command is a request to do something, it has not happened
      yet. Events on the other side are statements of fact: it is something that has happened and cannot
      be revoked. They both capture intents. Command introduce what is called behavior coupling.
      The commands goes from the client side to the server side.
  4. [Episode IV - A New Hope ... and NoSQL](http://distributedpodcast.com/2011/episode-iv-a-new-hope-and-nosql)
  5. [Episode 5 - Event store...](http://distributedpodcast.com/2011/episode-5-cqrs-eventstore-best-frameworklibrary-ever)
  6. [Episode 6 - Interview with Jimmy Bogard](http://distributedpodcast.com/2011/episode-6-interview-with-jimmy-bogard)
  7. [Episode 007 - Interview With Ayende Rahien](http://distributedpodcast.com/2011/episode-007-interview-with-ayende-rahien)
  8. [Episode 8 - When to avoid CQRS](http://distributedpodcast.com/2011/episode-8-when-to-avoid-cqrs)
* [Talking Domain-Driven Design with David Laribee - Part 1](http://deepfriedbytes.com/podcast/episode-6-talking-domain-driven-design-with-david-laribee-part-1/)
* [Talking Domain-Driven Design with David Laribee – Part 2](http://deepfriedbytes.com/podcast/episode-7-talking-domain-driven-design-with-david-laribee-ndash-part-2/)

## Video

* [Greg Young - Events are not just for notifications](http://www.infoq.com/presentations/Events-Are-Not-Just-for-Notifications)
  * Very clear and understandable video. This was my first step toward **CQRS**.
* [CQRS class - 6h30!](http://cqrsinfo.com/video/)
* [Greg Young - Simple is better](http://skillsmatter.com/podcast/design-architecture/simple-is-better)
* [Udi Dahan - CQRS, race conditions, and sagas - oh my!](http://skillsmatter.com/podcast/design-architecture/udi-dahan-cqrs-race-conditions-and-sagas)
* [Jonathan Oliver - CQRS - An Introduction for Beginners](http://vimeo.com/9573973)
* [Jonathan Oliver - CQRS - Utah Code Camp 2010 - Part 1](http://vimeo.com/10493269)
* [The Case for CQRS and Event Sourcing](http://vimeo.com/25801867)
* [Command Query Responsibility Segregation - Udi Dahan](http://vimeo.com/8944337)

## Not CRQS related but still interesting

* [The Essence of Caching – Ehcache](http://www.java-tv.com/2011/04/05/the-essence-of-caching-ehcache/)
* [JVM Internals – What Does the JVM Do?](http://www.java-tv.com/2011/08/08/jvm-internals-what-does-the-jvm-do/)
