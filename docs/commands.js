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

eval("{/*\r\n * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.\r\n * See LICENSE in the project root for license information.\r\n */\n\n/* global Office */\nOffice.onReady(() => {\n  // If needed, Office.js is ready to be called.\n});\n/**\r\n * Shows a notification when the add-in command is executed.\r\n * @param event\r\n */\nfunction action(event) {\n  const message = {\n    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,\n    message: \"Performed action.\",\n    icon: \"Icon.80x80\",\n    persistent: true\n  };\n  // Show a notification message.\n  Office.context.mailbox.item.notificationMessages.replaceAsync(\"ActionPerformanceNotification\", message);\n\n  // Be sure to indicate when the add-in command function is complete.\n  event.completed();\n}\n\n// Register the function with Office.\nOffice.actions.associate(\"action\", action);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJPZmZpY2UiLCJvblJlYWR5IiwiYWN0aW9uIiwiZXZlbnQiLCJtZXNzYWdlIiwidHlwZSIsIk1haWxib3hFbnVtcyIsIkl0ZW1Ob3RpZmljYXRpb25NZXNzYWdlVHlwZSIsIkluZm9ybWF0aW9uYWxNZXNzYWdlIiwiaWNvbiIsInBlcnNpc3RlbnQiLCJjb250ZXh0IiwibWFpbGJveCIsIml0ZW0iLCJub3RpZmljYXRpb25NZXNzYWdlcyIsInJlcGxhY2VBc3luYyIsImNvbXBsZXRlZCIsImFjdGlvbnMiLCJhc3NvY2lhdGUiXSwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hlZXRvcy1haS8uL3NyYy9jb21tYW5kcy9jb21tYW5kcy50cz8zNzRjIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbiAqIFNlZSBMSUNFTlNFIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXHJcbiAqL1xyXG5cclxuLyogZ2xvYmFsIE9mZmljZSAqL1xyXG5PZmZpY2Uub25SZWFkeSgoKSA9PiB7XHJcbiAgLy8gSWYgbmVlZGVkLCBPZmZpY2UuanMgaXMgcmVhZHkgdG8gYmUgY2FsbGVkLlxyXG59KTtcclxuLyoqXHJcbiAqIFNob3dzIGEgbm90aWZpY2F0aW9uIHdoZW4gdGhlIGFkZC1pbiBjb21tYW5kIGlzIGV4ZWN1dGVkLlxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcbmZ1bmN0aW9uIGFjdGlvbihldmVudDogT2ZmaWNlLkFkZGluQ29tbWFuZHMuRXZlbnQpIHtcclxuICBjb25zdCBtZXNzYWdlOiBPZmZpY2UuTm90aWZpY2F0aW9uTWVzc2FnZURldGFpbHMgPSB7XHJcbiAgICB0eXBlOiBPZmZpY2UuTWFpbGJveEVudW1zLkl0ZW1Ob3RpZmljYXRpb25NZXNzYWdlVHlwZS5JbmZvcm1hdGlvbmFsTWVzc2FnZSxcclxuICAgIG1lc3NhZ2U6IFwiUGVyZm9ybWVkIGFjdGlvbi5cIixcclxuICAgIGljb246IFwiSWNvbi44MHg4MFwiLFxyXG4gICAgcGVyc2lzdGVudDogdHJ1ZSxcclxuICB9O1xyXG4gIC8vIFNob3cgYSBub3RpZmljYXRpb24gbWVzc2FnZS5cclxuICBPZmZpY2UuY29udGV4dC5tYWlsYm94Lml0ZW0ubm90aWZpY2F0aW9uTWVzc2FnZXMucmVwbGFjZUFzeW5jKFxyXG4gICAgXCJBY3Rpb25QZXJmb3JtYW5jZU5vdGlmaWNhdGlvblwiLFxyXG4gICAgbWVzc2FnZVxyXG4gICk7XHJcblxyXG4gIC8vIEJlIHN1cmUgdG8gaW5kaWNhdGUgd2hlbiB0aGUgYWRkLWluIGNvbW1hbmQgZnVuY3Rpb24gaXMgY29tcGxldGUuXHJcbiAgZXZlbnQuY29tcGxldGVkKCk7XHJcbn1cclxuXHJcbi8vIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB3aXRoIE9mZmljZS5cclxuT2ZmaWNlLmFjdGlvbnMuYXNzb2NpYXRlKFwiYWN0aW9uXCIsIGFjdGlvbik7XHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQUEsTUFBTSxDQUFDQyxPQUFPLENBQUMsTUFBTTtFQUNuQjtBQUFBLENBQ0QsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0MsTUFBTUEsQ0FBQ0MsS0FBaUMsRUFBRTtFQUNqRCxNQUFNQyxPQUEwQyxHQUFHO0lBQ2pEQyxJQUFJLEVBQUVMLE1BQU0sQ0FBQ00sWUFBWSxDQUFDQywyQkFBMkIsQ0FBQ0Msb0JBQW9CO0lBQzFFSixPQUFPLEVBQUUsbUJBQW1CO0lBQzVCSyxJQUFJLEVBQUUsWUFBWTtJQUNsQkMsVUFBVSxFQUFFO0VBQ2QsQ0FBQztFQUNEO0VBQ0FWLE1BQU0sQ0FBQ1csT0FBTyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQ0Msb0JBQW9CLENBQUNDLFlBQVksQ0FDM0QsK0JBQStCLEVBQy9CWCxPQUNGLENBQUM7O0VBRUQ7RUFDQUQsS0FBSyxDQUFDYSxTQUFTLENBQUMsQ0FBQztBQUNuQjs7QUFFQTtBQUNBaEIsTUFBTSxDQUFDaUIsT0FBTyxDQUFDQyxTQUFTLENBQUMsUUFBUSxFQUFFaEIsTUFBTSxDQUFDIiwiaWdub3JlTGlzdCI6W10sImZpbGUiOiIuL3NyYy9jb21tYW5kcy9jb21tYW5kcy50cyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/commands/commands.ts\n\n}");

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