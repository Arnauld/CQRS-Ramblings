var Sslac  = require("sslac"),
    domain = require("./domain-gen");
var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["Sslac provides object namespace"] = function(test) {
	var event = new nscrum.ProjectNameChangedEvent(17, "Zog");
	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", 31);

//	console.log(">> event  :ns " + event.namespace());
//	console.log(">> proj_id:ns " + event.namespace());
//	console.log(">> project:ns " + event.namespace());

	test.done();
};

exports["Sslac can be used from an other file"] = function (test) {
	var event = new nscrum.ProjectNameChangedEvent(17, "Zog");
	test.ok(event instanceof nscrum.ProjectNameChangedEvent);
	test.equal(event.event_type(), "nscrum.ProjectNameChangedEvent");
	test.equal(event.project_id(), 17);
	test.equal(event.new_name(), "Zog");
    test.done();
};

exports["UUID gen"] = function (test) {
	var uuid_by_func = nscrum.new_uuid();
	test.equal(UUID_PATTERN.test(uuid_by_func), true);

	var project_id = new nscrum.ProjectId();
	var uuid_by_proj = project_id.uuid();
	test.equal(UUID_PATTERN.test(uuid_by_proj), true);

    test.done();
};

exports["Inheritance with methods"] = function (test) {
	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", 31);
	test.ok(project instanceof nscrum.Project);
	test.equal(project.name(), "Zog");

	project.change_name("Plouf");
	test.equal(project.uncommitted_events().length, 2);
	test.equal(project.name(), "Plouf");

	var uow = project.unit_of_work();
	test.equal(uow.uncommitted().length, 1);

	project.change_name("Plaf");
	test.equal(project.uncommitted_events().length, 3);
	test.equal(project.name(), "Plaf");

	uow = project.unit_of_work();
	test.equal(uow.uncommitted().length, 1);

    test.done();
};

exports["Project loaded from history"] = function (test) {
	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", 31);
	project.change_name("Plouf");
	project.change_name("Plaf");

	var uow      = project.unit_of_work();

	// make sure entity is in uncommitted list
	test.equal(uow.uncommitted().length, 1);

	// rebuild a stream from the uncommitted events
	var entities = uow.uncommitted();
	var events   = project.uncommitted_events();
	var stream   = nscrum.Stream.from_array(events);
	var reloaded = nscrum.Project.load_from_history(stream);
	test.equal(reloaded.name(), "Plaf");

	// make sure entity is not in uncommitted list
	var uow_reld = reloaded.unit_of_work();
	test.equal(uow_reld.uncommitted().length, 0);
    test.done();
};

exports["Project can be stored and loaded from repository"] = function (test) {
	var event_store = new nscrum.EventStore();
	var repository  = new nscrum.ProjectRepository(event_store);

	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", 31);
	project.change_name("Plouf");
	project.change_name("Plaf");

	console.log("----------------------------------------------------");

	repository.add(project);

	var reloaded = repository.get(proj_id);
	test.equal(reloaded.name(), "Plaf");
    test.done();
};