
import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    FlatList,
    Image,
    Animated,
    Easing
} from 'react-native';

class Header extends Component {
    constructor(){
        super();
        this.state = {
            rotateValue: new Animated.Value(0)
        }
    }

    render(){
        return (
            <View style={styles.refreshBox}>
                <Animated.Image  style={[styles.refreshArrow,{transform: [{rotate:this.state.rotateValue.interpolate({inputRange:[0,180],outputRange:['0deg','-180deg']})}]}]}source={require('../asset/img/refresh.png')} />   
                <Text style={styles.refreshText}>下拉刷新</Text>
            </View>
        )
            
    }
}

export default class Transmit extends Component {

    constructor(){
        super();
        this.state = {
            dataList:[{key: 'a'}, {key: 'b'},{key: 'c'},{key: 'd'}, {key: 'e'},{key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'},{key: 'j'}, {key: 'k'},{key: 'l'},{key: 'm'}, {key: 'n'},{key: 'o'},{key: 'p'}, {key: 'q'},{key: 'r'}],
            refreshText:'下拉刷新'
        }
        this.touchStartY = 0;
        this.movedY = 0;
        this.rotateValue = new Animated.Value(0);
    }

    _renderHeader = () => (
        <View style={styles.refreshBox}>
            <Animated.Image  style={[styles.refreshArrow,{transform: [{rotate:this.rotateValue.interpolate({inputRange:[0,180],outputRange:['0deg','-180deg']})}]}]}source={require('../asset/img/refresh.png')} />   
            <Text style={styles.refreshText}>{this.state.refreshText}</Text>
        </View>
    )
    
    _renderItem = ({item}) => {
        return (<View style={styles.box}>
                    <Text>{item.key}</Text>
                </View>)
    }

    render() {
        return (
            <View style={styles.containor}>
                <FlatList
                    ref={(scroll) => {this._scroll = scroll}}
                    onTouchStart={(e)=>{
                        this.touchStartY = e.nativeEvent.locationY;
                        
                        
                    }}
                    onTouchMove={(e)=>{
                        this.movedY = e.nativeEvent.locationY - this.touchStartY;
                        if(this.movedY > 120){
                            this.setState({
                                refreshText:'释放更新'
                            })
                            Animated.timing(this.rotateValue,{
                                toValue: 180,
                                duration: 30,
                                easing: Easing.linear,
                            }).start()
                        }

                        
                    }}
                    
                    onTouchEnd={()=>{
                        if(this.movedY > 120){
                            this.setState({
                                refreshText:'加载中...'
                            })
                            
                            this._scroll.scrollToOffset({animated: true, offset: 0})
    
                            setTimeout(()=>{
                                this.setState({
                                    refreshText:'下拉刷新'
                                })
                                Animated.timing(this.rotateValue,{
                                    toValue: 0,
                                    duration: 1,
                                }).start()
                                this._scroll.scrollToOffset({animated: true, offset: 60})
                                this.movedY = 0;
                            },2000)
                        }
                    }}

                    ListHeaderComponent={this._renderHeader}
                    contentInset={{ top: -60 }}
                    contentOffset={{ y: 60 }}
                    style={styles.scrollBg}
                    data={this.state.dataList}
                    renderItem={this._renderItem}
                />
            </View>
        )}
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').Height;

let styles = StyleSheet.create({
    containor:{
        //width:deviceWidth,
        //height:deviceHeight,
    },
    scrollBg:{
        //position:'absolute',
        //top:0,
        marginTop:20,
    },
    refreshBox:{
        flexDirection:'row',
        width:deviceWidth,
        height:60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshArrow:{
        width:25,
        height:25,
    },
    refreshText:{
        color:'red',
        textAlign:'center',
        fontSize:15,
    },
    box:{
        width:deviceWidth,
        height:100,

    },
})