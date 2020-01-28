document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector("#searchBar");
    const output = document.querySelector("#reposContainer");
    const baseUrl = "https://api.github.com/search/repositories";
    const message = document.querySelector("#message");


    //makes the request
    const searchRepos = (term) => {
        if(term === ""){
            console.log("not defined");
            return Rx.Observable.of(null);
        }else{

            return Rx.Observable.create( observer => {
                fetch(baseUrl + `?q=${term}`)
                .then(res =>res.json())
                .then(repos => {
                    observer.next(repos);
                    observer.complete();
                })
                .catch(err => console.log(err));
            });
        }
    }

    Rx.Observable.fromEvent(searchBar, "input")
    .map((e) => {
        console.log(e.target.value);
        return e.target.value;
    })
    .debounceTime(400) //wait for 400ms 
    .distinctUntilChanged() //check if the term is diff
    .switchMap(term => {
        return searchRepos(term);
    })
    .subscribe( repos => {
        console.log(repos);

        if(repos != null){
            message.style.display = "none";
            createChildren(repos["items"]);
        }else{
            output.innerHTML = "";
            message.style.display = "";
        }
    });

    const createChildren = (arr) => {
        output.innerHTML = "";

        arr.map( item => {
            let div = document.createElement("div");
            div.classList.add("item");
            let img = document.createElement("img");
            img.setAttribute("src", item.owner.avatar_url);
            img.setAttribute("loading", "lazy");
            let repoTitle = document.createElement("p");
            let repoTitleNode = document.createTextNode(item.full_name);
            repoTitle.appendChild(repoTitleNode);

            let goButton = document.createElement("a");
            goButton.setAttribute("href", item.html_url);
            goButton.setAttribute("target", "_blank");
            let goButtonNode = document.createTextNode("Check Repo");
            goButton.appendChild(goButtonNode);

            div.appendChild(img);
            div.appendChild(repoTitle);
            div.appendChild(goButton);
            output.appendChild(div);
        })



    }



})