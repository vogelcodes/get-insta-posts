import {getPosts} from './getposts'
import {downloadMedia} from './download-media'
import { getSubs } from './getsubs';
var args = process.argv.slice(2,4);
const  username  = args[0];
const download = args[1];

async function main(username: string) {
    if(download=="download-only"){
        await downloadMedia(username)
        return
    }
    if(download=="subs"){
        await getSubs(username)
        return
    }
    await getPosts(username)
    await getSubs(username)
    await downloadMedia(username) 
    
}

main(username);

