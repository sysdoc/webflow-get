import fs from "node:fs/promises";
import fetch from 'node-fetch';

// const { default: config } = await import("./config.json", { assert: { type: "json" } });
export const config = JSON.parse(await fs.readFile("config.json"));


export async function crawlUrlsUsing(knownUrls, htmlFromUrl, urlsFromHtml, callbackWithPage) {
  const knownUrlsSet = new Set(knownUrls);

  for (const knownUrl of knownUrlsSet) {
    const html = await htmlFromUrl(knownUrl);

    if (html === undefined) {
      knownUrlsSet.delete(knownUrl);
      continue;
    }

    const page = { url: knownUrl, html };

    const foundUrls = urlsFromHtml(html);

    for (const foundUrl of foundUrls) {
      if (!knownUrlsSet.has(foundUrl)) {
        knownUrlsSet.add(foundUrl);
      }
    }

    callbackWithPage && await callbackWithPage(page);
  }

  return knownUrlsSet;
}




export function fullUrlsFromHtml(htmlCode) {
  return new Set([...htmlCode.matchAll(/href=['"](\/[^'"]*)['"]/g)].map((match => config["webflowSiteBaseUrl"] + match[1])));
}




export async function storeTextContentIntoFile(textContent, fileUri) {
  const folders = fileUri.split("/").slice(0, -1);
  let folderToCheck = "";

  for (const folder of folders) {
    folderToCheck += `${folder}/`;

    try {
      await fs.access(folderToCheck);
    } catch (error) {
      await fs.mkdir(folderToCheck);
    }
  }

  await fs.writeFile(fileUri, textContent, { flag: 'w' });
}



export async function htmlFromFullUrl(absoluteUrl) {
  const response = await fetch(absoluteUrl);

  if (!response.ok && !response.redirected) {
    // console.error(`${response.status}: ${response.statusText} ${absoluteUrl}`);
    return undefined;
  }

  return response.text();
}




export async function updateSnapshot() {
  const entryUrls = config.entryPaths.map(path => config.webflowSiteBaseUrl + path);

  const urlsSet = await crawlUrlsUsing(entryUrls, htmlFromFullUrl, fullUrlsFromHtml, async function (page) {
    const pathname = (new URL(page.url)).pathname;
    const fileUri = config.outputFolderUri + (pathname === "/" ? "/index.html" : `${pathname}.html`);
    await storeTextContentIntoFile(page.html, fileUri);
    return fileUri;
  });

  const webflowUrls = [...urlsSet.values()];
  const productionUrls = webflowUrls.map(
    (url) => url.replace(config.webflowSiteBaseUrl, config.productionSiteBaseUrl)
  );

  const sitemapXml = sitemapXmlFromUrls(productionUrls);
  await storeTextContentIntoFile(sitemapXml, "public/sitemap.xml");
  await storeTextContentIntoFile(robotsTxt, "public/robots.txt");
};



function sitemapXmlFromUrls(fullUrls) {
  const date = new Date();
  const dateStr = date.toISOString();

  return (
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    fullUrls.map((fullUrl) => `
      <url>
          <loc>${fullUrl}</loc>
          <lastmod>${dateStr}</lastmod>
      </url>`
    ).join("") +
    `</urlset>`
  );
}


const robotsTxt = `
User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: ${config["productionSiteBaseUrl"]}/sitemap.xml
`;