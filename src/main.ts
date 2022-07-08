import {getposts} from './getposts'
import {downloadMedia} from './download-media'
var args = process.argv.slice(2,4);
const  username  = args[0];
const download = args[1];

async function main(username: string) {
    if(download=="download-only"){
        await downloadMedia(username)
        return
    }
    await getposts(username)
    await downloadMedia(username) 
    
}

main(username);

