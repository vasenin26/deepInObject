function FormParamsObject(statement) {

    if (!this.__isObject(statement)) {
        throw new Error('FormParamsObject invalid constructor property. Statement must be object');
    }

    this.statement = statement;
}

FormParamsObject.prototype.getFullObject = function () {
    return this.statement;
}

FormParamsObject.prototype.convertObjectToArray = function (propPath) {
    
    var result = [];
    var source = this.getObjectProperty(propPath);

    if (!this.__isObject(source)) {
        throw new Error('Target path contains no object')
    }

    var keys = Object.keys(source);
    var index = 0;
    var part;

    while (true) {
        part = {}

        keys.forEach(function (key) {
            if (Array.isArray(source[key]) && typeof source[key][index] !== 'undefined') {
                part[key] = source[key][index];
            }
        })

        if (Object.keys(part).length === 0) {
            break;
        }

        result.push(part);

        index++;
    }

    return result;
}

FormParamsObject.prototype.getObjectProperty = function (propPath) {

    var paths = propPath.split('.');
    var current = this.statement;

    for (var i = 0; i < paths.length; ++i) {
        if (typeof current[paths[i]] === 'undefined') {
            return null;
        } else {
            current = current[paths[i]];
            if (current === null) {
                return null;
            }
        }
    }

    return current;
}

FormParamsObject.prototype.setObjectProperty = function (propPath, value, overrideParts) {

    var parts = propPath.split('.');
    var current = this.statement;
    var key = parts[0];
    var index = 0;
    var link;

    while (++index < parts.length) {

        if (!this.__isObject(current[key])) {
            if (overrideParts || typeof current[key] === 'undefined') {
                current[key] = {};
            } else {
                throw new Error('Path contains non object part');
            }
        }

        current = current[key];
        key = parts[index];
    }

    current[key] = value;
}

FormParamsObject.prototype.__isObject = function (value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}