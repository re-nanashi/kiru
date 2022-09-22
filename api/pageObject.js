class PageObject {
    constructor(link, pagePromiseObject, htmlSelectors) {
        this.pagePromiseObject = pagePromiseObject;
        this.htmlSelectors = htmlSelectors;
        this.currentLink = link;
    }

    generateMangaDataObject() {
        let dataObj = {};

        dataObj['link'] = this.currentLink;
		dataObj['title'] = this.getTitle();
		dataObj['image'] = this.getImage();
		dataObj['status'] = this.getStatus();
		dataObj['author'] = this.getAuthor();
        dataObj['latest'] = this.getLatestChapter();
        dataObj['latestLink'] = this.getLatestChapterLink();
        dataObj['description'] = this.getDescription();

        return dataObj;
    }

    async getTitle() {
        return await this.pagePromiseObject.$eval(`${this.htmlSelectors.title}`, (node) => node.textContent);
    }

    async getImage() {
        const image = await this.pagePromiseObject.$(`${this.htmlSelectors.image}`);

        return await image.screenshot({ encoding: 'base64' });
    }

    async getAuthor() {
        return await this.pagePromiseObject.$eval(`${this.htmlSelectors.author}`, (author) => {
            return author.textContent.replace(/\n/g, '');
        });
    }

    async getStatus() {
        return await this.pagePromiseObject.$eval(
            `${this.htmlSelectors.status}`,
            (status) => status.textContent
        );
    }

    async getDescription() {
        return await this.pagePromiseObject.$eval(`${this.htmlSelectors.description}`, (description) =>
            description.textContent.replace(/\n/g, '')
        );
    }

    async getLatestChapter() {
        const [list, linkPath] = this.htmlSelectors['latest'];
        let latest;
        let latestChapter = await this.pagePromiseObject.evaluate(
            (list, link) => {
                // select latest chapter number html selector
                const latestChapterSel = document.querySelector(`${list}`);
                const chapterNumber = latestChapterSel.querySelector(
                    `${link}`
                ).textContent;

                // check if chapter has unnecessary text
                if (chapterNumber.includes(':')) {
                    let string_arr = chapterNumber.split(':');
                    latest = string_arr[0];

                    return latest;
                }

                return chapterNumber;
            },
            list,
            linkPath
        );

        return latestChapter;
    }

    async getLatestChapterLink() {
        const [list, linkPath] = this.htmlSelectors['latest'];
        let latestChapter = await this.pagePromiseObject.evaluate(
            (list, link) => {
                const latestChapterSel = document.querySelector(`${list}`);
                const chapterLink = latestChapterSel.querySelector(`${link}`).href;

                return chapterLink;
            },
            list,
            linkPath
        );

        return latestChapter;
    }
}

module.exports = PageObject;
