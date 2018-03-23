import fetchRequest from '../util/fetchRequest';
import apiList from '../api/index';

export const changeTab = (tabName) => (
    {
        type:'CHANGE_TAB',
        changedType:tabName
    }
)


const saveNews = (heads) => (
    {
        type:'SAVE_HEADS',
        headList:heads
    }
)

export const fetchNews = (page) => {
    return  (dispatch) => {
        return new Promise(async (resolve,reject) => {
            try {
                const getNewsItem_url = apiList.getNewsItem;
                const getNewsItem_params = {
                    page: page
                };
                const result = await fetchRequest.sendRequest(getNewsItem_url, getNewsItem_params)
                if(result.success){
                    setTimeout(() => {
                        dispatch(saveNews(result.result.heads));
                        resolve(result)
                    }, 2000)
                }else{
                    reject(result)
                }
            }catch(error){
                reject(error)
            }
        })
        
    }
}

export const saveNavigation = (navigation) => ({
    type:"SAVE_NAVIGATION",
    navigation:navigation
})

export const isWriting = (isWriting) => {
    return {
        type: "IS_WRITING",
        isWriting: isWriting
    }
}