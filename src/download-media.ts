import { IgApiClient, AccountFollowersFeedResponseUsersItem, UserFeedResponseItemsItem, UserFeedResponseCarouselMediaItem } from 'instagram-private-api'
import fs from 'fs'
import https from 'https'
import { writeJSON } from './writefile'; './writefile'

export async function downloadMedia(username: string){

  let allPosts: UserFeedResponseItemsItem[] = [];
  
  
  
  
  let files = fs.readdirSync(`./output/${username}/`)
  let options = files.filter(f => f !== 'posts')
  let fileToRead = options.length - 1
  console.log(files[fileToRead])
  let data = fs.readFileSync(`./output/${username}/${options[fileToRead]}`)
  fs.mkdirSync(`./output/${username}/posts`, { recursive: true })
  fs.mkdirSync(`./output/${username}/posts/media`, { recursive: true })
  
  let posts: UserFeedResponseItemsItem[] = JSON.parse(data.toString())
  posts.map(post => {
    let filename = new Date(post.taken_at*1000).toISOString()
    if (!checkExistentFile(filename, username,'/posts')){
      writeJSON(JSON.stringify(post),username,'/posts/'+ filename)
      
    }
    let extension = ''
    let mediaURL = ''
    switch (post.media_type) {
      case 2:
        mediaURL = post.video_versions![0].url
        extension = 'mp4'
        if (!checkExistentFile(post.pk, username, '/posts/media')){
          downloadMedia(mediaURL, extension, post.pk, username)
        }
        break;
        case 1:
          mediaURL = post.image_versions2.candidates[0].url
          extension = 'jpg'  
          if (!checkExistentFile(post.pk, username, '/posts/media')){
            downloadMedia(mediaURL, extension, post.pk, username)
          }
          break;
          case 8:
      let { carousel_media } = post
      carousel_media?.map((media: any, index)=>{
        let { media_type } = media
        switch (media_type){
          case 1:
            mediaURL = media.image_versions2.candidates[0].url
            extension = 'jpg'
            if (!checkExistentFile(post.pk+'-'+index, username, '/posts/media'))
            downloadMedia(mediaURL, extension, post.pk+'-'+index, username)
            break;
            case 2:
              mediaURL = media.video_versions![0].url;
              extension = 'mp4'
              if (!checkExistentFile(post.pk+'-'+index, username, '/posts/media'))
              downloadMedia(mediaURL, extension, post.pk+'-'+index, username)
              break
              default:
                break;
              }
            })
            
            break;
            default:
              break;
            }
            function checkExistentFile(filename: string, username: string, path: string){
              if (fs.readdirSync(`./output/${username}${path}`).findIndex(f => f.startsWith(filename))==-1){
                return false
              }
              return true
            }
            
            function downloadMedia(mediaURL: string, extension: string, filename: string, username: string) {https.get(mediaURL, (res) => {
              const path = `./output/${username}/posts/media/${filename}.${extension}`;
              const writeStream = fs.createWriteStream(path);
              
              res.pipe(writeStream);
              
              writeStream.on("finish", () => {
                writeStream.close();
                console.log(filename+extension+"Download Completed");
              });
  });
  }

})
}
