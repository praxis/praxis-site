angular.module('DocBrowser', ['PraxisDocBrowser']);
angular.module('DocBrowser', ['PraxisDocBrowser'])
.config(function(templateForProvider) {
  templateForProvider.title           = "API Browser - ProductPlan"; // this is only used for the <title> tag now (although it can still be used with {{:: title}})
  templateForProvider.versionLabel    = "Version";
  templateForProvider.expandChildren  = true; // this is not working... TODO-bhcastle: ask praxis help in slack
  // this is a dependency injected function
  templateForProvider.register(function($type, $requestedTemplate) {
    if ($type === 'Extensions::Types::PaginationParams') {
      if ($requestedTemplate === 'main') {
        return 'views/types/main/pagination_params.html';
      } else if ($requestedTemplate === 'embedded') {
        return 'views/types/embedded/pagination_params.html';
      }
    } else if ($type === 'Extensions::Types::OrderingParams') {
      if ($requestedTemplate === 'embedded') {
        return 'views/types/embedded/ordering_params.html';
      }
    } else if ($type === 'Extensions::Types::FilteringParams') {
      if ($requestedTemplate === 'embedded') {
        return 'views/types/embedded/filtering_params.html';
      }
    } else {
      return undefined;
    }
  });
}).config(function($stateProvider) {
  $stateProvider
    .state('root.pagination_params', {
      url: '/concepts/pagination_params',
      templateUrl: 'views/concepts/pagination_params.html'
    })
    .state('root.ordering_params', {
      url: '/concepts/ordering_params',
      templateUrl: 'views/concepts/ordering_params.html'
    })
    .state('root.filtering_params', {
      url: '/concepts/filtering_params',
      templateUrl: 'views/concepts/filtering_params.html'
    })
}).config(function(ExamplesProvider) {

  function basicCode(action, info) {
    var code = 'var request = new XMLHttpRequest();\n\n';
    if (!info.endpoint) {
      //throw 'Endpoint not defined in schema';
    }
    code += 'request.open(\'' + action.urls[0].verb +'\', \'' + info.endpoint + action.urls[0].example + '\');\n\n';

    code += _.map(action.headers.type.attributes, function(value, key) {
      return 'request.setRequestHeader(\''+ key + '\', \''+ value.example + '\');'
    }).join('\n')

    code += '\nrequest.setRequestHeader(\'Content-Type\', \'' + _.get(action, 'payload.examples.json.content_type', 'text/json') + '\');\n\n';

    code += '\nrequest.onreadystatechange = function () {\n' +
            '  if (this.readyState === 4) {\n' +
            '    console.log(\'Status:\', this.status);\n' +
            '    console.log(\'Headers:\', this.getAllResponseHeaders());\n' +
            '    console.log(\'Body:\', this.responseText);\n' +
            '  }\n' +
            '};\n\n';

    if (action.payload) {
      code += 'var body = ' + action.payload.examples.json.body + ';\n\n';
      code += 'request.send(JSON.stringify(body));';
    } else {
      code += 'request.send();';
    }
    return code;
  }

  function angularCode(resource, action, info) {
    if (!info.endpoint) {
      //throw 'Endpoint not defined in schema';
    }
    var code = '// Define Client:\n';
    code += 'angular.module(\'Models\').service(\'' + resource.display_name + '\', [\'$http\', function($http) {\n';
    code += '  this.' + _.camelCase(action.name) + ' = function(data) {\n';
    // _.each(_.get(action, 'params.type.attributes'), function(opts, val) {
    //   if (opts.source === 'url') {
    //     code += '    var ' + _.camelCase(val) + ' = data.' + _.camelCase(val) + ';\n';
    //   }
    // });
    code += '    return $http({\n';
    code += '      method: \'' + action.urls[0].verb + '\',\n';
    code += '      url: \'' + info.endpoint + (action.urls[0].path.replace(/:([\w_]+)/g, function(m, variable) {
      return '\' + data.' + _.camelCase(variable) + ' + \'';
    }) + '\'').replace(/ \+ ''$/, '') + ',\n';
    var params = _.get(action, 'params.type.attributes', {});
    if (_.some(params, {source: 'query'})) {
      code += '      params: {\n';
      _.each(params, function(opts, name) {
        if (opts.source === 'query') {
          code += '        ' + name + ': data.' + _.camelCase(name) + ',\n';
        }
      });
      code += '      },\n'
    }
    var headers = _.get(action, 'headers.type.attributes', {});
    if (_.keys(headers).length > 0) {
      code += '      headers: {\n';
      _.each(headers, function(opts, name) {
        if (opts.values && opts.values.length === 1) {
          code += '        ' + _.snakeCase(name) + ': \'' + opts.values[0] + '\',\n';
        } else {
          code += '        ' + _.snakeCase(name) + ': data.' + _.camelCase(name) + ',\n';
        }
      });
      code += '      },\n';
    }
    var payload = _.get(action, 'payload.type.attributes', {});
    if (_.keys(payload).length > 0) {
      code += '      data: {\n';
      _.each(payload, function(opts, name) {
        if (opts.values && opts.values.length === 1) {
          code += '        ' + name + ': \'' + opts.values[0] + '\',\n';
        } else {
          code += '        ' + name + ': data.' + _.camelCase(name) + ',\n';
        }
      });
      code += '      },\n'
    }
    code += '    });\n';
    code += '  };\n'
    code += '}]);\n\n';
    code += '// Example Usage:\n';
    code += 'angular.module(\'Controllers\').controller(\'' + resource.display_name + 'Controller\', [\'' + resource.display_name + '\', \'$scope\', function(' + resource.display_name + ', $scope) {\n';
    code += '  ' + resource.display_name + '.' + _.camelCase(action.name) + '({\n';
    _.each(params, function(opts, name) {
      code += '    ' + name + ': ' + JSON.stringify(opts.example, null, 2) +',\n';
    });
    _.each(headers, function(opts, name) {
      if (opts.example && (!opts.values || opts.values.length != 1)) {
        code += '    ' + _.snakeCase(name) + ': ' + JSON.stringify(opts.example, null, 2) +',\n';
      }
    });
    _.each(payload, function(opts, name) {
      if (opts.example && (!opts.values || opts.values.length != 1)) {
        code += '    ' + name + ': ' + JSON.stringify(opts.example, null, 2) +',\n';
      }
    });
    code += '  }).then(function(result) {\n';
    code += '    $scope.result = result.data;\n'
    code += '  });\n';
    code += '}]);\n';
    return code;
  }

  ExamplesProvider.register('browser-javascript', 'JavaScript', function($compile, $context, Documentation) {
    "ngInject";
    return Documentation.info($context.version).then(function(info) {
      var template = '<h3>Plain JavaScript</h3>\n<pre highlight="javascript">' + basicCode($context.action, info) + '</pre>\n\n';

      template += '<h3>Angular</h3>\n<pre highlight="javascript">' + angularCode($context.resource, $context.action, info) + '</pre>\n\n';


      return $compile(template);
    });
  });
});
