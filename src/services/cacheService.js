let instance = null;

export class CacheService {
    cache = {};
    constructor(){
        if(!instance){
            instance = this;
        }

        return instance;
    }

    isValueCached(key){
        return this.getCacheValue(key);
    }

    cacheValue(key, value){
        this.cache[key]=value;
    }
    
    getCacheValue(key){
        return this.cache[key];
    }
}