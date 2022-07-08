# Get-Insta-Posts

I wrote this code to automate backup of my instagram account. It downloads all posts and media. It checks for existing files before downloading. You can download the whole feed of any public profile on instagram too.

Thanks to [dilame/instagram-private-api](https://github.com/dilame/instagram-private-api)

## How to use it

You need [NodeJS](https://nodejs.org/en/download/) installed on your system.

1. Clone this repo using git or download the zip file.
2. Run `npm install` in the root folder:"./GET-INSTA-POSTS"
3. create a `.env` file in the root folder, with your instagram credentials like in `.env.example` or hardcode it on `getposts.ts`.
4. Run `npm run get instagramUser`. _Don't include the *@*!!!_
5. All data is saved in output directory.

## Troubleshooting
Instagram limits requests to the API and downloads from CDN so don't abuse it. Run it only a few times a week to keep a backup of your Instagram Feed.
If an error happens while downloading media, you can run `npm run get instagramUser download-only`. The argument `download-only` will skip the API requests for posts and try to download again the missing media.




