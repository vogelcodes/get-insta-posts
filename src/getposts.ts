import { IgApiClient, AccountFollowersFeedResponseUsersItem, UserFeedResponseItemsItem } from 'instagram-private-api'
import 'dotenv/config'
import fs from 'fs'
import { writeJSON } from './writefile'; './writefile'

var args = process.argv.slice(2);

export async function getposts(username: string) {
  const ig = new IgApiClient();
  ig.state.generateDevice("acer-i7");
  let allPosts: UserFeedResponseItemsItem[] = [];
  
  
  type Data = UserFeedResponseItemsItem[]
const loggedInUser = await ig.account.login(process.env.USERNAME || "" ,process.env.PASSWORD || "");
const targetUser = await ig.user.searchExact(username.toString());
const postsFeed =  ig.feed.user(targetUser.pk)
const postsFirstPage = await postsFeed.items();
allPosts=(allPosts.concat(postsFirstPage));
console.log('Página 1')
var pageNumber = 2;
while (postsFeed.isMoreAvailable()) {
    try {
        const nextPage = await postsFeed.items();
        allPosts=allPosts.concat(nextPage);
        console.log(`Página ${pageNumber}`)
        pageNumber++
        
    } catch (error) {
        
    }
    
}
 
var jsonContent = JSON.stringify(allPosts);
await writeJSON(jsonContent, username, username +`-posts-${new Date().toISOString()}`)
 

console.log('getPostsDone')
}

