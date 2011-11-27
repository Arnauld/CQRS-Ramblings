var Sslac = require("sslac"),
        F = require("./framework");

Sslac.Class("nscrum.UserId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

Sslac.Class("nscrum.ProjectId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;

Sslac.Class("nscrum.ProjectNameChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id, new_name) {
        this.Parent("nscrum.ProjectNameChangedEvent", {
            project_id : project_id,
            new_name   : new_name
        });
     })
     .Method("new_name", function () {
        return this.data.new_name;
     })
     .Method("project_id", function () {
        return this.data.project_id;
     })
     ;

Sslac.Class("nscrum.ProjectCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (project_id, project_name, owner_id) {
        this.Parent("nscrum.ProjectCreatedEvent", {
            project_id   : project_id,
            project_name : project_name,
            owner_id     : owner_id
        });
     })
     .Method("project_id", function () {
        return this.data.project_id;
     })
     .Method("project_name", function () {
        return this.data.project_name;
     })
     .Method("owner_id", function () {
        return this.data.owner_id;
     })
     ;

Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectNameChangedEvent", function(event) {
        var project_id = this.uuid();
        var event_p_id = event.project_id().uuid();
        if(project_id !== event_p_id) {
            throw nscrum.InvalidEventOwner("Expected: " + project_id + " got: " + event_p_id);
        }
        this.data.name = event.new_name();
     })
     ;

Sslac.Function("nscrum.ProjectHandler.nscrum_ProjectCreatedEvent", function(event) {
        if(this.has_id()) {
            throw nscrum.IdAlreadyAssigned("Project already in created state with id <" + this.uuid() + ">");
        }
        this.data._id      = event.project_id();
        this.data.name     = event.project_name();
        this.data.owner_id = event.owner_id();
     })
     ;

Sslac.Class("nscrum.Project")
     .Extends("nscrum.AggregateRoot")
     .Constructor(function Constructor() {
        this.Parent();
     })
     .Method("handler_ns", function() { 
         return "nscrum.ProjectHandler"; 
     })
     .Method("name", function () {
        return this.data.name;
     })
     .Method("change_name", function change_name(new_name) {
        this.apply_event(new nscrum.ProjectNameChangedEvent(this.aggregate_id(), new_name));
     })
     .Static("create", function(project_id, project_name, owner_id/*UserId*/) {
        var project = new nscrum.Project();
        project.apply_event (new nscrum.ProjectCreatedEvent(project_id, project_name, owner_id));
        return project;
     })
     .Static("load_from_history", function(event_stream) {
        var project = new nscrum.Project();
        project.load_from_history (event_stream);
        return project;
     })
     ;

Sslac.Class("nscrum.ProjectRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Project");
     })
     ;







