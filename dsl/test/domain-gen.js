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
        this.Parent("nscrum.UserCreatedEvent", {
            user_id : user_id,
            login : login,
            password : password
        });
     })
     
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.UserLoginChangedEvent", {
            user_id : user_id,
            new_login : new_login
        });
     })
     
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.UserActivatedEvent", {
            user_id : user_id
        });
     })
     
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.UserDeactivatedEvent", {
            user_id : user_id
        });
     })
     
     .Method("user_id", function () {
        return this.data.user_id;
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
     .Static("load_from_history", function(event_stream) {
        var user = new nscrum.User ();
        user.load_from_history (event_stream);
        return user;
     })
     ;

/**
 * nscrum.UserRepository
 */
Sslac.Class("nscrum.UserRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.User");
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
     .Constructor(function (project_id,project_name,owner) {
        this.Parent("nscrum.ProjectCreatedEvent", {
            project_id : project_id,
            project_name : project_name,
            owner : owner
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("project_name", function () {
        return this.data.project_name;
     })
     .Method("owner", function () {
        return this.data.owner;
     })
     ;

/**
 * nscrum.Project: ProjectCreatedEvent event handler
 */
Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectCreatedEvent", function(event) {
        this.assign_id(event.project_id());
        this.data.name = event.project_name();
      this.data.owner = event.owner();
      
     })
     ;

/**
 *  nscrum.Project: ProjectNameChangedEvent behavior event
 */
Sslac.Class("nscrum.ProjectNameChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id,new_name) {
        this.Parent("nscrum.ProjectNameChangedEvent", {
            project_id : project_id,
            new_name : new_name
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
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
        this.Parent("nscrum.ProjectMemberAddedEvent", {
            project_id : project_id,
            user_id : user_id,
            role : role
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.ProjectMemberRemovedEvent", {
            project_id : project_id,
            user_id : user_id,
            role : role
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.ProjectMemberFiredEvent", {
            project_id : project_id,
            firer : firer,
            user_id : user_id,
            role : role
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("firer", function () {
        return this.data.firer;
     })
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.ProjectMemberRoleChangedEvent", {
            project_id : project_id,
            user_id : user_id,
            role : role
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("user_id", function () {
        return this.data.user_id;
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
        this.Parent("nscrum.ProjectBacklogItemAddedEvent", {
            project_id : project_id,
            story_id : story_id
        });
     })
     
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("story_id", function () {
        return this.data.story_id;
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
      * Field accessor method: owner
      */
     .Method("owner", function() {
         return this.data.owner;
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
     .Static("create", function(project_id, project_name, owner) {
        var project = new nscrum.Project ();
    	project.apply_event(new nscrum.ProjectCreatedEvent(project_id, project_name, owner));
    	return project;
     })
     .Static("load_from_history", function(event_stream) {
        var project = new nscrum.Project ();
        project.load_from_history (event_stream);
        return project;
     })
     ;

/**
 * nscrum.ProjectRepository
 */
Sslac.Class("nscrum.ProjectRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Project");
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
        this.Parent("nscrum.StoryCreatedEvent", {
            story_id : story_id,
            project_id : project_id,
            story_title : story_title,
            story_description : story_description
        });
     })
     
     .Method("story_id", function () {
        return this.data.story_id;
     })
     .Method("project_id", function () {
        return this.data.project_id;
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
        this.Parent("nscrum.StoryComplexityChangedEvent", {
            story_id : story_id,
            complexity : complexity
        });
     })
     
     .Method("story_id", function () {
        return this.data.story_id;
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
        this.Parent("nscrum.StoryBusinessValueChangedEvent", {
            story_id : story_id,
            business_value : business_value
        });
     })
     
     .Method("story_id", function () {
        return this.data.story_id;
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
        this.Parent("nscrum.StoryTitleChangedEvent", {
            story_id : story_id,
            title : title
        });
     })
     
     .Method("story_id", function () {
        return this.data.story_id;
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
        this.Parent("nscrum.StoryDescriptionChangedEvent", {
            story_id : story_id,
            description : description
        });
     })
     
     .Method("story_id", function () {
        return this.data.story_id;
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
     .Static("load_from_history", function(event_stream) {
        var story = new nscrum.Story ();
        story.load_from_history (event_stream);
        return story;
     })
     ;

/**
 * nscrum.StoryRepository
 */
Sslac.Class("nscrum.StoryRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Story");
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
        this.Parent("nscrum.SprintCreatedEvent", {
            sprint_id : sprint_id,
            project_id : project_id,
            sprint_objectives : sprint_objectives
        });
     })
     
     .Method("sprint_id", function () {
        return this.data.sprint_id;
     })
     .Method("project_id", function () {
        return this.data.project_id;
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
        this.Parent("nscrum.SprintRangeDefinedEvent", {
            sprint_id : sprint_id,
            date_range : date_range
        });
     })
     
     .Method("sprint_id", function () {
        return this.data.sprint_id;
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
     .Static("load_from_history", function(event_stream) {
        var sprint = new nscrum.Sprint ();
        sprint.load_from_history (event_stream);
        return sprint;
     })
     ;

/**
 * nscrum.SprintRepository
 */
Sslac.Class("nscrum.SprintRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Sprint");
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
        this.Parent("nscrum.TaskCreatedEvent", {
            task_id : task_id,
            project_id : project_id,
            task_title : task_title,
            task_description : task_description
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
     })
     .Method("project_id", function () {
        return this.data.project_id;
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
        this.Parent("nscrum.TaskAffectedToSprintEvent", {
            task_id : task_id,
            sprint_id : sprint_id
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
     })
     .Method("sprint_id", function () {
        return this.data.sprint_id;
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
        this.Parent("nscrum.TaskAttachedToStoryEvent", {
            task_id : task_id,
            story_id : story_id
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
     })
     .Method("story_id", function () {
        return this.data.story_id;
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
        this.Parent("nscrum.TaskStateChangedEvent", {
            task_id : task_id,
            new_state : new_state
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
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
        this.Parent("nscrum.TaskTitleChangedEvent", {
            task_id : task_id,
            title : title
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
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
        this.Parent("nscrum.TaskDescriptionChangedEvent", {
            task_id : task_id,
            description : description
        });
     })
     
     .Method("task_id", function () {
        return this.data.task_id;
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
     .Static("load_from_history", function(event_stream) {
        var task = new nscrum.Task ();
        task.load_from_history (event_stream);
        return task;
     })
     ;

/**
 * nscrum.TaskRepository
 */
Sslac.Class("nscrum.TaskRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Task");
     })
     ;
