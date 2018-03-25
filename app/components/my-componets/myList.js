
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


export default class Transmit extends Component {

    constructor(){
        super();
        this.state = {
            dataList:[{key: 'a'}, {key: 'b'},{key: 'c'},{key: 'd'}, {key: 'e'},{key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'},{key: 'j'}, {key: 'k'},{key: 'l'},{key: 'm'}, {key: 'n'},{key: 'o'},{key: 'p'}, {key: 'q'},{key: 'r'}],
            refreshText:'下拉刷新',
            rotateValue:new Animated.Value(0),
            isLoadingMoved:false,
            isLoading:false
        }
    }

    _isLoading = () =>  {
        // if(this.state.isLoading){
        //     return <Image source={require('../asset/img/loading.gif')}  style={styles.loading} />
        // }else{
        //     return <Animated.Image  style={[styles.refreshArrow,{transform: [{rotate:this.state.rotateValue.interpolate({inputRange:[0,180],outputRange:['0deg','-180deg']})}]}]}source={require('../asset/img/refresh.png')} />   
        // }
    }

    _renderHeader = () => (
        <View style={styles.refreshBox}>
            {this._isLoading()}
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
            <FlatList
                ref={(scroll) => {this._scroll = scroll}}

                onScroll={(e)=>{
                    if(!this.state.isLoadingMoved && e.nativeEvent.contentOffset.y < -30){
                        this.setState({
                            refreshText:'释放更新',
                            isLoadingMoved:true,
                        })
                        Animated.timing(this.state.rotateValue,{
                            toValue: 180,
                            duration: 90,
                            easing: Easing.linear,
                        }).start()
                    }
                }}
                
                onTouchEnd={(e)=>{
                    if(this.state.isLoadingMoved){
                        this.setState({
                            refreshText:'加载中...',
                            isLoading:true
                        })
                        
                        this._scroll.scrollToOffset({animated: true, offset: 0})

                        setTimeout(()=>{
                            this.setState({
                                refreshText:'下拉刷新',
                                isLoading:false,
                                isLoadingMoved:false
                            })
                            Animated.timing(this.state.rotateValue,{
                                toValue: 0,
                                duration: 1,
                            }).start()
                            this._scroll.scrollToOffset({animated: true, offset: 60})
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
        )}
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').Height;

let styles = StyleSheet.create({
    scrollBg:{
        marginTop:20,
    },
    refreshBox:{
        flexDirection:'row',
        width:deviceWidth,
        height:60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading:{
        width:25,
        height:25,
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