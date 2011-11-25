var Sslac = require("sslac"),
    gen_uuid = require("node-uuid");

Sslac.Function("nscrum.new_uuid", function() {
        return gen_uuid();
     })
     ;

Sslac.Function("nscrum.AbstractMethod", function(message) {
   return new Error("AbstractMethod: " + message); 
});


Sslac.Class("nscrum.Stream")
     .Method("read", function(callback) {
        throw nscrum.AbstractMethod("nscrum.Stream#read");
     })
     .Method("write", function(event) {
        throw nscrum.AbstractMethod("nscrum.Stream#write");
     })
     .Static("from_array", function(array) {
         return new nscrum.ArrayStream(array);
     })
     ;

Sslac.Class("nscrum.ArrayStream")
     .Extends("nscrum.Stream")
     .Constructor(function (array) {
        this.array = array || [];
     })
     .Method("read", function(callback) {
        var array = this.array;
        var i;
        for(i=0;i<array.length;i++) {
            callback(array[i]);
        }
     })
     .Method("write", function(event) {
        this.array.push(event);
     })
     ;


Sslac.Class("nscrum.Id")
     .Constructor(function (uuid) {
        this._uuid = (uuid || nscrum.new_uuid());
     })
     .Method("uuid", function() { 
        return this._uuid;
     })
     ;

Sslac.Class("nscrum.UnitOfWork")
     .Constructor(function () {
        this._uncommitted = new function() {};
     })
     .Method("add_uncommitted", function(aggregate) {
         this._uncommitted[aggregate.data._id.uuid()] = aggregate;
     })
     .Method("uncommitted", function() {
        var source = this._uncommitted;
        var key;
        var aggregates = [];
        for(key in source) {
            if(source.hasOwnProperty(key)) {
                aggregates.push(source[key]);
            }
        }
        return aggregates;
     })
     ;

Sslac.Function("nscrum.InvalidEventSequence", function(message) {
   return new Error("InvalidEventSequence: " + message); 
});

Sslac.Function("nscrum.UnsupportedEventType", function(message) {
   return new Error("UnsupportedEventType: " + message); 
});

Sslac.Function("nscrum.InvalidEventOwner", function(message) {
   return new Error("InvalidEventOwner: " + message); 
});

Sslac.Function("nscrum.ProjectAlreadyCreated", function(message) {
   return new Error("ProjectAlreadyCreated: " + message); 
});

Sslac.Class("nscrum.AggregateRoot")
     .Constructor(function (data) {
        this.data = data || {};
        this.data._version = 0;
     })
     .Method("uuid", function() {
         return this.data._id.uuid();
     })
     .Method("aggregate_id", function() {
         return this.data._id;
     })
     .Method("has_id", function() {
         return (typeof this.data._id !== "undefined");
     })
     .Method("version", function() {
         return this.data._version;
     })
     .Method("apply_event", function (event,is_new) {
        var is_new_event;
        if(typeof is_new === "undefined") {
            is_new_event = true;
        }
        else {
            is_new_event = is_new;
        }

        if(!is_new_event) {
            if(this.data._version !== event.data.aggregate_version) {
                throw nscrum.InvalidEventSequence("Expected: " + this.data._version + " got: " + event.data.aggregate_version);
            }
            this.data._version = (event.data.aggregate_version + 1);
        }

        var handler = this.find_handler(event);
        handler.call(this, event);

        if(is_new_event) {
            this.add_uncommitted(event);            
        }
     })
     .Method("find_handler", function(event) {
        var event_type = event.event_type().replace(/\./g, '_');
        var handler = this.handler_ns()[event_type];
        if(handler) {
            return handler;
        }
        else {
            throw nscrum.UnsupportedEventType(event_type);
        }
     })
     .Method("unit_of_work", function() {
        if(typeof this._uow === "undefined") {
            //console.log("No Unit of work bound on aggregate " + this._uuid);
            var uow = new nscrum.UnitOfWork();
            this._uow = uow;
        } 
        return this._uow;
     })
     .Method("drain_uncommitted_events", function(event_callback) {
         this.uncommitted = this.uncommitted.filter(function(event) {
            event_callback(event);
            return false; 
         });
     })
     .Method("uncommitted_events", function() {
         // return a copy
         return this.uncommitted.map(function(event) { return event;});
     })
     .Method("add_uncommitted", function(event) {
        event.claimed_by(this.data._id, this.data._version);
        this.uncommitted = this.uncommitted || [];
        this.uncommitted.push(event);
        // add the entity to the current unit of work
        this.unit_of_work().add_uncommitted(this);
        this.data._version = this.data._version + 1;
     })
     .Method("load_from_history", function(event_stream) {
        var self = this;
        event_stream.read(function(event) {
            self.apply_event(event, false);
        });
     })
     ;

Sslac.Class("nscrum.Event")
     .Constructor(function (event_type, data) {
        this.data = data || {};
        this.data.event_type = event_type;
     })
     .Method("event_type", function (event) {
        return this.data.event_type;
     })
     .Method("claimed_by", function (aggregate_id, aggregate_version) {
        this.data.aggregate_id = aggregate_id;
        this.data.aggregate_version = aggregate_version;
     })
     .Static("from_data", function(data) {
         var event_type = data.event_type;
         var klazz = Sslac.valueOf(event_type);
         var instance = new klazz();
         instance.data = data;
         return instance;
     })
     ;

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
            throw nscrum.ProjectAlreadyCreated("Project already in created state with id <" + this.uuid() + ">");
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
         return nscrum.ProjectHandler; 
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

Sslac.Class("nscrum.EventStream")
     .Extends("nscrum.Stream")
     .Constructor(function (array) {
        this.array = array;
     })
     .Method("read", function(callback) {
        var array = this.array;
        var i;
        for(i=0;i<array.length;i++) {
            var event_data = array[i];
            var event = nscrum.Event.from_data(event_data);
            callback(event);
        }
     })
     .Method("write", function(event) {
        this.array.push(event.data);
     })
     ;

Sslac.Class("nscrum.EventStore")
     .Constructor(function () {
        this.data = {};
     })
     .Method("open_stream", function (stream_id) {
        var uuid = stream_id.uuid();
        //console.log("Opening stream <" + uuid + ">");
        if(!this.data[uuid]) {
            this.data[uuid] = [];
        }
        var data = this.data[uuid];
        return new nscrum.EventStream(data);
     })
     ;

Sslac.Class("nscrum.Repository")
     .Constructor(function (event_store, entity_ns) {
        this.event_store = event_store;
        this.entity_ns   = entity_ns;
     })
     .Method("get", function(aggregate_id) {
        var stream = this.event_store.open_stream(aggregate_id);
        return Sslac.valueOf(this.entity_ns).load_from_history(stream);
     })
     .Method("store", function(aggregate) {
        var stream = this.event_store.open_stream(aggregate.data._id);
        aggregate.drain_uncommitted_events(function(event) {
           stream.write(event); 
        });
     })
     ;

Sslac.Class("nscrum.ProjectRepository")
     .Extends("nscrum.Repository")
     .Constructor(function (event_store) {
        this.Parent(event_store, "nscrum.Project");
     })
     ;







