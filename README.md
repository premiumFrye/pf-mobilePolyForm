# pf-mobilePolyForm

An angjular.js directive for making Android behave a bit more like iOS when filling out forms using the ionic framework. 

Just include js script, inject the module, and add the attribute directive to your form. When a user hits 'Ok'/Return on an input field, or clicks an option on a select input on Android (iOS unaffected) will automatically advance the cursor to the next input field, or open the select option. If an input is the last field on the form, 'Ok'/Return will submit the form (pending $valid). Also fixes an angular defect that prevents ng-model from updating on a select form on all platforms.

(if testing in Chrome, turn on mobile emulation, and make sure an Android device is selected for correct UA string sniffing)
