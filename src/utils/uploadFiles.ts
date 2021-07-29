import { createWriteStream } from "fs";
const fs = require("fs")
const checkDirectory = async (userId: any) => {
    const dir = `./src/uploads/${userId}`;
    if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir, {
            recursive: true
        });
    }
    return dir
}
export const uploadFiles = async (file: any, userId: any) => {
    console.log("ADasd", file)
    const dir = await checkDirectory(userId)
    const filename = new Date().toISOString().replace(/:/g, " ") + "-" + file.filename

    new Promise(async (resolve, reject) =>
        file.createReadStream()
            .pipe(createWriteStream(`${dir}/${filename}`))
            .on("finish", async (res: any) => {
                console.log("Asdasd", res)
                resolve(true);
            })
            .on("error", (err: Error) => reject(err))
    );

}