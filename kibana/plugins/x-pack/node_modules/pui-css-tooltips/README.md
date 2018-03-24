# pui-css-tooltips

A CSS tooltips component that can be installed via this npm package.
This package provides all of the CSS you need to use the component.



## Installation

To install the package from the command line:

```
npm install pui-css-tooltips
```

## Usage

Note: this requires the Bootstrap JavaScript.

```html
<p>
  Check out this
  <a id="link-with-tooltip-1" href="#" data-toggle="tooltip" data-placement="left" title="I should be on the left">
    tooltip on the left!
  </a>
</p>

<p>
  Check out this
  <a id="link-with-tooltip-2" href="#" data-toggle="tooltip" data-placement="right" title="I should be on the right">
    tooltip on the right!
  </a>
</p>

<p>
  <button id="button-with-tooltip-1" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="I should be on the top">
    Check out this tooltip on the top!
  </button>
</p>

<p>
  <button id="button-with-tooltip-2" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="I should be on the bottom">
    Check out this tooltip on the bottom!
  </button>
</p>
```


You can find more examples of the tooltips component in the [pui style guide](http://styleguide.pivotal.io/)


*****************************************

This is a component of Pivotal UI, a collection of [React](https://facebook.github.io/react/) and CSS components for rapidly building and prototyping UIs.

[Styleguide](http://styleguide.pivotal.io)
[Github](https://github.com/pivotal-cf/pivotal-ui)
[npm](https://www.npmjs.com/browse/keyword/pivotal%20ui%20modularized)

(c) Copyright 2017 Pivotal Software, Inc. All Rights Reserved.
