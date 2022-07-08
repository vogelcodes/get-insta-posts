import fs from 'fs'


export async function writeJSON(jsonContent: string, username: string, filename: string) {
    const date = new Date().toJSON()
    fs.mkdirSync(`./output/${username}`, { recursive: true })

    
    fs.writeFileSync(`./output/${username}/${filename}.json`, jsonContent, 'utf8');
    
}

