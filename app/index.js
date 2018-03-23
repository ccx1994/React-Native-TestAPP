import React, { Component } from 'react';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';

import Icon from 'react-native-vector-icons/Icomoon';
import fetchRequest from './util/fetchRequest';
import apiList from './api/index';
import { changeTab } from './actions/index';

import App from './components/home';
import Transmit from './components/transmit'


const initState = {
    registerType: false,
    selectedTab: 'home'
}
const todoApp = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TAB':
            return {
                ...state,
                selectedTab: action.changedType
            }
            break;
        case 'CHANGE_REGISTER':
            return {
                ...state,
                registerType: action.registerType
            }
            break;
        case 'SAVE_HEADS':
            return {
                ...state,
                othersHead: action.headList
            }
            break;
        case 'SAVE_NAVIGATION':
            return {
                ...state,
                navigation:action.navigation
            }
        case 'IS_WRITING':
            return {
                ...state,
                isWriting:action.isWriting
            }
        default:
            return state
    }
}
let store = createStore(todoApp, initState, applyMiddleware(thunk));

const Navigation = StackNavigator({
    News: { 
        screen: App,
        navigationOptions:{
            header:null
        }
    },
    Transmit: { 
        screen: Transmit,
        navigationOptions:{
            header:null
        }
    }
},{
    initialRouteName:'News'
});



export default class TestApp extends Component {

    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}




