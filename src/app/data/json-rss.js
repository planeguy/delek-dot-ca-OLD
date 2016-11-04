import Feed from '../model/Feed';
import Item from '../model/Item';

export function cfFrom(response, url){
    let c = JSON.parse(response);
    c.items = (c.items || []).map((i)=>(new Item(i)));
    if (!c.guid) c.guid=url;
    return new Feed(c);
}