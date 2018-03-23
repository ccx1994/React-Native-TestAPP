import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Icomoon';



class TabBarItem extends Component {
    render() {
        return (
            <TouchableOpacity style={{flex:1,}} onPress={this.props.onPress}>
                <View style={styles.tab}>
                    <Icon
                        name={this.props.selected ? this.props.selectedName : this.props.name}
                        size={this.props.iconSize}
                        style={styles.tabIcon}
                        color={this.props.color} />
                    {this.props.title ? <Text style={[styles.tabTitle, { color: this.props.titleColor, fontSize: this.props.titleSize }]}>{this.props.title}</Text> : null}
                </View>
            </TouchableOpacity>
        )
    }
}

class TabBar extends Component {
    render() {
        return (
            <View style={styles.container} >
                {React.Children.map([...[this.props.children]], (child) => {
                    if (child.props.selected) {
                        return child.props.children
                    }
                })}
                <View style={[styles.tabBarBox, { backgroundColor: this.props.barColor, height: this.props.height }]}>
                    {this.props.children}
                </View>
            </View>
        )
    }
}

const MyTabBar = TabBar
MyTabBar.Item = TabBarItem
export default MyTabBar



const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    tabBarBox: {
        width: deviceWidth,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e9e9e9',
    },
    pressBox: {
        flex: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        textAlign: 'center',
    },
    tabTitle: {
        flex: 1,
    }
});

