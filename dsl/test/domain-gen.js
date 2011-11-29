var Sslac = require("sslac"),
        F = require("./framework");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     nscrum.User
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * nscrum.UserId
 */
Sslac.Class("nscrum.UserId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

/**
 *  nscrum.User: UserCreatedEvent factory event
 */
Sslac.Class("nscrum.UserCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (user_id,login,password) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.UserCreatedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.UserCreatedEvent", {
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            login :  login ,
	            password :  password 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.login === "undefined") {
	  		throw nscrum.MissingData("Field login is undefined");
	    }
	    if(typeof this.data.password === "undefined") {
	  		throw nscrum.MissingData("Field password is undefined");
	    }
	    
     })
     
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("login", function () {
        return this.data.login; 
     })
     .Method("password", function () {
        return this.data.password; 
     })
     ;

/**
 * nscrum.User: UserCreatedEvent event handler
 */
Sslac.Function("nscrum.UserHandler.nscrum_UserCreatedEvent", function(event) {
        this.assign_id(event.user_id());
        this.data.login = event.login();
      
     })
     ;

/**
 *  nscrum.User: UserLoginChangedEvent behavior event
 */
Sslac.Class("nscrum.UserLoginChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (user_id,new_login) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.UserLoginChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.UserLoginChangedEvent", {
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            new_login :  new_login 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.new_login === "undefined") {
	  		throw nscrum.MissingData("Field new_login is undefined");
	    }
	    
     })
     
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("new_login", function () {
        return this.data.new_login; 
     })
     ;

/**
 * nscrum.User: UserLoginChangedEvent event handler
 */
Sslac.Function("nscrum.UserHandler.nscrum_UserLoginChangedEvent", function(event) {
        this.assign_id(event.user_id());
        this.data.login = event.new_login();
      
     })
     ;

/**
 *  nscrum.User: UserActivatedEvent behavior event
 */
Sslac.Class("nscrum.UserActivatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (user_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.UserActivatedEvent");
     	}
     	else if(arguments.length == 1) {
	        this.Parent("nscrum.UserActivatedEvent", {
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 1 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    
     })
     
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.User: UserActivatedEvent event handler
 */
Sslac.Function("nscrum.UserHandler.nscrum_UserActivatedEvent", function(event) {
        this.assign_id(event.user_id());
        
     })
     ;

/**
 *  nscrum.User: UserDeactivatedEvent behavior event
 */
Sslac.Class("nscrum.UserDeactivatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (user_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.UserDeactivatedEvent");
     	}
     	else if(arguments.length == 1) {
	        this.Parent("nscrum.UserDeactivatedEvent", {
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 1 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    
     })
     
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.User: UserDeactivatedEvent event handler
 */
Sslac.Function("nscrum.UserHandler.nscrum_UserDeactivatedEvent", function(event) {
        this.assign_id(event.user_id());
        
     })
     ;



/**
 * nscrum.User: entity / aggregate root
 */
Sslac.Class("nscrum.User")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Static("load_from_history", function(event_stream) {
        var user = new nscrum.User ();
        user.load_from_history (event_stream);
        return user;
     })
     /**
      * Entity ns
      */
     .Method("entity_ns", function() { 
         return "nscrum.User"; 
     })
     /**
      * Event handler ns (used to find event specific handler through reflection)
      */
     .Method("handler_ns", function() { 
         return "nscrum.UserHandler"; 
     })
     /**
      * Field accessor method: login
      */
     .Method("login", function() {
         return this.data.login;
     })
     /**
      * Field accessor method: active
      */
     .Method("active", function() {
         return this.data.active;
     })
     /**
      * Behavior method: change_login
      */
     .Method("change_login", function(new_login) {
        this.apply_event(new nscrum.UserLoginChangedEvent(this.aggregate_id(), new_login));
     })
     /**
      * Behavior method: activate
      */
     .Method("activate", function() {
        this.apply_event(new nscrum.UserActivatedEvent(this.aggregate_id()));
     })
     /**
      * Behavior method: deactivate
      */
     .Method("deactivate", function() {
        this.apply_event(new nscrum.UserDeactivatedEvent(this.aggregate_id()));
     })
     /**
      * Factory method
      */
     .Static("create", function(user_id, login, password) {
        var user = new nscrum.User ();
    	user.apply_event(new nscrum.UserCreatedEvent(user_id, login, password));
    	return user;
     })
     
     ;

/**
 * nscrum.UserRepository
 */
Sslac.Class("nscrum.UserRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store, notification_bus) {
        this.Parent("nscrum.User", "nscrum.UserId", event_store, notification_bus);
     })
     .Method("asDefault", function() {
        nscrum.Environment.nscrum_UserRepository = this;
        return this;
     })
     .Static("getDefault", function() {
     	var instance = nscrum.Environment.nscrum_UserRepository;
     	if(!instance) {
     		throw nscrum.NotBoundInEnvironment("nscrum.UserRepository");
     	}
        return instance;
     })
     ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     nscrum.Project
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * nscrum.ProjectId
 */
Sslac.Class("nscrum.ProjectId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

/**
 *  nscrum.Project: ProjectCreatedEvent factory event
 */
Sslac.Class("nscrum.ProjectCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,project_name,owner_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectCreatedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.ProjectCreatedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            project_name :  project_name ,
	            owner_id :  owner_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.project_name === "undefined") {
	  		throw nscrum.MissingData("Field project_name is undefined");
	    }
	    if(typeof this.data.owner_id === "undefined") {
	  		throw nscrum.MissingData("Field owner_id is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("project_name", function () {
        return this.data.project_name; 
     })
     .Method("owner_id", function () {
        return new nscrum.UserId(this.data.owner_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.Project: ProjectCreatedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectCreatedEvent", function(event) {
        this.assign_id(event.project_id());
        this.data.name = event.project_name();
      this.data.owner_id = event.owner_id();
      
     })
     ;

/**
 *  nscrum.Project: ProjectNameChangedEvent behavior event
 */
Sslac.Class("nscrum.ProjectNameChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,new_name) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectNameChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.ProjectNameChangedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            new_name :  new_name 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.new_name === "undefined") {
	  		throw nscrum.MissingData("Field new_name is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("new_name", function () {
        return this.data.new_name; 
     })
     ;

/**
 * nscrum.Project: ProjectNameChangedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectNameChangedEvent", function(event) {
        this.assign_id(event.project_id());
        this.data.name = event.new_name();
      
     })
     ;

/**
 *  nscrum.Project: ProjectMemberAddedEvent behavior event
 */
Sslac.Class("nscrum.ProjectMemberAddedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,user_id,role) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectMemberAddedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.ProjectMemberAddedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            role :  role 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.role === "undefined") {
	  		throw nscrum.MissingData("Field role is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("role", function () {
        return this.data.role; 
     })
     ;

/**
 * nscrum.Project: ProjectMemberAddedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectMemberAddedEvent", function(event) {
        this.assign_id(event.project_id());
        
     })
     ;

/**
 *  nscrum.Project: ProjectMemberRemovedEvent behavior event
 */
Sslac.Class("nscrum.ProjectMemberRemovedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,user_id,role) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectMemberRemovedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.ProjectMemberRemovedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            role :  role 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.role === "undefined") {
	  		throw nscrum.MissingData("Field role is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("role", function () {
        return this.data.role; 
     })
     ;

/**
 * nscrum.Project: ProjectMemberRemovedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectMemberRemovedEvent", function(event) {
        this.assign_id(event.project_id());
        
     })
     ;

/**
 *  nscrum.Project: ProjectMemberFiredEvent behavior event
 */
Sslac.Class("nscrum.ProjectMemberFiredEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,firer,user_id,role) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectMemberFiredEvent");
     	}
     	else if(arguments.length == 4) {
	        this.Parent("nscrum.ProjectMemberFiredEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            firer :  firer ,
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            role :  role 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 4 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.firer === "undefined") {
	  		throw nscrum.MissingData("Field firer is undefined");
	    }
	    if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.role === "undefined") {
	  		throw nscrum.MissingData("Field role is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("firer", function () {
        return this.data.firer; 
     })
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("role", function () {
        return this.data.role; 
     })
     ;

/**
 * nscrum.Project: ProjectMemberFiredEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectMemberFiredEvent", function(event) {
        this.assign_id(event.project_id());
        
     })
     ;

/**
 *  nscrum.Project: ProjectMemberRoleChangedEvent behavior event
 */
Sslac.Class("nscrum.ProjectMemberRoleChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,user_id,role) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectMemberRoleChangedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.ProjectMemberRoleChangedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            user_id :  user_id.uuid() /*unwrap uuid for serialization*/ ,
	            role :  role 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.user_id === "undefined") {
	  		throw nscrum.MissingData("Field user_id is undefined");
	    }
	    if(typeof this.data.role === "undefined") {
	  		throw nscrum.MissingData("Field role is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("user_id", function () {
        return new nscrum.UserId(this.data.user_id); /*rewrap uuid*/
     })
     .Method("role", function () {
        return this.data.role; 
     })
     ;

/**
 * nscrum.Project: ProjectMemberRoleChangedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectMemberRoleChangedEvent", function(event) {
        this.assign_id(event.project_id());
        
     })
     ;

/**
 *  nscrum.Project: ProjectBacklogItemAddedEvent behavior event
 */
Sslac.Class("nscrum.ProjectBacklogItemAddedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,story_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.ProjectBacklogItemAddedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.ProjectBacklogItemAddedEvent", {
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    
     })
     
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.Project: ProjectBacklogItemAddedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectBacklogItemAddedEvent", function(event) {
        this.assign_id(event.project_id());
        
     })
     ;



/**
 * nscrum.Project: entity / aggregate root
 */
Sslac.Class("nscrum.Project")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Static("load_from_history", function(event_stream) {
        var project = new nscrum.Project ();
        project.load_from_history (event_stream);
        return project;
     })
     /**
      * Entity ns
      */
     .Method("entity_ns", function() { 
         return "nscrum.Project"; 
     })
     /**
      * Event handler ns (used to find event specific handler through reflection)
      */
     .Method("handler_ns", function() { 
         return "nscrum.ProjectHandler"; 
     })
     /**
      * Field accessor method: name
      */
     .Method("name", function() {
         return this.data.name;
     })
     /**
      * Field accessor method: owner_id
      */
     .Method("owner_id", function() {
         return this.data.owner_id;
     })
     /**
      * Behavior method: change_name
      */
     .Method("change_name", function(new_name) {
        this.apply_event(new nscrum.ProjectNameChangedEvent(this.aggregate_id(), new_name));
     })
     /**
      * Behavior method: add_member
      */
     .Method("add_member", function(user_id, role) {
        this.apply_event(new nscrum.ProjectMemberAddedEvent(this.aggregate_id(), user_id, role));
     })
     /**
      * Behavior method: remove_member
      */
     .Method("remove_member", function(user_id, role) {
        this.apply_event(new nscrum.ProjectMemberRemovedEvent(this.aggregate_id(), user_id, role));
     })
     /**
      * Behavior method: fire_member
      */
     .Method("fire_member", function(firer, user_id, role) {
        this.apply_event(new nscrum.ProjectMemberFiredEvent(this.aggregate_id(), firer, user_id, role));
     })
     /**
      * Behavior method: change_member_role
      */
     .Method("change_member_role", function(user_id, role) {
        this.apply_event(new nscrum.ProjectMemberRoleChangedEvent(this.aggregate_id(), user_id, role));
     })
     /**
      * Behavior method: add_backlog_item
      */
     .Method("add_backlog_item", function(story_id) {
        this.apply_event(new nscrum.ProjectBacklogItemAddedEvent(this.aggregate_id(), story_id));
     })
     /**
      * Factory method
      */
     .Static("create", function(project_id, project_name, owner_id) {
        var project = new nscrum.Project ();
    	project.apply_event(new nscrum.ProjectCreatedEvent(project_id, project_name, owner_id));
    	return project;
     })
     
     ;

/**
 * nscrum.ProjectRepository
 */
Sslac.Class("nscrum.ProjectRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store, notification_bus) {
        this.Parent("nscrum.Project", "nscrum.ProjectId", event_store, notification_bus);
     })
     .Method("asDefault", function() {
        nscrum.Environment.nscrum_ProjectRepository = this;
        return this;
     })
     .Static("getDefault", function() {
     	var instance = nscrum.Environment.nscrum_ProjectRepository;
     	if(!instance) {
     		throw nscrum.NotBoundInEnvironment("nscrum.ProjectRepository");
     	}
        return instance;
     })
     ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     nscrum.Story
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * nscrum.StoryId
 */
Sslac.Class("nscrum.StoryId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

/**
 *  nscrum.Story: StoryCreatedEvent factory event
 */
Sslac.Class("nscrum.StoryCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id,project_id,story_title,story_description) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.StoryCreatedEvent");
     	}
     	else if(arguments.length == 4) {
	        this.Parent("nscrum.StoryCreatedEvent", {
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ ,
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            story_title :  story_title ,
	            story_description :  story_description 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 4 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.story_title === "undefined") {
	  		throw nscrum.MissingData("Field story_title is undefined");
	    }
	    if(typeof this.data.story_description === "undefined") {
	  		throw nscrum.MissingData("Field story_description is undefined");
	    }
	    
     })
     
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("story_title", function () {
        return this.data.story_title; 
     })
     .Method("story_description", function () {
        return this.data.story_description; 
     })
     ;

/**
 * nscrum.Story: StoryCreatedEvent event handler
 */
Sslac.Function("nscrum.StoryHandler.nscrum_StoryCreatedEvent", function(event) {
        this.assign_id(event.story_id());
        this.data.project_id = event.project_id();
      this.data.title = event.story_title();
      this.data.description = event.story_description();
      
     })
     ;

/**
 *  nscrum.Story: StoryComplexityChangedEvent behavior event
 */
Sslac.Class("nscrum.StoryComplexityChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id,complexity) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.StoryComplexityChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.StoryComplexityChangedEvent", {
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ ,
	            complexity :  complexity 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    if(typeof this.data.complexity === "undefined") {
	  		throw nscrum.MissingData("Field complexity is undefined");
	    }
	    
     })
     
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     .Method("complexity", function () {
        return this.data.complexity; 
     })
     ;

/**
 * nscrum.Story: StoryComplexityChangedEvent event handler
 */
Sslac.Function("nscrum.StoryHandler.nscrum_StoryComplexityChangedEvent", function(event) {
        this.assign_id(event.story_id());
        this.data.complexity = event.complexity();
      
     })
     ;

/**
 *  nscrum.Story: StoryBusinessValueChangedEvent behavior event
 */
Sslac.Class("nscrum.StoryBusinessValueChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id,business_value) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.StoryBusinessValueChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.StoryBusinessValueChangedEvent", {
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ ,
	            business_value :  business_value 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    if(typeof this.data.business_value === "undefined") {
	  		throw nscrum.MissingData("Field business_value is undefined");
	    }
	    
     })
     
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     .Method("business_value", function () {
        return this.data.business_value; 
     })
     ;

/**
 * nscrum.Story: StoryBusinessValueChangedEvent event handler
 */
Sslac.Function("nscrum.StoryHandler.nscrum_StoryBusinessValueChangedEvent", function(event) {
        this.assign_id(event.story_id());
        this.data.business_value = event.business_value();
      
     })
     ;

/**
 *  nscrum.Story: StoryTitleChangedEvent behavior event
 */
Sslac.Class("nscrum.StoryTitleChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id,title) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.StoryTitleChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.StoryTitleChangedEvent", {
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ ,
	            title :  title 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    if(typeof this.data.title === "undefined") {
	  		throw nscrum.MissingData("Field title is undefined");
	    }
	    
     })
     
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     .Method("title", function () {
        return this.data.title; 
     })
     ;

/**
 * nscrum.Story: StoryTitleChangedEvent event handler
 */
Sslac.Function("nscrum.StoryHandler.nscrum_StoryTitleChangedEvent", function(event) {
        this.assign_id(event.story_id());
        this.data.title = event.title();
      
     })
     ;

/**
 *  nscrum.Story: StoryDescriptionChangedEvent behavior event
 */
Sslac.Class("nscrum.StoryDescriptionChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id,description) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.StoryDescriptionChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.StoryDescriptionChangedEvent", {
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ ,
	            description :  description 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    if(typeof this.data.description === "undefined") {
	  		throw nscrum.MissingData("Field description is undefined");
	    }
	    
     })
     
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     .Method("description", function () {
        return this.data.description; 
     })
     ;

/**
 * nscrum.Story: StoryDescriptionChangedEvent event handler
 */
Sslac.Function("nscrum.StoryHandler.nscrum_StoryDescriptionChangedEvent", function(event) {
        this.assign_id(event.story_id());
        this.data.description = event.description();
      
     })
     ;



/**
 * nscrum.Story: entity / aggregate root
 */
Sslac.Class("nscrum.Story")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Static("load_from_history", function(event_stream) {
        var story = new nscrum.Story ();
        story.load_from_history (event_stream);
        return story;
     })
     /**
      * Entity ns
      */
     .Method("entity_ns", function() { 
         return "nscrum.Story"; 
     })
     /**
      * Event handler ns (used to find event specific handler through reflection)
      */
     .Method("handler_ns", function() { 
         return "nscrum.StoryHandler"; 
     })
     /**
      * Field accessor method: project_id
      */
     .Method("project_id", function() {
         return this.data.project_id;
     })
     /**
      * Field accessor method: title
      */
     .Method("title", function() {
         return this.data.title;
     })
     /**
      * Field accessor method: description
      */
     .Method("description", function() {
         return this.data.description;
     })
     /**
      * Field accessor method: complexity
      */
     .Method("complexity", function() {
         return this.data.complexity;
     })
     /**
      * Field accessor method: business_value
      */
     .Method("business_value", function() {
         return this.data.business_value;
     })
     /**
      * Behavior method: change_complexity
      */
     .Method("change_complexity", function(complexity) {
        this.apply_event(new nscrum.StoryComplexityChangedEvent(this.aggregate_id(), complexity));
     })
     /**
      * Behavior method: change_business_value
      */
     .Method("change_business_value", function(business_value) {
        this.apply_event(new nscrum.StoryBusinessValueChangedEvent(this.aggregate_id(), business_value));
     })
     /**
      * Behavior method: change_title
      */
     .Method("change_title", function(title) {
        this.apply_event(new nscrum.StoryTitleChangedEvent(this.aggregate_id(), title));
     })
     /**
      * Behavior method: change_description
      */
     .Method("change_description", function(description) {
        this.apply_event(new nscrum.StoryDescriptionChangedEvent(this.aggregate_id(), description));
     })
     /**
      * Factory method
      */
     .Static("create", function(story_id, project_id, story_title, story_description) {
        var story = new nscrum.Story ();
    	story.apply_event(new nscrum.StoryCreatedEvent(story_id, project_id, story_title, story_description));
    	return story;
     })
     
     ;

/**
 * nscrum.StoryRepository
 */
Sslac.Class("nscrum.StoryRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store, notification_bus) {
        this.Parent("nscrum.Story", "nscrum.StoryId", event_store, notification_bus);
     })
     .Method("asDefault", function() {
        nscrum.Environment.nscrum_StoryRepository = this;
        return this;
     })
     .Static("getDefault", function() {
     	var instance = nscrum.Environment.nscrum_StoryRepository;
     	if(!instance) {
     		throw nscrum.NotBoundInEnvironment("nscrum.StoryRepository");
     	}
        return instance;
     })
     ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     nscrum.Sprint
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * nscrum.SprintId
 */
Sslac.Class("nscrum.SprintId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

/**
 *  nscrum.Sprint: SprintCreatedEvent factory event
 */
Sslac.Class("nscrum.SprintCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (sprint_id,project_id,sprint_objectives) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.SprintCreatedEvent");
     	}
     	else if(arguments.length == 3) {
	        this.Parent("nscrum.SprintCreatedEvent", {
	            sprint_id :  sprint_id.uuid() /*unwrap uuid for serialization*/ ,
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            sprint_objectives :  sprint_objectives 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 3 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.sprint_id === "undefined") {
	  		throw nscrum.MissingData("Field sprint_id is undefined");
	    }
	    if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.sprint_objectives === "undefined") {
	  		throw nscrum.MissingData("Field sprint_objectives is undefined");
	    }
	    
     })
     
     .Method("sprint_id", function () {
        return new nscrum.SprintId(this.data.sprint_id); /*rewrap uuid*/
     })
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("sprint_objectives", function () {
        return this.data.sprint_objectives; 
     })
     ;

/**
 * nscrum.Sprint: SprintCreatedEvent event handler
 */
Sslac.Function("nscrum.SprintHandler.nscrum_SprintCreatedEvent", function(event) {
        this.assign_id(event.sprint_id());
        
     })
     ;

/**
 *  nscrum.Sprint: SprintRangeDefinedEvent behavior event
 */
Sslac.Class("nscrum.SprintRangeDefinedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (sprint_id,date_range) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.SprintRangeDefinedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.SprintRangeDefinedEvent", {
	            sprint_id :  sprint_id.uuid() /*unwrap uuid for serialization*/ ,
	            date_range :  date_range 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.sprint_id === "undefined") {
	  		throw nscrum.MissingData("Field sprint_id is undefined");
	    }
	    if(typeof this.data.date_range === "undefined") {
	  		throw nscrum.MissingData("Field date_range is undefined");
	    }
	    
     })
     
     .Method("sprint_id", function () {
        return new nscrum.SprintId(this.data.sprint_id); /*rewrap uuid*/
     })
     .Method("date_range", function () {
        return this.data.date_range; 
     })
     ;

/**
 * nscrum.Sprint: SprintRangeDefinedEvent event handler
 */
Sslac.Function("nscrum.SprintHandler.nscrum_SprintRangeDefinedEvent", function(event) {
        this.assign_id(event.sprint_id());
        
     })
     ;



/**
 * nscrum.Sprint: entity / aggregate root
 */
Sslac.Class("nscrum.Sprint")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Static("load_from_history", function(event_stream) {
        var sprint = new nscrum.Sprint ();
        sprint.load_from_history (event_stream);
        return sprint;
     })
     /**
      * Entity ns
      */
     .Method("entity_ns", function() { 
         return "nscrum.Sprint"; 
     })
     /**
      * Event handler ns (used to find event specific handler through reflection)
      */
     .Method("handler_ns", function() { 
         return "nscrum.SprintHandler"; 
     })
     /**
      * Behavior method: define_range
      */
     .Method("define_range", function(date_range) {
        this.apply_event(new nscrum.SprintRangeDefinedEvent(this.aggregate_id(), date_range));
     })
     /**
      * Factory method
      */
     .Static("create", function(sprint_id, project_id, sprint_objectives) {
        var sprint = new nscrum.Sprint ();
    	sprint.apply_event(new nscrum.SprintCreatedEvent(sprint_id, project_id, sprint_objectives));
    	return sprint;
     })
     
     ;

/**
 * nscrum.SprintRepository
 */
Sslac.Class("nscrum.SprintRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store, notification_bus) {
        this.Parent("nscrum.Sprint", "nscrum.SprintId", event_store, notification_bus);
     })
     .Method("asDefault", function() {
        nscrum.Environment.nscrum_SprintRepository = this;
        return this;
     })
     .Static("getDefault", function() {
     	var instance = nscrum.Environment.nscrum_SprintRepository;
     	if(!instance) {
     		throw nscrum.NotBoundInEnvironment("nscrum.SprintRepository");
     	}
        return instance;
     })
     ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     nscrum.Task
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * nscrum.TaskId
 */
Sslac.Class("nscrum.TaskId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

/**
 *  nscrum.Task: TaskCreatedEvent factory event
 */
Sslac.Class("nscrum.TaskCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,project_id,task_title,task_description) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskCreatedEvent");
     	}
     	else if(arguments.length == 4) {
	        this.Parent("nscrum.TaskCreatedEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            project_id :  project_id.uuid() /*unwrap uuid for serialization*/ ,
	            task_title :  task_title ,
	            task_description :  task_description 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 4 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.project_id === "undefined") {
	  		throw nscrum.MissingData("Field project_id is undefined");
	    }
	    if(typeof this.data.task_title === "undefined") {
	  		throw nscrum.MissingData("Field task_title is undefined");
	    }
	    if(typeof this.data.task_description === "undefined") {
	  		throw nscrum.MissingData("Field task_description is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("project_id", function () {
        return new nscrum.ProjectId(this.data.project_id); /*rewrap uuid*/
     })
     .Method("task_title", function () {
        return this.data.task_title; 
     })
     .Method("task_description", function () {
        return this.data.task_description; 
     })
     ;

/**
 * nscrum.Task: TaskCreatedEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskCreatedEvent", function(event) {
        this.assign_id(event.task_id());
        this.data.project_id = event.project_id();
      this.data.title = event.task_title();
      this.data.description = event.task_description();
      
     })
     ;

/**
 *  nscrum.Task: TaskAffectedToSprintEvent behavior event
 */
Sslac.Class("nscrum.TaskAffectedToSprintEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,sprint_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskAffectedToSprintEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.TaskAffectedToSprintEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            sprint_id :  sprint_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.sprint_id === "undefined") {
	  		throw nscrum.MissingData("Field sprint_id is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("sprint_id", function () {
        return new nscrum.SprintId(this.data.sprint_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.Task: TaskAffectedToSprintEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskAffectedToSprintEvent", function(event) {
        this.assign_id(event.task_id());
        
     })
     ;

/**
 *  nscrum.Task: TaskAttachedToStoryEvent behavior event
 */
Sslac.Class("nscrum.TaskAttachedToStoryEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,story_id) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskAttachedToStoryEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.TaskAttachedToStoryEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            story_id :  story_id.uuid() /*unwrap uuid for serialization*/ 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.story_id === "undefined") {
	  		throw nscrum.MissingData("Field story_id is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("story_id", function () {
        return new nscrum.StoryId(this.data.story_id); /*rewrap uuid*/
     })
     ;

/**
 * nscrum.Task: TaskAttachedToStoryEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskAttachedToStoryEvent", function(event) {
        this.assign_id(event.task_id());
        
     })
     ;

/**
 *  nscrum.Task: TaskStateChangedEvent behavior event
 */
Sslac.Class("nscrum.TaskStateChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,new_state) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskStateChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.TaskStateChangedEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            new_state :  new_state 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.new_state === "undefined") {
	  		throw nscrum.MissingData("Field new_state is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("new_state", function () {
        return this.data.new_state; 
     })
     ;

/**
 * nscrum.Task: TaskStateChangedEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskStateChangedEvent", function(event) {
        this.assign_id(event.task_id());
        
     })
     ;

/**
 *  nscrum.Task: TaskTitleChangedEvent behavior event
 */
Sslac.Class("nscrum.TaskTitleChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,title) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskTitleChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.TaskTitleChangedEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            title :  title 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.title === "undefined") {
	  		throw nscrum.MissingData("Field title is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("title", function () {
        return this.data.title; 
     })
     ;

/**
 * nscrum.Task: TaskTitleChangedEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskTitleChangedEvent", function(event) {
        this.assign_id(event.task_id());
        this.data.title = event.title();
      
     })
     ;

/**
 *  nscrum.Task: TaskDescriptionChangedEvent behavior event
 */
Sslac.Class("nscrum.TaskDescriptionChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (task_id,description) {
     	if(arguments.length == 0) {
     		// deserialization case, data is directly injected
     		this.Parent("nscrum.TaskDescriptionChangedEvent");
     	}
     	else if(arguments.length == 2) {
	        this.Parent("nscrum.TaskDescriptionChangedEvent", {
	            task_id :  task_id.uuid() /*unwrap uuid for serialization*/ ,
	            description :  description 
	        });
	    }
	    else {
	    	throw nscrum.InvalidNumberOfArguments("Expected: " + 2 + " got: " + arguments.length);
	    }
     })
     .Method("check_data", function() {
     	if(typeof this.data.task_id === "undefined") {
	  		throw nscrum.MissingData("Field task_id is undefined");
	    }
	    if(typeof this.data.description === "undefined") {
	  		throw nscrum.MissingData("Field description is undefined");
	    }
	    
     })
     
     .Method("task_id", function () {
        return new nscrum.TaskId(this.data.task_id); /*rewrap uuid*/
     })
     .Method("description", function () {
        return this.data.description; 
     })
     ;

/**
 * nscrum.Task: TaskDescriptionChangedEvent event handler
 */
Sslac.Function("nscrum.TaskHandler.nscrum_TaskDescriptionChangedEvent", function(event) {
        this.assign_id(event.task_id());
        this.data.description = event.description();
      
     })
     ;



/**
 * nscrum.Task: entity / aggregate root
 */
Sslac.Class("nscrum.Task")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Static("load_from_history", function(event_stream) {
        var task = new nscrum.Task ();
        task.load_from_history (event_stream);
        return task;
     })
     /**
      * Entity ns
      */
     .Method("entity_ns", function() { 
         return "nscrum.Task"; 
     })
     /**
      * Event handler ns (used to find event specific handler through reflection)
      */
     .Method("handler_ns", function() { 
         return "nscrum.TaskHandler"; 
     })
     /**
      * Field accessor method: project_id
      */
     .Method("project_id", function() {
         return this.data.project_id;
     })
     /**
      * Field accessor method: title
      */
     .Method("title", function() {
         return this.data.title;
     })
     /**
      * Field accessor method: description
      */
     .Method("description", function() {
         return this.data.description;
     })
     /**
      * Behavior method: affect_to_sprint
      */
     .Method("affect_to_sprint", function(sprint_id) {
        this.apply_event(new nscrum.TaskAffectedToSprintEvent(this.aggregate_id(), sprint_id));
     })
     /**
      * Behavior method: attach_to_story
      */
     .Method("attach_to_story", function(story_id) {
        this.apply_event(new nscrum.TaskAttachedToStoryEvent(this.aggregate_id(), story_id));
     })
     /**
      * Behavior method: change_state
      */
     .Method("change_state", function(new_state) {
        this.apply_event(new nscrum.TaskStateChangedEvent(this.aggregate_id(), new_state));
     })
     /**
      * Behavior method: change_title
      */
     .Method("change_title", function(title) {
        this.apply_event(new nscrum.TaskTitleChangedEvent(this.aggregate_id(), title));
     })
     /**
      * Behavior method: change_description
      */
     .Method("change_description", function(description) {
        this.apply_event(new nscrum.TaskDescriptionChangedEvent(this.aggregate_id(), description));
     })
     /**
      * Factory method
      */
     .Static("create", function(task_id, project_id, task_title, task_description) {
        var task = new nscrum.Task ();
    	task.apply_event(new nscrum.TaskCreatedEvent(task_id, project_id, task_title, task_description));
    	return task;
     })
     
     ;

/**
 * nscrum.TaskRepository
 */
Sslac.Class("nscrum.TaskRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store, notification_bus) {
        this.Parent("nscrum.Task", "nscrum.TaskId", event_store, notification_bus);
     })
     .Method("asDefault", function() {
        nscrum.Environment.nscrum_TaskRepository = this;
        return this;
     })
     .Static("getDefault", function() {
     	var instance = nscrum.Environment.nscrum_TaskRepository;
     	if(!instance) {
     		throw nscrum.NotBoundInEnvironment("nscrum.TaskRepository");
     	}
        return instance;
     })
     ;
