# grunt-moduledoc

> Creates a frontend module documentation

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-moduledoc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-moduledoc');
```

## Documenting modules

Create a YAML file for each module.

A module must have:

* A `title`: Legal characters are capital letters and underscores.
* A `dom`: The HTML node type

File `header.yml`:

```yaml
title: HEADER
dom: header
```

defines:

```markup
<header> ... </header>
```

### Class

Typically a module will have a _unique CSS class_. We use the `ui-` prefix to denote ui modules, but that is optional.

```yaml
title: HEADER
dom: header
class: ui-header
```

defines:

```markup
<header class="ui-header"> ... </header>
```

### Type

A module can also optionally belong to a _type_. We use the `type-` prefix to denote a type. This allows us have a generic class across a number of modules.

```yaml
title: HEADER
dom: header
type: type-header
class: ui-header
```

defines:

```markup
<header class="type-header ui-header"> ... </header>
```

### Description

You can add a one line description to the module.

```yaml
title: HEADER
description: The main site header.
dom: header
type: type-header
class: ui-header
```

### Options

You can add one or more _option classes_ to a module. An option class should in some way _alter the display of the module_. We use the `opt-` prefix to denote an option.

```yaml
title: HEADER
description: The main site header.
dom: header
type: type-header
class: ui-header
options:
  - class: opt-dark
    description: Displays the header with a dark background and white text.
  - class: opt-minimal
    description: Displays a minimal header.
```

### Contains

Most importantly, modules can contain other modules. Add them to the `contains` list. They will be linked in the documentation.

```yaml
title: HEADER
description: The main site header.
dom: header
type: type-header
class: ui-header
options:
  - class: opt-dark
    description: Displays the header with a dark background and white text.
  - class: opt-minimal
    description: Displays a minimal header.
contains:
  - LOGO
  - NAV_MAIN
```

You will of course have to create module YAML files for each contained module, which can also contain modules.

#### Optional and multiple contains

You can add a suffix to a contained module to denote how often it can be contained.

```yaml
contains:
  - REQUIRED
  - OPTIONAL ?
  - MULTIPLE +
  - OPTIONAL_MULTIPLE *
```

Modules without a suffix are considered _required_.
Modules with `?` are considered _optional_.
Modules with `+` are considered _multiple_ (i.e. one or more occurances).
Modules with `*` are considered both _optional and multiple_ (i.e. zero, one or more occurances).

### Inner DOM wrappers

A module might often contain an _inner wrapper_ that in turn contains the contained modules.

You can document this by adding it to the `dom` setting.

```yaml
dom: div>div.wrapper
class: ui-block
```

defines:

```markup
<div class="ui-block">
  <div class="wrapper">
    <!-- modules go here -->
  </div>
</div>
```

You can also define the wrapper as its own module, e.g. `WRAPPER`, and then use that:

```yaml
name: WRAPPER
dom: div
class: ui-wrapper
```

```yaml
name: BLOCK
dom: div>WRAPPER
class: ui-block
```

defines:

```markup
<div class="ui-block">
  <div class="ui-wrapper">
    <!-- modules go here -->
  </div>
</div>
```

## The "moduledoc" task

### Overview
In your project's Gruntfile, add a section named `moduledoc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  moduledoc: {
    my_target: {
      options: {
        // Task-specific options go here.
      },
      files: {
        // Target-specific file lists and/or options go here.
      }
    }
  },
});
```

### Options

#### options.templatepath
Type: `String`
Default value: `templates/module.mustache`

Path to the module template.

#### options.assetspath
Type: `String`
Default value: `templates/assets`

Path to the assets directory.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  moduledoc: {
    dist: {
      options: {},
      files: {
        'dest/docs': ['src/docs'],
      },
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Tests

```bash
grunt test
```
