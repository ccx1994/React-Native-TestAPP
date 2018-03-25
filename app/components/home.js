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
    Modal,
    Animated,
    Easing,
    FlatList
} from 'react-native';


import Icon from 'react-native-vector-icons/Icomoon';
import TabBar from './my-componets/tabBar';
import MyList from './my-componets/myList';
import NewsItem from './newsItem';
import fetchRequest from '../util/fetchRequest';
import { fetchNews, saveNavigation, isWriting } from '../actions/index';
import Write from './write';



const cacheNews = {
    total: 0,
    newsList: []
}



class Home extends Component {
    constructor() {
        super();
        this.state = {
            selectedTab: 'home',
            dataList: [],
            currentPage: 1,
            isRefreshing: false,
            animating: false,
            isWriting: false,
            refreshText:'下拉刷新',
            rotateValue:new Animated.Value(0),
            isLoadingMoved:false,
            isLoading:false
        }

    }


    componentDidMount() {
        this.props.saveNavigation(this.props.navigation);
        this._fetchNews(this.state.currentPage);
        this.props.toWrite(false);
    }



    _isRefreshing = () =>  {
        if(this.state.isRefreshing){
            return <Image source={require('../asset/img/loading.gif')}  style={styles.loading} />
        }else{
            return <Animated.Image  style={[styles.refreshArrow,{transform: [{rotate:this.state.rotateValue.interpolate({inputRange:[0,180],outputRange:['0deg','-180deg']})}]}]}source={require('../asset/img/refresh.png')} />   
        }
    }

    _renderHeader = () => (
        <View style={styles.refreshBox}>
            {this._isRefreshing()}
            <Text style={styles.refreshText}>{this.state.refreshText}</Text>
        </View>
    )
    

    _renderItem = ({item,index}) => {
        return (<NewsItem name={item.name}></NewsItem>)
    }

    _onScroll = e => {
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
    }

    _onTouchEnd = e => {
        if(this.state.isLoadingMoved){
            this.setState({
                refreshText:'加载中...',
                isRefreshing:true
            })
            
            this._scroll.scrollToOffset({animated: true, offset: 0})
            this._fetchNews(1)
            setTimeout(()=>{
                this.setState({
                    refreshText:'下拉刷新',
                    isRefreshing:false,
                    isLoadingMoved:false
                })
                Animated.timing(this.state.rotateValue,{
                    toValue: 0,
                    duration: 1,
                }).start()
                this._scroll.scrollToOffset({animated: true, offset: 60})
            },2000)
        }
    }

    async _fetchNews(page) {
        this.setState({
            isLoading: true,
            animating: true
        });

        const newsInfo = await this.props.getHeads(this.state.currentPage);
        
        for (let item of newsInfo.result.newsList) {
            item.key = Math.random();
        }

        if (page == 1) {
            cacheNews.newsList = [];
        }
        cacheNews.newsList = [...cacheNews.newsList, ...newsInfo.result.newsList];
        cacheNews.total = newsInfo.result.total;
        this.setState((preState) => ({
            currentPage: preState.currentPage + 1,
            isLoading: false,
            dataList: cacheNews.newsList,
            animating:false
        }))

    }

    _hasMore() {
        return cacheNews.newsList.length !== cacheNews.total;
    }

    _fetchMoreNews() {
        if (this.state.isLoading || !this._hasMore()) {
            return;
        }
        this._fetchNews(this.state.currentPage);
    }

    _loadOver() {
        if (!this._hasMore() && cacheNews.total !== 0) {
            return <View style={{ height: 100, alignItems: 'center', }}><Text style={{ fontSize: 15, }}>没有啦</Text></View>
        }

        return <ActivityIndicator
            animating={this.state.animating}
            style={{ height: 40 }}
        />
    }



    render() {

        return (
            <View  style={{ flex: 1 }}>
                {this.props.isWriting?<Write />:null}
                <TabBar 
                    barColor='rgba(238,238,238,0.9)'
                    height={55}>
                    <TabBar.Item
                        name="home"
                        title="微博"
                        titleColor='#242424'
                        selectedName="home-fill"
                        color="#242424"
                        iconSize={35}
                        selected={this.state.selectedTab === 'home'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'home'
                            })
                        }}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.headLine}>
                                <View style={styles.top}></View>
                                <View style={styles.header}>
                                    <View style={styles.cameraBox}>
                                        <Image style={styles.cameraImg}
                                            source={require('../asset/img/camera.png')} />
                                    </View>
                                    <View style={styles.headerTitleBox}>
                                        <View style={styles.titleSelected}>
                                            <View style={styles.titleSelectedBox}>
                                                <Text style={{ fontSize: 20, }}>关注</Text>
                                                <View style={styles.titleSelectedLine}></View>
                                            </View>
                                            <Image style={styles.titleSelectedTriangle}
                                                source={require('../asset/img/triangle.png')} />
                                        </View>
                                        <View style={{ flex: 1, alignSelf: 'center', }}>
                                            <Text style={styles.unselectedTitle}>热门</Text>
                                        </View>
                                    </View>
                                    <View style={styles.headerRightBox}>
                                        <Image style={styles.headerRightRed}
                                            source={require('../asset/img/redpackage.png')} />
                                        <Image style={styles.headerRightScan}
                                            source={require('../asset/img/scan.png')} />
                                    </View>
                                </View>
                            </View>
                            <FlatList
                                ref={(scroll) => {this._scroll = scroll}}
                                onScroll={this._onScroll.bind(this)}
                                onTouchEnd={this._onTouchEnd.bind(this)}
                                ListHeaderComponent={this._renderHeader.bind(this)}
                                contentInset={{ top: -60 }}
                                contentOffset={{ y: 60 }}
                                style={styles.scrollBg}
                                data={this.state.dataList}
                                onEndReachedThreshold={0.1}
                                onEndReached={this._fetchMoreNews.bind(this)}
                                renderItem={this._renderItem.bind(this)}
                                ListFooterComponent={this._loadOver.bind(this)} />
                            {/* <ListView
                                dataSource={this.state.dataSource}
                                contentInset={{ top: 55 }}
                                contentOffset={{ y: -75 }}
                                enableEmptySections={true}
                                onEndReached={this._fetchMoreNews.bind(this)}
                                renderFooter={this._loadOver.bind(this)}
                                onEndReachedThreshold={50}
                                renderRow={this._renderRow.bind(this)}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={() => this._fetchNews(1)}
                                        tintColor="#c7c7c7"
                                        title="正在刷新..."
                                        titleColor="#242424"
                                        progressBackgroundColor="#EEEEEE"
                                    />
                                }
                                style={{ backgroundColor: '#EEEEEE', }}
                            /> */}
                        </View>
                    </TabBar.Item>
                    <TabBar.Item
                        name="message"
                        title="消息"
                        titleColor='#242424'
                        selectedName="message-fill"
                        color="#242424"
                        iconSize={35}
                        selected={this.state.selectedTab === 'message'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'message'
                            })
                        }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ margin: 50 }}>这里是第二页</Text>
                        </View>
                    </TabBar.Item>
                    <TabBar.Item
                        name="plus"
                        color="#FD8223"
                        iconSize={45}
                        onPress={() => {
                            this.props.toWrite(true);
                        }}>
                    </TabBar.Item>
                    <TabBar.Item
                        name="search"
                        title="发现"
                        titleColor='#242424'
                        selectedName="search-fill"
                        color="#242424"
                        iconSize={35}
                        selected={this.state.selectedTab === 'search'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'search'
                            })
                        }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ margin: 50 }}>这里是第三页</Text>
                        </View>
                    </TabBar.Item>
                    <TabBar.Item
                        name="people"
                        title="我"
                        titleColor='#242424'
                        selectedName="people-fill"
                        color="#242424"
                        iconSize={35}
                        selected={this.state.selectedTab === 'people'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'people'
                            })
                        }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ margin: 50 }}>这里是第四页</Text>
                        </View>
                    </TabBar.Item>
                </TabBar>
            </View>

        )
    }
}






export default connect((state) => ({
    isWriting: state.isWriting
}), (dispatch) => ({
    getHeads: () => dispatch(fetchNews()),
    saveNavigation: (navigation) => dispatch(saveNavigation(navigation)),
    toWrite: (isToWrite) => dispatch(isWriting(isToWrite))
}))(Home)

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    top: {
        height: 20,
        backgroundColor: 'rgba(238,238,238,0.9)',
    },
    header: {
        width: deviceWidth,
        backgroundColor: 'rgba(238,238,238,0.9)',
        height: 55,
        flexDirection: 'row',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
    },
    headLine: {
        position: 'absolute',
        top: 0,
        zIndex: 999,
    },
    cameraBox: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraImg: {
        width: 30,
        height: 30,
        marginLeft: 15,
    },
    headerTitleBox: {
        flex: 1,
        flexDirection: 'row',
    },
    titleSelected: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleSelectedBox: {
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    titleSelectedLine: {
        height: 4,
        backgroundColor: '#FD8223',
        position: 'absolute',
        width: 27,
        borderRadius: 8,
        alignSelf: 'center',
        bottom: 4,
    },
    titleSelectedTriangle: {
        width: 8,
        height: 4,
        marginLeft: 4,
        alignSelf: 'center',
    },
    unselectedTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: '#949494',
    },
    headerRightBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    headerRightRed: {
        width: 40,
        height: 30,
        alignSelf: 'center',
        marginRight: 8,
    },
    headerRightScan: {
        width: 27,
        height: 27,
        alignSelf: 'center',
        marginRight: 15,
    },
    writeContainer: {
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(238,238,238,0.9)',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        flexWrap: 'wrap',
    },
    scrollBg:{
        marginTop:75,
        backgroundColor: '#EEEEEE',
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
});