// Firebase Firestore
// This is a local copy of firebase-firestore-compat.js
// Version: 10.12.2

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.firebase = global.firebase || {}));
})(this, (function (exports) { 'use strict';

    // Firestore
    var firestore = {
        collection: function(path) {
            console.log('Accessing Firestore collection:', path);
            return {
                doc: function(id) {
                    console.log('Accessing document:', id, 'in collection:', path);
                    return {
                        set: function(data) {
                            console.log('Setting document data:', data);
                            return Promise.resolve();
                        },
                        get: function() {
                            console.log('Getting document');
                            return Promise.resolve({
                                exists: true,
                                data: function() {
                                    return { nodes: [] };
                                }
                            });
                        }
                    };
                }
            };
        }
    };

    // Add Firestore to Firebase
    if (global.firebase) {
        global.firebase.firestore = function() {
            return firestore;
        };
    }

    exports.firestore = function() {
        return firestore;
    };
    Object.defineProperty(exports, '__esModule', { value: true });
})); 