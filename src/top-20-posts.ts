import fs from 'fs'
import { UserFeedResponseItemsItem } from 'instagram-private-api';
import getArguments from './tools/getArguments'
import { writeJSON } from './writefile';

const { username, download } = getArguments();

console.log(username)

let files = fs.readdirSync(`./output/${username}/`)
let options = files.filter(f => f.endsWith('json'))
let fileToRead = options.length - 1
let data = fs.readFileSync(`./output/${username}/${options[fileToRead]}`)
let posts: UserFeedResponseItemsItem[] = JSON.parse(data.toString())
function sortByLikes(a: UserFeedResponseItemsItem,b: UserFeedResponseItemsItem){
    if (a.like_count > b.like_count){
        return -1
    }
    if (a.like_count < b.like_count){
        return 1
    }
    return 0
}
posts.sort(sortByLikes)
let top20posts = posts.slice(0,20)
writeJSON(JSON.stringify(top20posts),username,'top20posts')
let file = ''
top20posts.map(post => {
    file = file + (post.like_count+' likes'+'\n')
    file = file + ('Pasta: '+ new Date(post.taken_at*1000).toISOString().slice(0,10)+'-'+post.pk.toString()+'\n')
    file = file + (post.caption?.text+'\n'+'-----------------------------------------------'+'\n'+'\n')
    
})
fs.writeFileSync(`./output/${username}/top20posts.txt`, file, 'utf8')

