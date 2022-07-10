import { IgApiClient, AccountFollowersFeedResponseUsersItem, UserFeedResponseItemsItem, UserFeedResponseCarouselMediaItem } from 'instagram-private-api'
import fs from 'fs'
import { setTimeout } from 'timers/promises'

import https from 'https'
import { writeJSON } from './writefile'; './writefile'

export async function downloadMedia(username: string){
  
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
  
  
  
  
  let files = fs.readdirSync(`./output/${username}/`)
  let options = files.filter(f => f.endsWith('json'))
  let fileToRead = options.length - 1
  console.log(options[fileToRead])
  let data = fs.readFileSync(`./output/${username}/${options[fileToRead]}`)
  fs.mkdirSync(`./output/${username}/posts`, { recursive: true })
  
  
  let posts: UserFeedResponseItemsItem[] = JSON.parse(data.toString())
  for await (let post of posts) {
    let postDate = new Date(post.taken_at*1000)
    let filename = postDate.toISOString()
    let foldername = postDate.toISOString().slice(0,10) +"-"+ post.pk.toString()
    let savingDir = `/posts/${foldername}/`
    
    fs.mkdirSync(`./output/${username}/posts/${foldername}`, { recursive: true })
    if (!checkExistentFile(filename, username,savingDir)){
      writeJSON(JSON.stringify(post),username,savingDir+ foldername)
      
    }
    
    
    if(post.caption){
      fs.writeFileSync(`./output/${username}/posts/${foldername}/caption.txt`, post.caption.text, 'utf8')
    }
    
    
    let extension = ''
    let mediaURL = ''
    switch (post.media_type) {
      case 2:
        mediaURL = post.video_versions![0].url
        extension = 'mp4'
        if (!checkExistentFile(post.pk, username, savingDir)){
           await downloadMedia(mediaURL, extension, post.pk, username, savingDir)
        }
        break;
        case 1:
          mediaURL = post.image_versions2.candidates[0].url
          extension = 'jpg'  
          if (!checkExistentFile(post.pk, username, savingDir, extension)){
            await downloadMedia(mediaURL, extension, post.pk, username, savingDir)
          }
          break;
          case 8:
            let  carousel_media  = post.carousel_media
            let index = 0
            for await (let media of carousel_media!){
              let { media_type } = media
              switch (media_type){
                case 1:
                  mediaURL = media.image_versions2.candidates[0].url
                  extension = 'jpg'
                  if (!checkExistentFile(post.pk+'-'+index, username, savingDir, extension)){
                     await downloadMedia(mediaURL, extension, post.pk+'-'+index, username, savingDir)
                  }
                  break;
                  case 2:
                    let media2: any = media
                    mediaURL = media2.video_versions![0].url;
                    extension = 'mp4'
                    if (!checkExistentFile(post.pk+'-'+index, username, savingDir)){
                      await downloadMedia(mediaURL, extension, post.pk+'-'+index, username, savingDir)
                      
              }
              break
              default:
                break;
              }
              index++
            }
            
            break;
            default:
              break;
    }

}
}
