import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    ListView,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Easing,
    ScrollView
} from 'react-native';

import fetchRequest from '../util/fetchRequest';
import apiList from '../api/index';
import { isWriting } from '../actions/index';

class Write extends Component {
    constructor() {
        super();
        this.state = {
            animatedList: [],
            rotateValue: new Animated.Value(0),
            currentPoint: 0
        };
        //判断是否滑动的参数
        this.isMoved = false;
        
    }
    componentDidMount() {
        

        let getIcons_url = apiList.getIcons;
        let getIcons_params = {};


        fetchRequest.sendRequest(getIcons_url, getIcons_params)
            .then((data) => {
                let animatedList = data.result.map((child) => {
                    child.initY = new Animated.Value(deviceHeight-350)
                    return child;
                })
                this.setState({
                    animatedList: animatedList
                })
                let timing = Animated.timing;
                Animated.parallel(
                    timing(this.state.rotateValue,{
                        toValue: 45,
                        duration: 250,
                        easing: Easing.linear,
                    }).start(),
                    this.state.animatedList.map((child, index) => {
                        let conf = {
                            toValue: 0,
                            duration: 250,
                            easing: Easing.bezier(0.15, 0.73, 0.37, 1.2),
                            delay: 0 + index * 20
                        }
                        return timing(child.initY, conf).start();
                    }))
            })

            

    }

    _scrollMoved(){
        this.isMoved = true;
    }

    _scrollPage(event){
        this.setState({
            currentPoint:event.nativeEvent.contentOffset.x/deviceWidth
        })
        this.forceUpdate();
    }

    _downAnimation() {
        
        if(!this.isMoved){
            let timing = Animated.timing;
            Animated.parallel(
                timing(this.state.rotateValue,{
                    toValue: 0,
                    duration: 250,
                    easing: Easing.linear,
                }).start(),
                this.state.animatedList.map((child, index) => {
                let conf = {
                    toValue: deviceHeight-350,
                    duration: 250,
                    easing: Easing.bezier(0.15, 0.73, 0.37, 1),
                    delay: (this.state.animatedList.length - index) * 40
                }
                return timing(child.initY, conf).start();
            }))

            setTimeout(()=> {
                this.props.toWrite(false);
            },(this.state.animatedList.length * 20 + 250))
        }

       
        this.isMoved = false;
        
        
                
    } 

    render() {
        return (
            <View style={styles.writeContainer} >
                <View style={styles.scrollContainer}>
                    <ScrollView  
                    onScrollBeginDrag={this._scrollMoved.bind(this)}
                    onTouchEnd={this._downAnimation.bind(this)} 
                    onMomentumScrollEnd={this._scrollPage.bind(this)}
                    pagingEnabled={true} 
                    showsHorizontalScrollIndicator={false} 
                    bounces={false} 
                    scrollEnabled={true}  
                    horizontal={true} >
                        <View style={styles.scrollPage}>
                            {this.state.animatedList.map((child) => (
                                <Animated.View key={child.name} style={[styles.circleBtnContainer,{transform: [{ translateY: child.initY }]}]}>
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} onPress={() => {
                                        console.log('点到了')
                                        this.isMoved = true;
                                        
                                    }}>
                                        <View style={[styles.circleBtn, { backgroundColor: child.color }]} ></View>
                                        <Text>{child.title}</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                            }
                        </View>
                        <View style={styles.scrollPage}>
                            {this.state.animatedList.map((child) => (
                                <Animated.View key={child.name} style={[styles.circleBtnContainer,{transform: [{ translateY: child.initY }]}]}>
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} onPress={() => {
                                        console.log('点到了')
                                        this.isMoved = true;
                                    }}>
                                        <View style={[styles.circleBtn, { backgroundColor: child.color }]} ></View>
                                        <Text>{child.title}</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.pointLine}>
                        <View style={[styles.point,this.state.currentPoint == 0?styles.currentPoint:null]}></View>
                        <View style={[styles.point,this.state.currentPoint == 1?styles.currentPoint:null]}></View>
                    </View>
                    <View style={styles.footLine}>
                        <Animated.Image  style={[styles.rotate,{transform: [{rotate:this.state.rotateValue.interpolate({inputRange:[0,45],outputRange:['0deg','45deg']})}]}]}source={require('../asset/img/grayPlus.png')} />
                    </View>
                </View>
            </View>
        )
    }
}

export default connect((state) => ({
    isWriting: state.isWriting
}), (dispatch) => ({
    toWrite: (isToWrite) => dispatch(isWriting(isToWrite))
}))(Write)

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    clickContainer: {
        width: deviceWidth,
        height: deviceHeight,
        
    },
    writeContainer: {
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: 'rgba(238,238,238,0.9)',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        
    },
    scrollContainer:{
        height:deviceHeight,
        
    },
    scrollPage:{
        transform: [{ translateY: 350 }],
        width:deviceWidth,
        flexDirection:'row',
        flexWrap: 'wrap',
        paddingLeft:15,
        paddingRight:15,
    },
    circleBtnContainer: {
        width: '25%',
        height: 120,
    },
    circleBtn: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignSelf: 'center',
        marginBottom: 10,
    },
    pointLine:{
        position:'absolute',
        width:deviceWidth,
        height:20,
        zIndex:9,
        bottom:65,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    point:{
        width:7,
        height:7,
        borderRadius:3.5,
        backgroundColor:'#E1E0DF',
        marginRight:10,
    },
    currentPoint:{
        backgroundColor:'#FC8124',
    },
    footLine:{
        position:'absolute',
        width:deviceWidth,
        height:55,
        borderTopWidth:1,
        borderTopColor:'#e9e9e9',
        left:0,
        bottom:0,
        alignItems:'center',
        justifyContent:'center',
        zIndex:-1,
    },
    rotate:{
        width:30,
        height:30,
    },
})