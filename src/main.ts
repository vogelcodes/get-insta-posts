import {getposts} from './getposts'
import {downloadMedia} from './download-media'
var args = process.argv.slice(2,3);
const  username  = args[0];

async function main(username: string) {
    await getposts(username)
    await downloadMedia(username)
    
}

main(username);

