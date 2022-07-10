import {getPosts} from './getposts'
import {downloadMedia} from './download-media'
import { getSubs } from './getsubs';
import { downloadSubs } from './download-subs';
var args = process.argv.slice(2,4);
const  username  = args[0];
const option = args[1];

async function main(username: string) {
    if(option=="download-only"){
        await downloadMedia(username)
        await downloadSubs(username)
        return
    }
    if(option=="subs"){
        await getSubs(username)
        return
    }
    await getPosts(username)
    await getSubs(username)
    await downloadMedia(username) 
    await downloadSubs(username)
    
}

main(username);

