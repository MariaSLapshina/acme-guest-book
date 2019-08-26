const http = require('http')
const fs = require('fs')

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data.toString())
            }
        })
    })
}

const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve()
            }
        })
    })
}

const addUser = (user) => {
    return readFile('./guests.json')
        .then(data => {
            const users = JSON.parse(data)
            users.push(user)
            return writeFile('./guests.json', JSON.stringify(users))
        })
}

http.createServer((req, res) => {
    if (req.url === '/api/guests') {
        if (req.method === 'GET') {
            readFile('./guests.json')
                .then(data => {
                    res.write(data)
                    res.end()
                })
                .catch(ex => {
                    res.write(ex.message)
                    res.end()
                })
        } else if (req.method === 'POST') {
            let user = ''
            req.on('data', (chunk) => {
                user += chunk
            })
            req.on('end', () => {
                addUser(user)
                    .then(() => {
                        res.write(user)
                        res.end()
                    })
                    .catch(ex => {
                        res.write(ex.message)
                        res.end()
                    })
            })
        }
    }
    else if (req.url === '/') {
        readFile('./index.html')
            .then(data => {
                res.write(data)
                res.end()
            })
            .catch(ex => {
                res.write(ex.message)
                res.end()
            })
    }
}).listen(4200)
