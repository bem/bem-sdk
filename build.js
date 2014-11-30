var transpiler = require('es6-module-transpiler'),
    Container = transpiler.Container,
    FileResolver = transpiler.FileResolver,
    DistFormatter = require('es6-module-transpiler-dist-formatter'),
    container = new Container({
        resolvers: [new FileResolver(['lib/'])],
        formatter: new DistFormatter({ name: 'bem-decl', varname: 'bemdecl' })
    });

container.getModule('index');
container.write('dist/bem-decl.dev.js');
