/*global ionic*/

// for example usage, see http://codepen.io/premiumfrye/pen/pJMOZe
angular.module('pf-mobilePolyform', [])
  .directive('mobilePolyform', function ($timeout, $parse) {
    // keep track of our input fields for jumping to the next
    var inputs = [],
    // any other methods declared in template for ng-keydown that we'll want called 
      keydownFns = [],
      focusInput = function (n) {
        $timeout(function () {
        // move cursor to next input field
          if (inputs[n]) { inputs[n][0].focus(); }
        }, 0, false);
      };

    return {
      compile: function (tElement) {
        var formElements = tElement[0].elements;
        Object.keys(formElements).forEach(function (eNum) {
          if (formElements[eNum].nodeName === 'INPUT' || formElements[eNum].nodeName === 'SELECT') {
            var thisInput = angular.element(formElements[eNum]);
            // if an input field doesn't already has a ng-keydown directive, add it and call 'nextInput' 
            if (!thisInput.attr('ng-keydown')) { inputs.push(thisInput.attr('ng-keydown', 'nextInput($event,' + inputs.length + ');')); }
            // if ng-keydown registers some other events, save them to call them back later
            if (thisInput.attr('ng-keydown').indexOf('nextInput') === -1) {
              keydownFns[inputs.length] = $parse(thisInput.attr('ng-keydown'));
              inputs.push(thisInput.attr('ng-keydown', 'nextInput($event,' + inputs.length + ');'));
            }
            if (formElements[eNum].nodeName === 'SELECT') {
              thisInput = thisInput[0];
              thisInput.onchange = function () {
              // ng-model doesn't always update (browser discrepancies) and selected option doesn't always show as selected with certain browsers - throw a shim in there.
                thisInput.blur();
                if (ionic.Platform.isAndroid()) {
                  focusInput(parseInt(eNum, 10) + 1);
                }
              };
              // make android act like iOS - when user hits 'return' and focuses on a select field, emulate a mouse click and open up options
              if (ionic.Platform.isAndroid()) {
                thisInput.onfocus = function () {
                  if (document.createEvent) {
                    var e = document.createEvent("MouseEvents");
                    e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    thisInput.dispatchEvent(e);
                  } else if (thisInput.fireEvent) {
                    thisInput.fireEvent("onmousedown");
                  }
                };
              }
            }
          }
        });
        return {

          post: function (scope) {
            scope.nextInput = function (e, num) {
              // apply any functions user had attached to ng-keydown on input
              if (keydownFns[num]) { keydownFns[num](scope, {$event: e}); }
              // event trigers $digest, but focus event wants to trigger $digest too: wrap in a $timeout and tell angular not to $digest (false option)
              if (ionic.Platform.isAndroid()) {
                if (e.keyCode === 13) {
                  // only submit the form when user it's return/ok on last input
                  if (inputs.length !== num + 1) { e.preventDefault(); }
                  focusInput(num + 1);
                }
              }
            };
          }
        };
      }
    };
  });