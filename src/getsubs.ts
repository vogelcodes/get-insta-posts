import { IgApiClient, AccountFollowersFeedResponseUsersItem, UserFeedResponseItemsItem } from 'instagram-private-api'
import { setTimeout } from 'timers/promises'
import 'dotenv/config'
import fs from 'fs'
import { writeJSON } from './writefile'; './writefile'

var args = process.argv.slice(2);

export async function getSubs(username: string) {
  const ig = new IgApiClient();
  ig.state.generateDevice("acer-i7");
  let allFollowers: AccountFollowersFeedResponseUsersItem[] = [];
  
  
  type Data = UserFeedResponseItemsItem[]
const loggedInUser = await ig.account.login(process.env.USERNAME || "" ,process.env.PASSWORD || "");
const targetUser = await ig.user.searchExact(username.toString());
const followerQty = targetUser.follower_count
const followFeed =  ig.feed.accountFollowers(targetUser.pk);
const friendsFirstPage = await followFeed.items();
allFollowers=(allFollowers.concat(friendsFirstPage));
console.log('Página 1')
var pageNumber = 2;
async function interval(ms: number){

}
while (followFeed.isMoreAvailable() && pageNumber < 100) {
    const wait = await setTimeout(1000)
    try {
        const nextPage = await followFeed.items();
        allFollowers=allFollowers.concat(nextPage);
        console.log(`Página ${pageNumber}`)
        pageNumber++
        
    } catch (error) {
        
    }
    
}
 
var jsonContent = JSON.stringify(allFollowers);
fs.mkdirSync(`./output/${username}/subs`, { recursive: true })

await writeJSON(jsonContent, username, "subs/"+username +`-subs-${new Date().toISOString()}`)
allFollowers.map(sub =>{
  
    fs.writeFileSync(`./output/${username}/subs/${sub.username}.txt`, sub.full_name+"\n"+sub.pk, 'utf8')
  
})
 

console.log('getSubsDone')
}

