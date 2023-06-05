import {Parser} from '@json2csv/plainjs'
import data from './data/funding-data.json';
import fs from 'fs';


const json2csvParser = new Parser()
const csv = json2csvParser.parse(data.nodes)

fs.writeFile('output/funding-data.csv', csv, err => {
    if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log('CSV file saved successfully.');
      } 
    })






