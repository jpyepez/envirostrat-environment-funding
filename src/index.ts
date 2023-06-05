import {Parser} from '@json2csv/plainjs'
import data from './data/funding-data.json';
import fs from 'fs';


const cleanData = data.nodes.map(({id, title, intro, tags, detailList, linkList}) => ({
  id, 
  title, 
  description: intro, 
  tags, 
  organisation: detailList.find(({property}) => property === 'Organisation')?.value || '',
  fundingAvailable: detailList.find(({property}) => property === 'Funding available')?.value || '',
  status: detailList.find(({property}) => property === 'Status')?.value || '',
  infoLink: linkList[0]?.href || '',
}))

const entryTags = new Map()

cleanData.forEach(entry => {
  entry.tags.forEach(tag => {
    if (!entryTags.has(tag.title)) {
      entryTags.set(tag.title, {id: entryTags.size, title: tag.title, href: tag.href})
    }
  })
})

const taggedData = cleanData.flatMap(({tags, ...rest}) => {
  return tags.map(tag => ({
    ...rest,
    tagId: entryTags.get(tag.title)?.id,
    tagTitle: tag.title,
    tagLink: tag.href === null ? '' : `https://environment.govt.nz${tag.href}` ,
  }))
})


const json2csvParser = new Parser()
const csv = json2csvParser.parse(taggedData)

fs.writeFile('output/funding-data.csv', csv, err => {
    if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log('CSV file saved successfully.');
      } 
    })






