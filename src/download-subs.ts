import { IgApiClient, AccountFollowersFeedResponseUsersItem, UserFeedResponseItemsItem, UserFeedResponseCarouselMediaItem } from 'instagram-private-api'
import fs from 'fs'
import { setTimeout } from 'timers/promises'

import https from 'https'
import { writeJSON } from './writefile'; './writefile'

export async function downloadSubs(username: string){
  
  function checkExistentFile(filename: string, username: string, path: string, extension?: string){
    let nameToSearch = filename
    if (extension){
      nameToSearch = filename+"."+extension
    }
      if (fs.readdirSync(`./output/${username}${path}`).findIndex(f => f.startsWith(nameToSearch))==-1){
        return false
      }
      return true
  }
  
  async function downloadMedia(mediaURL: string, extension: string, filename: string, username: string, savingDir: string) {
    if (extension=='mp4'){
      const delay = await setTimeout(2000)
    } else {
      const delay = await setTimeout(100)
    }

    console.log(filename+'.'+extension+" Download Started");
    
    https.get(mediaURL, (res) => {
      const path = `./output/${username}${savingDir}${filename}.${extension}`;
      const writeStream = fs.createWriteStream(path);
      
      res.pipe(writeStream);
      
      writeStream.on("finish", () => {
        writeStream.close();
        console.log(filename+'.'+extension+" Download Completed");
      });
      
    });
  }
  let allPosts: UserFeedResponseItemsItem[] = [];
  
  
  
  
  let subfiles = fs.readdirSync(`./output/${username}/subs/`)
  let suboptions = subfiles.filter(f => f.endsWith('json'))
  let subfileToRead = suboptions.length - 1
  console.log(suboptions[subfileToRead])
  let subdata = fs.readFileSync(`./output/${username}/subs/${suboptions[subfileToRead]}`)
  
  
  let subs: AccountFollowersFeedResponseUsersItem[] = JSON.parse(subdata.toString())
  for await (let sub of subs){
    let follower = sub.username
    let url = sub.profile_pic_url
    if(!checkExistentFile(follower+'.jpg', username, '/subs/')){
      await downloadMedia(url, 'jpg', follower, username,'/subs/')
    }
    
  }

}
