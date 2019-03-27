const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const url = 'https://www.jianshu.com/';

function routeFunction(req, res, next, routePath) {
    let Res = res; //保存，防止下边的修改

    https.get(url, function(res) { //通过get方法获取对应地址中的页面信息
        let chunks = [];
        let size = 0;
        res.on('data', function(chunk) { //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end', function() { //数据传输完
            let data = Buffer.concat(chunks, size);
            let change_data = iconv.decode(data, 'utf-8');

            let html = change_data.toString();
            let $ = cheerio.load(html); //cheerio模块开始处理 DOM处理

            let result = [{
                "success": true,
                "data": []
            }];

            switch (routePath) {
                case 'home':
                    result = {
                        "success": true,
                        "data": [{
                            "articleList": [],
                            "recommendList": []
                        }]
                    };
                    // 文章列表
                    $(".note-list>li").each(function() {
                        let item = {};
                        item.id = $(this).attr("data-note-id");
                        item.title = $(this).find(".content>.title").text();
                        item.href = $(this).find(".content>.title").attr("href");
                        item.dsc = $(this).find(".content>.abstract").text();
                        item.imgUrl = $(this).find(".wrap-img img").attr("src");
                        result.data[0].articleList.push(item);
                    });
                    // 推荐列表
                    $(".board>a").each(function() {
                        let item = {};
                        item.href = $(this).attr("href");
                        item.imgUrl = $(this).find("img").attr("src");
                        result.data[0].recommendList.push(item);
                    });
                    break;

                case 'headerList':
                    fs.writeFileSync(path.resolve(__dirname, '../views/test.html'), html);
                    // 推荐词（js动态添加，无法爬取）
                    $(".search-trending-tag-wrap>li").each(function() {
                        let word = $(this).find("a").text();
                        result.data.push(word);
                    });
                    break;

                case 'writers':
                    // 推荐作者列表
                    $(".recommended-authors ul>li ").each(function() {
                        let item = {};
                        item.avatar_href = $(this).find("a").eq(0).attr("href");
                        item.follow_href = $(this).find("a").eq(1).attr("href");
                        item.title_href = $(this).find("a").eq(2).attr("href");
                        item.name = $(this).find("a").eq(2).text();
                        item.dsc = $(this).find("p").text();
                        item.imgUrl = $(this).find("img").attr("src");
                        result.data.push(item);
                    });
                    break;

                default:
                    return
            }

            Res.send(result);
        });
    });
}



router.get('/home', function(req, res, next) { // 浏览器端发来get请求
    routeFunction(req, res, next, 'home');
});

router.get('/headerList', function(req, res, next) { // 浏览器端发来get请求
    routeFunction(req, res, next, 'headerList');
});

router.get('/detail/:id', function(req, res, next) { // 浏览器端发来get请求
    routeFunction(req, res, next, 'detail');
});

router.get('/moreArticleList', function(req, res, next) { // 浏览器端发来get请求
    routeFunction(req, res, next, 'moreArticleList');
});

router.get('/writers', function(req, res, next) { // 浏览器端发来get请求
    routeFunction(req, res, next, 'writers');
});
module.exports = router;