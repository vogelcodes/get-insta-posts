import {getposts} from './getposts'
import {downloadMedia} from './download-media'
var args = process.argv.slice(2,3);
const  username  = args[0];
const download = args[1]

async function main(username: string) {
    if (download=='download'){
        await getposts(username)
    }
    await downloadMedia(username)
    
}

main(username);

