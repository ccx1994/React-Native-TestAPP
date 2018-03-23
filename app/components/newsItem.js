
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Icomoon';

class OthersHeadSculpture extends Component {
    render() {
        return (
            <View style={styles.headSculptureBox}>
                <View style={styles.otherHeadBox1}>
                    <View style={styles.otherHeadBox2}>
                        <Image style={styles.othersHeadImg} source={require('../asset/img/she.png')} />
                    </View>
                </View>

                <Text numberOfLines={1} style={styles.usersName}>{this.props.name}</Text>
            </View>
        )
    }
}



class newsItem extends Component {

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                {this.props.index == 0 ?
                    (<View style={styles.peopleLine}>
                        <View style={styles.headSculptureBox}>
                            <View style={styles.userHeadBox}>
                                <Image style={styles.userHeadImg} source={require('../asset/img/myself.png')} />
                                <View style={{ position: 'absolute', bottom: 0, right: 4, width: 17, height: 17, backgroundColor: '#FAFAFA', justifyContent: 'center', borderRadius: 8.5, }}>
                                    <Icon name="small-puls" size={14} style={{ color: '#4CA7FC', alignSelf: 'center', }} />
                                </View>
                            </View>
                            <Text style={styles.usersName}>我的故事</Text>
                        </View>
                        {this.props.heads.map((child) => (<OthersHeadSculpture key={child.userName} name={child.userName} />))}
                    </View>) : null
                }
                <View style={styles.newsContainer}>
                    <View style={{ width: deviceWidth - 30 }}>
                        <View style={styles.newsHeadLine}>
                            <Image style={styles.headSculpture} source={require('../asset/img/she.png')} />
                            <View style={{ flex: 1, height: 80, }}>
                                <View style={[styles.layoutRow, { marginTop: 20, marginBottom: 6, }]}>
                                    <Text numberOfLines={1} style={{ fontSize: 18, color: '#242424', }}>{this.props.name}</Text>
                                    <Image style={styles.newsHeadLineArrow} source={require('../asset/img/arrow.png')} />
                                </View>
                                <View style={styles.layoutRow}>
                                    <Text style={{ color: '#c7c7c7', marginRight: 7, }}>3-2</Text>
                                    <Text style={{ color: '#c7c7c7', }}>来自</Text>
                                    <Text style={{ color: '#5C84B1', }}>iPhone客户端</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', marginBottom: 10, }}>
                            <Text style={styles.newsBodyText}>在一起吧→_→</Text>
                        </View>
                        <View style={{ marginBottom: 14, }}>
                            <Image style={{ width: 320, height: 320 / (2048 / 1399), }} source={require('../asset/img/testImg.png')} />
                        </View>
                        <View style={styles.newsFootBox}>
                            <TouchableOpacity 
                            style={styles.newsFootBtnClick}
                            onPress = {() => navigate('Transmit')}>
                                <View style={styles.newsFootBtn}>
                                    <Image style={styles.newsFootBtnImg} source={require('../asset/img/transmit.png')} />
                                    <Text style={{ fontSize: 16 }}>转发</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.newsFootBtnClick}>
                                <View style={styles.newsFootBtn}>
                                    <Image style={styles.newsFootBtnImg} source={require('../asset/img/comment.png')} />
                                    <Text style={{ fontSize: 16 }}>评论</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.newsFootBtnClick}>
                                <View style={styles.newsFootBtn}>
                                    <Image style={styles.newsFootBtnImg} source={require('../asset/img/praise.png')} />
                                    <Text style={{ fontSize: 16 }}>赞</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default connect((state) => ({
    heads: state.othersHead,
    navigation: state.navigation
}))(newsItem)

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    peopleLine: {
        height: 120,
        backgroundColor: '#FAFAFA',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    headSculptureBox: {
        width: 90,
        height: 120,
    },
    userHeadBox: {
        width: 65,
        height: 65,
        alignSelf: 'center',
        borderRadius: 32.5,
        marginTop: 15,
    },
    userHeadImg: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
    },
    otherHeadBox1: {
        width: 73,
        height: 73,
        alignSelf: 'center',
        borderRadius: 36.5,
        marginTop: 15,
        backgroundColor: '#FD8223',
        justifyContent: 'center',
    },
    otherHeadBox2: {
        width: 68,
        height: 68,
        alignSelf: 'center',
        borderRadius: 34,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    othersHeadImg: {
        width: 65,
        height: 65,
        alignSelf: 'center',
        borderRadius: 32.5,
    },
    usersName: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10,
        fontSize: 15,
        color: '#242424',
    },
    newsContainer: {
        backgroundColor: '#FFFFFF',
        width: deviceWidth,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        marginBottom: 10,
    },
    newsHeadLine: {
        height: 80,
        width: deviceWidth - 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headSculpture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    newsHeadLineArrow: {
        width: 17,
        height: 17,
        position: 'absolute',
        right: 0,
    },
    newsBodyText: {
        fontSize: 18,
        color: '#242424',
        width: deviceWidth - 30,
    },
    newsFootBox: {
        height: 40,
        width: deviceWidth - 30,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e9e9e9',
    },
    newsFootBtnClick: {
        flex: 1,
    },
    newsFootBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    newsFootBtnImg: {
        width: 19,
        height: 19,
        marginRight: 5,
    },

    layoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
