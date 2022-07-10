export default function getArguments(){
    var args = process.argv.slice(2,4);
    const  username  = args[0];
    const download = args[1];

    return { username, download }
       
}