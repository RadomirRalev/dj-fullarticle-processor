import fs from 'fs';
import * as cheerio from 'cheerio';

const buildArticleObjects = ($, element) => {
    const content = [];
    const tables = $(element).find('tbody');
    for (const table of tables) {
        let rows = new Map();
        $(table).find('tr').each(function() {
            const row = $(this).find('td').map((i, el) => $(el).text().trim()).get();
            rows.set(row[0], row[1]);
        })
        content.push(rows);
    }
    return content;
};

const getMapArticles = (html) => {
    const articles = [];
    const $ = cheerio.load(html);
    const content = buildArticleObjects($, 'div[class*=Article]');
    for (const row of content)  {
        console.log(row)
        const article = {
            headline: row.get('HD'),
            originalHeadline:  row.get('HD'),
            source: row.get('SN'),
            language: row.get('LA'),
            date: row.get('PD'),
            author: row.get('AU'),
            body: (row.get('LP') + row.get('TD')).replace(/[\r\n]+/g, '')
        }
        articles.push(article);
    }
    return articles;
}

export const mediaReport = async (htmlFilePath) => {
    try {
        const html = fs.readFileSync(htmlFilePath, 'utf8');
        return getMapArticles(html);
    } catch (error) {
        console.error('Error:', error);
    }
};