const http = require('http')
const fs = require('fs')

const readFile = (file) => {
    return new Promise ((resolve,reject)=>{
        fs.readFile(file,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data.toString())
            }
        })
    })
}
http.createServer((req,res)=>{
    if(req.url === '/api/guests'){
        readFile('./guests.json')
        .then( data => {
            res.write(data)
            res.end()
        })
        .catch( ex => {
            res.write(ex.message)
        })
    }
    if(req.url === '/'){
        readFile('./index.html')
        .then( data => {
            res.write(data)
            res.end()
        })
        .catch( ex => {
            res.write(ex.message)
        })
    }
}).listen(4200)