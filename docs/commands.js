/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/commands/commands.ts":
/*!**********************************!*\
  !*** ./src/commands/commands.ts ***!
  \**********************************/
/***/ (function() {

eval("{/*\r\n * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.\r\n * See LICENSE in the project root for license information.\r\n */\n\n/* global Office */\nOffice.onReady(() => {\n  // If needed, Office.js is ready to be called.\n});\n/**\r\n * Shows a notification when the add-in command is executed.\r\n * @param event\r\n */\nfunction action(event) {\n  const message = {\n    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,\n    message: \"Performed action.\",\n    icon: \"Icon.80x80\",\n    persistent: true\n  };\n  // Show a notification message.\n  Office.context.mailbox.item.notificationMessages.replaceAsync(\"ActionPerformanceNotification\", message);\n\n  // Be sure to indicate when the add-in command function is complete.\n  event.completed();\n}\n\n// Register the function with Office.\nOffice.actions.associate(\"action\", action);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbWFuZHMvY29tbWFuZHMudHMiLCJuYW1lcyI6WyJPZmZpY2UiLCJvblJlYWR5IiwiYWN0aW9uIiwiZXZlbnQiLCJtZXNzYWdlIiwidHlwZSIsIk1haWxib3hFbnVtcyIsIkl0ZW1Ob3RpZmljYXRpb25NZXNzYWdlVHlwZSIsIkluZm9ybWF0aW9uYWxNZXNzYWdlIiwiaWNvbiIsInBlcnNpc3RlbnQiLCJjb250ZXh0IiwibWFpbGJveCIsIml0ZW0iLCJub3RpZmljYXRpb25NZXNzYWdlcyIsInJlcGxhY2VBc3luYyIsImNvbXBsZXRlZCIsImFjdGlvbnMiLCJhc3NvY2lhdGUiXSwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2VicGFjazovL3NoZWV0b3MtYWkvLi9zcmMvY29tbWFuZHMvY29tbWFuZHMudHM/Mzc0YyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4gKiBTZWUgTElDRU5TRSBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG4gKi9cclxuXHJcbi8qIGdsb2JhbCBPZmZpY2UgKi9cclxuT2ZmaWNlLm9uUmVhZHkoKCkgPT4ge1xyXG4gIC8vIElmIG5lZWRlZCwgT2ZmaWNlLmpzIGlzIHJlYWR5IHRvIGJlIGNhbGxlZC5cclxufSk7XHJcbi8qKlxyXG4gKiBTaG93cyBhIG5vdGlmaWNhdGlvbiB3aGVuIHRoZSBhZGQtaW4gY29tbWFuZCBpcyBleGVjdXRlZC5cclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBhY3Rpb24oZXZlbnQ6IE9mZmljZS5BZGRpbkNvbW1hbmRzLkV2ZW50KSB7XHJcbiAgY29uc3QgbWVzc2FnZTogT2ZmaWNlLk5vdGlmaWNhdGlvbk1lc3NhZ2VEZXRhaWxzID0ge1xyXG4gICAgdHlwZTogT2ZmaWNlLk1haWxib3hFbnVtcy5JdGVtTm90aWZpY2F0aW9uTWVzc2FnZVR5cGUuSW5mb3JtYXRpb25hbE1lc3NhZ2UsXHJcbiAgICBtZXNzYWdlOiBcIlBlcmZvcm1lZCBhY3Rpb24uXCIsXHJcbiAgICBpY29uOiBcIkljb24uODB4ODBcIixcclxuICAgIHBlcnNpc3RlbnQ6IHRydWUsXHJcbiAgfTtcclxuICAvLyBTaG93IGEgbm90aWZpY2F0aW9uIG1lc3NhZ2UuXHJcbiAgT2ZmaWNlLmNvbnRleHQubWFpbGJveC5pdGVtLm5vdGlmaWNhdGlvbk1lc3NhZ2VzLnJlcGxhY2VBc3luYyhcclxuICAgIFwiQWN0aW9uUGVyZm9ybWFuY2VOb3RpZmljYXRpb25cIixcclxuICAgIG1lc3NhZ2VcclxuICApO1xyXG5cclxuICAvLyBCZSBzdXJlIHRvIGluZGljYXRlIHdoZW4gdGhlIGFkZC1pbiBjb21tYW5kIGZ1bmN0aW9uIGlzIGNvbXBsZXRlLlxyXG4gIGV2ZW50LmNvbXBsZXRlZCgpO1xyXG59XHJcblxyXG4vLyBSZWdpc3RlciB0aGUgZnVuY3Rpb24gd2l0aCBPZmZpY2UuXHJcbk9mZmljZS5hY3Rpb25zLmFzc29jaWF0ZShcImFjdGlvblwiLCBhY3Rpb24pO1xyXG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0FBLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLE1BQU07RUFDbkI7QUFBQSxDQUNELENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNDLE1BQU1BLENBQUNDLEtBQWlDLEVBQUU7RUFDakQsTUFBTUMsT0FBMEMsR0FBRztJQUNqREMsSUFBSSxFQUFFTCxNQUFNLENBQUNNLFlBQVksQ0FBQ0MsMkJBQTJCLENBQUNDLG9CQUFvQjtJQUMxRUosT0FBTyxFQUFFLG1CQUFtQjtJQUM1QkssSUFBSSxFQUFFLFlBQVk7SUFDbEJDLFVBQVUsRUFBRTtFQUNkLENBQUM7RUFDRDtFQUNBVixNQUFNLENBQUNXLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDQyxJQUFJLENBQUNDLG9CQUFvQixDQUFDQyxZQUFZLENBQzNELCtCQUErQixFQUMvQlgsT0FDRixDQUFDOztFQUVEO0VBQ0FELEtBQUssQ0FBQ2EsU0FBUyxDQUFDLENBQUM7QUFDbkI7O0FBRUE7QUFDQWhCLE1BQU0sQ0FBQ2lCLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDLFFBQVEsRUFBRWhCLE1BQU0sQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==\n//# sourceURL=webpack-internal:///./src/commands/commands.ts\n\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/commands/commands.ts"]();
/******/ 	
/******/ })()
;