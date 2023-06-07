const createCsvWriter = require("csv-writer").createObjectCsvWriter
const args = process.argv.slice(2)
const csvWriter = createCsvWriter({
  path: "output.csv",
  header: [
    { id: "id", title: "Id" },
    { id: "updated", title: "Updated" },
    { id: "author", title: "Author" },
    { id: "version", title: "Version" },
    { id: "rating", title: "Rating" },
    { id: "title", title: "Title" },
    { id: "content", title: "Content" }
  ]
})
let responseText = ""
const https = require("https")
const req = https.request(`https://itunes.apple.com/jp/rss/customerreviews/id=${args[0]}/json`, (res) => {
  res.on("data", (chunk) => {
      responseText += chunk
  })
  res.on("end", () => {
    const json = JSON.parse(responseText)
    let data = []
    json["feed"]["entry"].forEach(element => {
      data.push({
        author: element["author"]["name"]["label"],
        updated: element["updated"]["label"],
        rating: element["im:rating"]["label"],
        version: element["im:version"]["label"],
        id: element["id"]["label"],
        title: element["title"]["label"],
        content: element["content"]["label"].replace(/\n/, "")
      })
    })
    csvWriter
        .writeRecords(data)
        .then(() => console.log("CSVファイルが正常に書き出されました。"))
        .catch((err) => console.error("CSVファイルの書き出し中にエラーが発生しました:", err))

  })
})
req.on("error", (e) => {
  console.error(`エラーが発生しました： ${e.message}`)
})
req.end()
