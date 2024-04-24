const http = require('http');
const url = require('url');
const fs = require('fs');

const productsData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const products = JSON.parse(productsData);

const overviewTmp = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTmp = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const cardTmp = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');


const replaceTmp = (tmp, product) => {
    let output = tmp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    if (pathname === '/overview' || pathname === '/') {
        // OVERVIEW
        const cardsHtml = products.map(product => replaceTmp(cardTmp, product)).join('');
        const output = overviewTmp.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        res.end(output);
    } else if (pathname === '/product' && query.id) {
        // PRODUCT
        const product = products[query.id];
        const output = replaceTmp(productTmp, product);

        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        res.end(output);
    } else if (pathname === '/api') {
        // API
        res.writeHead(404, {
            'Content-type': 'application/json',
        });
        res.end(productsData);
    } else {
        // NOT FOUND
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Not found</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log("Started on port 8000");
})