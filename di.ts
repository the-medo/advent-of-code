import axios from 'axios';
import dotenv from 'dotenv';
import fs from "fs";
import util from 'util';

dotenv.config();
let cookie = process.env.SESSION_COOKIE;

export const downloadInput = async (day: number, year: number) => {
    return axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            'Cookie': cookie
        }
    })
        .then(async(response) => {
            const filename = `src/${year}/day-${day}/input-${day}.txt`
            console.log("Writing input to file: ", filename)
            await util.promisify(fs.writeFile)(filename, response.data.trim());
        })
        .catch((error) => {
            console.error(`Error: ${error}`, error);
        });
}