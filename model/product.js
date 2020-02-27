const products = {
    fakeDB: [],

    init() {
        this.fakeDB.push({
            type: `cate`,
            title: `Electronics & Accessories`,
            src: `/image/Electronics.jpg`,
            alt: `Electronics`,
            description: `Explore now`
        });
        this.fakeDB.push({
            type: `cate`,
            title: `Revamp your home`,
            src: `/image/Revamp.jpg`,
            alt: `Revamp-your home`,
            description: `Explore now`
        });
        this.fakeDB.push({
            type: `cate`,
            title: `Shop Valentine's Day gifts`,
            src: `/image/valentine.jpg`,
            alt: `Shop-valentine's-day-gifts`,
            description: `Explore now`
        });
        this.fakeDB.push({
            type: `cate`,
            title: `Fitness, cardio and more`,
            src: `/image/fitness.jpg`,
            alt: `Fitness`,
            description: `Explore now`
        });
        this.fakeDB.push({
            type: `product`,
            title: `Straw-Choc`,
            src: `/image/chocolate.jpg`,
            alt: `Straw-Choc`,
            category: `Valentine's Gift`,
            price: `$25.99`,
            bestSeller: true
        });
        this.fakeDB.push({
            type: `product`,
            title: `Alpha 2600 Headset`,
            src: `/image/headset.jpg`,
            alt: `Alpha-2600-Headset`,
            category: `Electronics & Accessories`,
            price: `$126.99`,
            bestSeller: true
        });
        this.fakeDB.push({
            type: `product`,
            title: `Apple 3 Keyboard`,
            src: `/image/keyboard.jpg`,
            alt: `Apple-3-Keyboard`,
            category: `Electronics & Accessories`,
            price: `$210.99`,
            bestSeller: true
        });
        this.fakeDB.push({
            type: `product`,
            title: `Govani x60 USB Cable`,
            src: `/image/usb.jpg`,
            alt: `Govani-x60-USB-Cable`,
            category: `Electronics & Accessories`,
            price: `$5.99`,
            bestSeller: true
        });
        this.fakeDB.push({
            type: `product`,
            title: `COCO lamp - white`,
            src: `/image/lamp.jpg`,
            alt: `COCO-lamp-white`,
            category: `Home`,
            price: `$69.99`,
            bestSeller: false
        });
        this.fakeDB.push({
            type: `product`,
            title: `PhilliStar Sofa - light green`,
            src: `/image/sofa.jpg`,
            alt: `PhilliStar-Sofa-light-green`,
            category: `Home`,
            price: `$1999.99`,
            bestSeller: true
        });
    },

    getType() {
        const type = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `cate`) {
                type.push(product);
            }
        });
        return type;
    },

    getBestSeller() {
        const bestSeller = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product` && product.bestSeller) {
                bestSeller.push(product);
            }
        });
        return bestSeller;
    },

    getProductList() {
        const productList = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product`) {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                productList.push(product);
            }
        });
        return productList;
    }
}

products.init();
module.exports = products;