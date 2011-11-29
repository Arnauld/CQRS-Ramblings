var Sslac  = require("sslac"),
    domain = require("./domain-gen");
var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["Sslac provides object namespace"] = function(test) {
	var proj_id = new nscrum.ProjectId();
	var event = new nscrum.ProjectNameChangedEvent(proj_id, "Zog");
	var owner = new nscrum.UserId();
	var project = nscrum.Project.create(proj_id, "Zog", owner);

//	console.log(">> event  :ns " + event.namespace());
//	console.log(">> proj_id:ns " + event.namespace());
//	console.log(">> project:ns " + event.namespace());

	test.done();
};

exports["Sslac can be used from an other file"] = function (test) {
	var proj_id = new nscrum.ProjectId("17");
	var event = new nscrum.ProjectNameChangedEvent(proj_id, "Zog");
	test.ok(event instanceof nscrum.ProjectNameChangedEvent);
	test.equal(event.event_type(), "nscrum.ProjectNameChangedEvent");
	test.equal(event.project_id().uuid(), "17");
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
	var owner = new nscrum.UserId();
	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", owner);
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
	var owner = new nscrum.UserId();
	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", owner);
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
	var owner = new nscrum.UserId();
	var event_store = new nscrum.EventStore();
	var repository  = new nscrum.ProjectRepository(event_store);

	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", owner);
	project.change_name("Plouf");
	project.change_name("Plaf");

	repository.add(project);

	var reloaded = repository.get(proj_id);
	test.equal(reloaded.name(), "Plaf");
    test.done();
};

var toString = function(data, indent) {
	return JSON.stringify(data, null, indent||"    ");
}

var add_redirect_listener = function(notif_bus, output, entity_ns) {
	notif_bus.add_listener(entity_ns, function(data) { output(entity_ns, data); });
};

exports["Project simple story"] = function(test) {
	var notif_bus    = new nscrum.Bus().asNotificationBus();
	
	var callNb = 0;
	var output = function(event_key, event) {
		callNb++;
		console.log(callNb + "::" + event_key + ":: " + toString(event.data));
		
		if(callNb === 8) {
			test.done();
			notif_bus.dispose();
		}
	};
	add_redirect_listener(notif_bus, output, "nscrum.User");
	add_redirect_listener(notif_bus, output, "nscrum.Project");
	add_redirect_listener(notif_bus, output, "nscrum.Story");
	add_redirect_listener(notif_bus, output, "nscrum.Task");
	add_redirect_listener(notif_bus, output, "nscrum.Sprint");

	var event_store  = new nscrum.EventStore().asDefault();
	var project_repo = new nscrum.ProjectRepository(event_store).asDefault();
	var user_repo    = new nscrum.UserRepository(event_store).asDefault();
	var story_repo   = new nscrum.StoryRepository(event_store).asDefault();
	var task_repo    = new nscrum.TaskRepository(event_store).asDefault();
	var sprint_repo  = new nscrum.SprintRepository(event_store).asDefault();

	var user_id = new nscrum.UserId();
	var user = nscrum.User.create(user_id, "Travis", "Topkapi");
	user.activate();
	user_repo.add(user);

	var proj_id = new nscrum.ProjectId();
	var project = nscrum.Project.create(proj_id, "Zog", user_id);
	project_repo.add(project);

	var story_id = new nscrum.StoryId();
	var story    = nscrum.Story.create(story_id, proj_id, "As an admin.", "...");
	story.change_complexity(7);
	story.change_business_value(145);
	story_repo.add(story);

	var task_id  = new nscrum.TaskId();
	var task     = nscrum.Task.create(task_id, proj_id, "Move nexus to asimov", "One must move nexus to asimov for better performance");
	task.attach_to_story(story_id);
	task_repo.add(task);

	console.log("Task attached to story: " + task);

}