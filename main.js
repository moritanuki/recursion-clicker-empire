const config = {
    topPage: document.getElementById("top-page"),
    sidePage: document.getElementById("side-page"),
    eventData: [],
};

class Item{
    constructor(name, type,
                imageUrl,
                price, totalPrice, effect,
                description,
                count, maxCount
    ){
        this.name = name;
        this.type = type;
        this.imageUrl = imageUrl;
        this.price = price;
        this.totalPrice = totalPrice;
        this.effect = effect;
        this.description = description;
        this.count = count;
        this.maxCount = maxCount; // ∞は-1でset
    }

    calculatePrice(amount, operator){
        if(operator == "+"){
            this.price += Number(amount);
        }
        else if(operator == "-"){
            this.price -= Number(amount);
        }
    }

    calculateTotalPrice(amount, operator){
        if(operator == "+"){
            this.totalPrice += Number(amount);
        }
        else if(operator == "-"){
            this.totalPrice -= Number(amount);
        }
    }

    calculateCount(amount, operator){
        if(operator == "+"){
            this.count += Number(amount);
        }
        else if(operator == "-"){
            this.count -= Number(amount);
        }
    }
}

class User{
    constructor(name, age, days, money, burger, purchasedItems = null){
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.burger = burger;
        if(purchasedItems !== null){
            this.purchasedItems = purchasedItems;
        }
        else{
            this.purchasedItems = this.initializedItems();
        }
    }

    // 初期値設定
    initializedItems(){

        const initialItems = {
            "Flip Machine": new Item(
                "Flip Machine", "ability",
                "flip-machine",
                15000, 0, 25,
                "You get 25 dollar for each click on the grill.",
                0, 500
                ),
            "ETF Stock": new Item(
                "ETF Stock", "investment",
                "etf-stock",
                300000, 0, 0.1,
                "Purchases of ETF stocks are added <br> together and 0.1% per second is obtained.",
                0, -1
                ),
            "ETF Bonds": new Item(
                "ETF Bonds", "investment",
                "etf-bonds",
                300000, 0, 0.07,
                "Add the bond ETF purchases <br> together and get 0.07% per second.",
                0, -1
                ),
            "Lemonade Stand": new Item(
                "Lemonade Stand", "realEstate",
                "lemonade-stand",
                30000, 0, 30,
                "Get 30 dollar per second.",
                0, 1000
                ),
            "Ice Cream Truck": new Item(
                "Ice Cream Truck", "realEstate",
                "ice-crem-truck",
                100000, 0, 120,
                "Get 30 dollar per second.",
                0, 500
                ),
            "House": new Item(
                "House", "realEstate",
                "house",
                20000000, 0, 32000,
                "Get 32,000 dollar per second.",
                0, 100
                ),
            "TownHouse": new Item(
                "TownHouse", "realEstate",
                "townhouse",
                40000000, 0, 64000,
                "Get 64,000 dollar per second.",
                0, 100
                ),
            "Mansion": new Item(
                "Mansion", "realEstate",
                "mansion",
                250000000, 0, 500000,
                "Get 500,000 dollar per second.",
                0, 20
                ),
            "Industrial Space": new Item(
                "Industrial Space", "realEstate",
                "inductrial-space",
                1000000000, 0, 2200000,
                "Get 2,200,000 dollar per second.",
                0, 10
                ),
            "Hotel Skyscraper": new Item(
                "Hotel Skyscraper", "realEstate",
                "hotel",
                10000000000, 0, 25000000,
                "Get 25,000,000 dollar per second.",
                0, 5
                ),
            "Bullet-Speed Sky Railway": new Item(
                "Bullet-Speed Sky Railway", "realEstate",
                "bullet-speed-sky-rallway",
                10000000000000, 0, 30000000000,
                "Get 30,000,000,000 dollar per second.",
                0, 1
                ),
        };

        return initialItems;
    }

    increaseDays(){
        this.days++;
        if(this.days % 356 == 0) this.age++;
    }

    calculateMoney(amount, operator){
        if(operator == "+"){
            this.money += Number(amount);
        }
        else if(operator == "-"){
            this.money -= Number(amount);
        }
    }

    increaseBurger(amount){
        let numOfFlipMachine = this.purchasedItems["Flip Machine"].count + 1;
        let increasedAmount = amount * numOfFlipMachine;

        this.burger++;
        this.calculateMoney(increasedAmount, "+");

        return increasedAmount;
    }

    setUserData(){
        let userData = config.eventData.pop();
        userData = JSON.parse(userData);
        // 操作の前に戻したい

        this.age = userData.age;
        this.days = userData.days;
        this.money = userData.money;
        this.burger = userData.burger;
        this.purchasedItems = userData.purchasedItems;
    }
}

class Control{

    static addEventData(data){
        data = JSON.stringify(data);
        config.eventData.push(data);
        
        if(config.eventData.length >= 20) config.eventData.shift();
    }

    // ページ切替
    static displayToggle(erasePage, showPage){
        erasePage.classList.add("d-none");
        showPage.classList.remove("d-none");

        return showPage;
    }

    // sidePageのinenrHTML書き換え
    static rewriteSidePage(erasePage, showPage, htmlString){
        Control.displayToggle(erasePage, showPage);
        erasePage.innerHTML = "";
        showPage.innerHTML = htmlString;

        return htmlString;
    }

    static onMouseEvent(btn){
        btn.addEventListener("mousedown", function(){btn.classList.remove("hover")});
        btn.addEventListener("mouseup", function(){btn.classList.add("hover")});
        btn.addEventListener("touchstart", function(){btn.classList.remove("hover")});
        btn.addEventListener("touchend", function(){btn.classList.add("hover")});
    }

    // -------------------------
    // start program
    // -------------------------
    static startGame(){
        // イベント設定
        const topBtns = config.topPage.querySelectorAll(".top-btn");
        const newBtn = topBtns[0];
        const loadBtn = topBtns[1];
        
        // new game
        newBtn.addEventListener("click", function(){
            Control.rewriteSidePage(
                config.topPage, config.sidePage, View.createEntryPage());

            const startBtn = config.sidePage.querySelector("#start-btn");

            Control.onMouseEvent(startBtn);

            // entry pageのイベント設定
            startBtn.addEventListener("click", function(){
                let userName = config.sidePage.querySelector("input").value;
                if(userName){
                    // User初期設定
                    let user = new User(userName, 20, 0, 5e4, 0);
                    Control.displayMainPage(user);
                    Control.setTimeInterval(user);
                }
            })
        })

        // load game
        loadBtn.addEventListener("click", function(){
            if(localStorage.getItem("userData") == null){
                alert("No user data.");
            }
            else{
                let userData = localStorage.getItem("userData");
                userData = JSON.parse(userData);

                let purchasedItems = {};
                Object.keys(userData.purchasedItems).forEach(key => {
                    let item = userData.purchasedItems[key];
                    purchasedItems[key] = new Item(
                        item.name,
                        item.type,
                        item.imageUrl,
                        item.price,
                        item.totalPrice,
                        item.effect,
                        item.description,
                        item.count,
                        item.maxCount
                    );
                })

                let user = new User(userData.name, userData.age, 
                                    userData.days, userData.money, 
                                    userData.burger, purchasedItems);

                Control.displayMainPage(user);
                Control.setTimeInterval(user);
            }
        })
    }

    static rewriteUserInfo(User){
        let userInfo = config.sidePage.querySelector("#user-info");
        let userMoney = userInfo.querySelector("#user-money");
        let userAge = userInfo.querySelector("#user-age");
        let userDays = userInfo.querySelector("#user-days");

        userMoney.innerHTML = `$${Math.round(User.money).toLocaleString()}`;
        userAge.innerHTML = 
        `${User.age} <small class="text-gray">yrs old</small>`;
        userDays.innerHTML = 
        `
        ${User.days.toLocaleString()} 
        <small class="text-gray">days</small>
        `;
    }

    static rewriteBurger(User){
        let burger = config.sidePage.querySelector("#burger");
        burger.innerHTML = View.createBurger(User);
    }

    static setTimeInterval(User){
        setInterval(function(){
            User.increaseDays();

            // 各itemの効果を出す
            let item = User.purchasedItems;
            Object.keys(item).forEach(key => {
                if(item[key].type == "investment"){
                    User.calculateMoney((item[key].effect / 100) * item[key].totalPrice, "+");
                }
                else if(item[key].type == "realEstate"){
                    User.calculateMoney(item[key].effect * item[key].count, "+");
                }
            });

            Control.rewriteUserInfo(User);
        }, 1000);
    }

    static getPurchasePrice(price, count){
        return price * count;
    }

    static setDescriptionEvent(User, item){
        // description pageのイベント設定
        let input = config.sidePage.querySelector("input");
        let backBtn = config.sidePage.querySelector("#back-btn");
        let purchaseBtn = config.sidePage.querySelector("#purchase-btn");

        input.addEventListener("change", function(){
            let price = config.sidePage.querySelector(".price");
            price.innerHTML = 
            `
            <small class="text-gray">Price:</small> 
            $${Control.getPurchasePrice(item.price, input.value).toLocaleString()}
            `;
        })

        Control.onMouseEvent(backBtn);
        Control.onMouseEvent(purchaseBtn);

        backBtn.addEventListener("click", function(){
            Control.displayMainPage(User);
        })

        purchaseBtn.addEventListener("click", function(){
            if(item.maxCount != -1 && item.maxCount <= item.count){
                alert(
                    `The maximum number of items has been reached. The ${item.name} cannot be purchased.
                    `
                );
            }
            else{
                Control.addEventData(User);
                let purchasePrice = Control.getPurchasePrice(item.price, input.value);
                if(User.money >= purchasePrice){
                    User.calculateMoney(purchasePrice, "-");
                    item.calculateTotalPrice(purchasePrice, "+");
                    if(item.name == "ETF Stock"){
                        const increment = 0.1;
                        item.calculatePrice(item.price * increment, "+");

                        let menu = config.sidePage.querySelector(".menu");

                        Control.rewriteSidePage(
                            menu, menu, View.createMenu(User, item));
                        
                        // description pageのイベント設定
                        Control.setDescriptionEvent(User, item);
                    }
                    else if(item.name == "Flip Machine"){
                        let burger = config.sidePage.querySelector(".burger");
                        burger.querySelector("img").src = "images/powerup-burger-left.png";
                    }
                    item.calculateCount(input.value, "+");
                    Control.rewriteUserInfo(User);
                }
                else{
                    let shortage = purchasePrice - User.money;
                    
                    alert(`${User.name} is $${shortage.toLocaleString()} short on cash.`);
                }
            }
        })
    }

    // gameのmain画面を表示する
    static displayMainPage(User){
        Control.rewriteSidePage(
            config.topPage, config.sidePage, View.createMainPage(User, "menuBtns"));

        let icons = config.sidePage.querySelectorAll(".icon");
        let burger = config.sidePage.querySelector(".burger");

        icons.forEach(icon => Control.onMouseEvent(icon));
        Control.onMouseEvent(burger);

        // clickイベント設定
        let saveBtn = config.sidePage.querySelector("#save");
        saveBtn.addEventListener("click", function(){
            // save機能
            let jsonEncoded = JSON.stringify(User);
            localStorage.setItem("userData", jsonEncoded);
        })

        let redoBtn = config.sidePage.querySelector("#redo");
        redoBtn.addEventListener("click", function(){
            // 表示画面はメニュー選択に戻る
            User.setUserData();

            Control.displayMainPage(User);
            Control.setTimeInterval(User);
        })

        burger.addEventListener(("click"), function(){
            Control.addEventData(User);
            User.increaseBurger(User.purchasedItems["Flip Machine"].effect);
            Control.rewriteUserInfo(User);
            Control.rewriteBurger(User);
        })

        let btns = config.sidePage.querySelectorAll(".menu-btn");

        btns.forEach(btn => {
            Control.onMouseEvent(btn);

            btn.addEventListener("click", function(){
                let item = User.purchasedItems[btn.querySelector(".title").innerHTML];
                if(item.maxCount != -1 && item.maxCount <= item.count){
                    alert(
                        `The maximum number of items has been reached. The ${item.name} cannot be purchased.
                        `
                    );
                }
                else{
                    let menu = config.sidePage.querySelector(".menu");

                    Control.rewriteSidePage(
                        menu, menu, View.createMenu(User, item));
                    
                    // description pageのイベント設定
                    Control.setDescriptionEvent(User, item);
                }
            })
        })
    }

    static getEffectString(item){
        let effectString = "";

            if(item.type == "ability"){
                effectString = `+ $${item.effect} / click`;
            }
            else if(item.type == "investment"){
                let effect = (item.effect / 100) * (item.price * (item.count + 1));

                if(item.name == "ETF Stock"){
                    effect = (item.effect / 100) * ((item.totalPrice + item.price) * (item.count + 1));
                }
                effect = Math.round(effect);

                effectString = `+ $${effect} / sec`;
            }
            else{
                effectString = `+ $${item.effect} / sec`;
            }
        
        return effectString;
    }

    static getmaxLenOfMaxCount(User){
        let maxLen = 0;
        Object.keys(User.purchasedItems).map(key => {
            let len = String(User.purchasedItems[key].maxCount).length;
            if(maxLen <= len) maxLen = len;
        })
        return maxLen;
    }

    static getMaxCountString(User, item){
        let maxLen = Control.getmaxLenOfMaxCount(User);
        let maxCountString = String(item.maxCount);

        if(item.maxCount == -1){
            maxCountString = "&nbsp;".repeat(maxLen - 2) + "∞";
        }
        else if(maxCountString.length != maxLen){
            let count = maxLen - maxCountString.length;
            maxCountString = "&nbsp;".repeat(count) + maxCountString;
        }

        return maxCountString;
    }
}

class View{

    // -------------------------
    // Entry page view
    // -------------------------

    static createEntryPage(){

        let htmlString = 
        `
        <!-- Entry Page -->
        <section id="entry-page" class="m-5">
            <!-- title -->
            <section class="text-center my-5">
                <h1>User Profile Entry</h1>
            </section>
            <!-- entry form -->
            <section class="my-4">
                <div class="row align-items-center">
                    <div class="col-lg-3 col-12">
                        <label for="user-name">User Name</label>
                    </div>
                    <div class="col-lg-9 col-12">
                        <input id="user-name" class="form-control input-box" type="text" placeholder="your name" required>
                    </div>
                </div>
                <div class="my-5 text-center">
                    <button id="start-btn" class="btn btn-lg text-gray bg-orange hover">Game Start</button>
                </div>
            </section>
        </section>
        `;

        return htmlString;
    }

    // -------------------------
    // Main page view
    // -------------------------

    static createUserInfo(User){
        let userMoney = Math.round(User.money);
        let htmlString = 
        `
        <section class="col-lg-9 col-12">
            <p class="fs-3">${User.name}
                <small class="fs-5 text-gray">'s money</small>
            </p>
            <p id="user-money" class="fs-1 border-bottom text-end">$${userMoney.toLocaleString()}</p>
        </section>

        <section class="col-lg-3 col-12 text-end row p-0 m-0">
            <p id="user-age" class="fs-5 col-lg-12 col-6">${User.age} 
                <small class="text-gray">yrs old</small>
            </p>
            <p id="user-days" class="fs-5 col-lg-12 col-6">${User.days.toLocaleString()} 
                <small class="text-gray">days</small>
            </p>
        </section>
        `;

        return htmlString;
    }

    static createBurger(User){
        let htmlString = 
        `
        <p class="fs-3 text-end">${User.burger.toLocaleString()} 
            <small class="fs-5 text-gray">Burgers</small>
        </p>
        `;

        return htmlString;
    }

    static createMenuBtns(User){
        let htmlString = "";

        Object.keys(User.purchasedItems).map(key => {
            let item = User.purchasedItems[key];
            let effectString = Control.getEffectString(item);
            let maxCountString = Control.getMaxCountString(User, item);
            let itemPrice = Math.round(item.price);

            htmlString +=
            `
            <div class="menu-btn hover h-100">
                <button class="btn text-offwhite w-100 h-100">
                    <section class="row align-items-center h-100">
                        <!-- image -->
                        <section class="col-xl-2 col-lg-4 col-sm-3 col-3 h-100">
                            <img class="img-fluid h-100" src="images/${item.imageUrl}.png" alt="${item.imageUrl}">
                        </section>
                        <!-- contents -->
                        <section class="col-xl-7 col-lg-6 col-7 text-start h-100">
                            <!-- title -->
                            <div class="">
                                <p class="fs-5 title">${item.name}</p>
                            </div>
                            <!-- detail -->
                            <div class="row p-0 h-50 justify-content-between">
                                <p class="col-6 info">$${itemPrice.toLocaleString()}</p>
                                <p class="col-6 text-orange info">${effectString}</p>
                            </div>
                        </section>
                        <!-- counter -->
                        <section class="col-2 text-end">
                            <p class="fs-1">${item.count} <small class="fs-6 text-gray">/ ${maxCountString}</small></p>
                        </section>
                    </section>
                </button>
            </div>
            `;
        })

        return htmlString;
    }

    static createDescription(User, item){

        let max = item.maxCount == -1 ? Infinity : item.maxCount;
        let maxCountString = Control.getMaxCountString(User, item);
        let htmlString = 
        `
        <section class="description" style="background-image: url(images/${item.imageUrl}.png)">
            <section class="mb-4">
                <p class="fs-2">${item.name}</p>
                <p class="fs-5"><small class="text-gray">Max Purchses:</small> ${maxCountString}</p>
                <p class="fs-5 price"><small class="text-gray">Price:</small> $${Math.round(item.price).toLocaleString()}</p>
                <p class="fs-6">${item.description}</p>
            </section>

            <section>
                <div>
                    <label for="purchase" class="text-wraps">How many would you like to purchase ?</label>
                    <input id="purchase" class="form-control input-box text-end" type="number" min="1" max="${max - item.count}" value="1" required>
                </div>

                <div class="row text-center my-3">
                    <div class="col-6">
                        <button id="back-btn" class="btn btn-lg bd-orange text-orange px-md-5 px-2 hover">Go Back</button>
                    </div>
                    <div class="col-6">
                        <button id="purchase-btn" class="btn btn-lg text-gray bg-orange px-md-5 px-2 hover">Purchase</button>
                    </div>
                </div>
            </section>
        </section>
        `;

        return htmlString;
    }

    static createMenu(User, item){
        let htmlString = "";

        if(item == "menuBtns"){
            htmlString = 
            `
            <section id="menu-btns" class="h-100">
                ${View.createMenuBtns(User)}
            </section>
            `;
        }
        else{
            htmlString = 
            `
            <section id="description">
                ${View.createDescription(User, item)}
            </section>
            `;
        }

        return htmlString;
    }

    static createMainPage(User, boxItem){

        let userInfo = View.createUserInfo(User);
        let burger = View.createBurger(User);
        let menu = View.createMenu(User, boxItem);

        let htmlString = 
        `
        <!-- ***** Game page ***** -->
        <section>
            <!-- icons -->
            <section class="mt-2 mb-4">
                    <button id="save" class="btn p-0 hover icon">
                        <img src="images/save.png" width="30" alt="save">
                    </button>
                    <button id="redo" class="btn p-0 hover icon">
                        <img src="images/redo.png" width="30" alt="redo">
                    </button>
            </section>

            <!-- main section -->
            <section class="mx-lg-3 mb-md-5 m-2">

                <!-- user info -->
                <section id="user-info" class="row align-items-end mb-4">
                ${userInfo}
                </section>

                <!-- operator section -->
                <section class="row p-0 justify-content-center">

                    <!-- burger -->
                    <section class="col-4 mb-3">
                        <!-- display -->
                        <section id="burger" class="me-4">
                        ${burger}
                        </section>
                        <!-- image -->
                        <section class="burger m-auto hover">
                            <div>
                                <img class="img-fluid" src="images/burger.png" alt="burger">
                            </div>
                        </section>
                    </section>

                    <!-- menu -->
                    <section class="col-xl-8 col-12 menu">
                        <!-- button -->
                        <!-- description -->
                        ${menu}
                    </section>
                </section>

            </section>
        </section>
        `;

        return htmlString;
    }
}

Control.startGame();