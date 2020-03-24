const products = {
    fakeDB: [],

    init() {
         this.fakeDB.push({
             type: `cate`,
             title: `Electronics & Accessories`,
             src: `/image/Electronics.jpg`,
             alt: `Electronics`,
             description: `Explore now`,
             href: "/electronic"
         });
         this.fakeDB.push({
             type: `cate`,
             title: `Revamp your home`,
             src: `/image/Revamp.jpg`,
             alt: `Revamp-your home`,
             description: `Explore now`,
             href: "/revhome"
         });
         this.fakeDB.push({
             type: `cate`,
             title: `Shop Valentine's Day gifts`,
             src: `/image/valentine.jpg`,
             alt: `Shop-valentine's-day-gifts`,
             description: `Explore now`,
             href: "/valentine"
         });
         this.fakeDB.push({
             type: `cate`,
             title: `Fitness, cardio and more`,
             src: `/image/fitness.jpg`,
             alt: `Fitness`,
             description: `Explore now`,
             href: "/fitness"
         });
         this.fakeDB.push({
             type: `product`,
             title: `Straw-Choc`,
             imgPath: `/image/chocolate.jpg`,
             alt: `Straw-Choc`,
             category: `Valentine's Gift`,
             price: `$25.99`,
             bestSeller: true,
             href: "/valentine"
         });
         this.fakeDB.push({
             type: `product`,
             title: `Alpha 2600 Headset`,
             imgPath: `/image/headset.jpg`,
             alt: `Alpha-2600-Headset`,
             category: `Electronics & Accessories`,
             price: `$126.99`,
             bestSeller: true,
             href: "/electronic"
         });
         this.fakeDB.push({
             type: `product`,
             title: `Apple 3 Keyboard`,
             imgPath: `/image/keyboard.jpg`,
             alt: `Apple-3-Keyboard`,
             category: `Electronics & Accessories`,
             price: `$210.99`,
             bestSeller: true,
             href: "/electronic"
         });
         this.fakeDB.push({
             type: `product`,
             title: `Govani x60 USB Cable`,
             imgPath: `/image/usb.jpg`,
             alt: `Govani-x60-USB-Cable`,
             category: `Electronics & Accessories`,
             price: `$5.99`,
             bestSeller: true,
             href: "/electronic"
         });
         this.fakeDB.push({
             type: `product`,
             title: `COCO lamp - white`,
             imgPath: `/image/lamp.jpg`,
             alt: `COCO-lamp-white`,
             category: `Home`,
             price: `$69.99`,
             bestSeller: false,
             href: "/revhome"
         });
         this.fakeDB.push({
             type: `product`,
             title: `PhilliStar Sofa - light green`,
             imgPath: `/image/sofa.jpg`,
             alt: `PhilliStar-Sofa-light-green`,
             category: `Home`,
             price: `$1999.99`,
             bestSeller: true,
             href: "/revhome"
         });
         this.fakeDB.push({
             type: `product`,
             title: `Supper Dumbbell - 10lb`,
             imgPath: `/image/dumbbell.jpg`,
             alt: `Supper Dumbbell - 10lb`,
             category: `Fitness`,
             price: `$25.99`,
             bestSeller: false,
             href: "/fitness"
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
        productList.sort((a,b)=>{
            let x = a.category.toLowerCase();
            let y = b.category.toLowerCase();
            if(x < y) {return -1;}
            if(x > y) {return 1;}
            return 0;
        });
        return productList;
    },

    getValentine() {
        const valentine = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product` && product.category === "Valentine's Gift") {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                valentine.push(product);
            }
        });
        return valentine;
    },

    getElectronic() {
        const electronic = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product` && product.category === "Electronics & Accessories") {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                electronic.push(product);
            }
        });
        return electronic;
    },
    getHome() {
        const home = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product` && product.category === "Home") {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                home.push(product);
            }
        });
        return home;
    },
    getFitness() {
        const fitness = [];
        this.fakeDB.forEach((product) => {
            if (product.type === `product` && product.category === "Fitness") {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                fitness.push(product);
            }
        });
        return fitness;
    },
    getSearch(name) {
        const productList = [];
        this.fakeDB.forEach((product) => {
            if(product.type === `product` && product.title.toLowerCase().includes(name.toLowerCase())) {
                product.showBestSeller = (product.bestSeller) ? "show-best-seller" : "hide-best-seller";
                productList.push(product);
            }
        });
        return productList;
    }
}

products.init();
module.exports = products;