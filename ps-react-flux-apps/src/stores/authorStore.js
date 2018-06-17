"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');
var CHANGE_EVENT = 'change';


var _authors = [];

var AuthorStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    getAllAuthors() {
        return _authors;
    },

    getAuthorById(id) {
        return _.find(_authors, {id: id});
    }
});

Dispatcher.register(function(action) {
    switch(action.actionType) {
        case ActionTypes.INITIALIZE:
            _authors = action.initialData.authors;
            break;
        case ActionTypes.CREATE_AUTHOR:
            _authors.push(action.author);
            AuthorStore.emitChange();
            break;
        case ActionTypes.UPDATE_AUTHOR:
            var existingAuthor = _.find(_authors, {id: action.author.id});
            var existingAuthorIndex = _.indexOf(_authors, existingAuthor);
            _authors.splice(existingAuthorIndex, 1, existingAuthor);
            AuthorStore.emitChange();
            break;
        case ActionTypes.DELETE_AUTHOR:
            _authors = _.filter(_authors, function(author) {
                return action.id !== author.id;
            });
            AuthorStore.emitChange();
            break;
        default:
            // pass
    }
});

module.exports = AuthorStore;