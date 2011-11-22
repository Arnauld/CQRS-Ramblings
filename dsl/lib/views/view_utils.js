var st = require('../prototype-lite'),
    extend = st.extend,
    Shared = require('../shared');

var view_of = exports.view_of = function(model, view) {
    view.model = model;
    return view;
};

var model_name = exports.model_name = function(model) {
    return model.name;
};

var model_variable_name = exports.model_variable_name = function(model) {
    return model.name.underscore();
};

var method_name = exports.method_name = function(def) {
    return def.name.underscore();
};

var field_name = exports.field_name = function(field) {
    return field.name.underscore();
};

var model_id_variable_name = exports.model_id_variable_name = function(model) {
    return model.name.underscore() + "_id";
};

var model_id_datatype = exports.model_id_datatype = function(model) {
    return model.name.dasherize().camelize() + "Id";    
};

var are_fields_matching = exports.are_fields_matching = function(model, field1, field2) {
    if(!field1){
        throw "Field1 not defined";
    }
    if(!field2) {
        throw "Field2 not defined";
    }
    var name_match = 
        ((field1.name===field2.name)
            // field1 first 
         || ("new_"+field1.name===field2.name) 
         || (model.name.underscore() + "_" + field1.name === field2.name)
            // field2 first
         || ("new_"+field2.name===field1.name) 
         || (model.name.underscore() + "_" + field2.name === field1.name)
        );
    
    var datatype_match = (field1.datatype === field2.datatype);
    console.log("Matching: <" + field1.name + "> with <" + field2.name + "> name_match? " + name_match + ", datatype_match? " + datatype_match + ", type1: " + field1.datatype + ", type2: " + field2.datatype);

    return name_match && datatype_match;
};


var add_iteration_flags = exports.add_iteration_flags = function(array, suffix) {
    if(array.length>0) {
        var first_key = "first_"+suffix;
        var last_key  = "last_"+suffix;
        array.forEach(function(item) {
            item[first_key] = false;
            item[last_key]  = false;
        });
        array[0][first_key] = true;
        array[array.length-1][last_key] = true;
    }
    return array;
};