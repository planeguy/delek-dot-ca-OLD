import {createStore, combineReducers } from 'redux';

import channels from 'src/app/state/channels/reducer';
import items from 'src/app/state/items/reducer';
import selectedItem from 'src/app/state/selected-item/reducer';
import site from 'src/app/state/site/reducer';

import {makeItemId, parseRoute} from 'src/app/clusterfriend-common';

const clusterfriend = combineReducers({
    channels,
    items,
    selectedItem,
    site
});

export default class ClusterfriendSite {
    constructor(spec){
        this.store = createStore(clusterfriend);
        
        let s = spec || {};
        this.loader = s.loader || ((b,f)=>{});
        
        this.open(document.location.hash);
        window.addEventListener('popstate', function() {
            this.open(document.location.hash);
        });
    }

    subscribe(fn){
        this.store.subscribe(()=>{
            fn(this.store.getState());
        });
    }
    
    loadFeed(base='',feed='feed.xml'){
        this.loader(base,feed).then((channel)=>{
            this.store.dispatch({
                type:'receive channel',
                channel
            });
        });
    }

    open(route){
        let feedInfo = parseRoute(route);
        this.loadFeed(feedInfo.base,feedInfo.feed);
        if(!!feedInfo.id) this.selectItemById(feedInfo.base,feedInfo.feed,feedInfo.id);
    }

    selectItemById(base='',feed='feed.xml',id){
        this.selectItemByGuid(makeItemId(location, base, feed ,id));
    }

    selectItemByGuid(guid){
        this.store.dispatch({
            type:'select item',
            guid: guid
        });
    }

    loadNext(base=''){
        let channels=this.store.getState().channels;

        let state = this.store.getState();
        if(state.site.nextChannel) this.loadFeed(base,state.site.nextChannel);
    }
}