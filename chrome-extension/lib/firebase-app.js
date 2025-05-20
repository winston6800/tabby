// Firebase App (the core Firebase SDK) is always required and must be listed first
// This is a local copy of firebase-app-compat.js
// Version: 10.12.2

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.firebase = {}));
})(this, (function (exports) { 'use strict';

    // Firebase App
    var firebase = {
        initializeApp: function(config) {
            console.log('Firebase initialized with config:', config);
            var app = {
                name: config.projectId,
                options: config,
                firestore: function() {
                    return global.firebase.firestore();
                }
            };
            this.apps.push(app);
            return app;
        },
        apps: [],
        app: function(name) {
            return this.apps.find(app => app.name === name);
        },
        firestore: function() {
            return global.firebase.firestore();
        }
    };

    exports.initializeApp = firebase.initializeApp;
    exports.apps = firebase.apps;
    exports.app = firebase.app;
    exports.firestore = firebase.firestore;
    Object.defineProperty(exports, '__esModule', { value: true });
})); 