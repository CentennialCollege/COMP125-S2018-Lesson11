// core module - IIFE
(function() {
  // App variables
  let XHR;
  let hash;
  let addressBook;
  let Contacts;


  /**
   * This function inserts HTML from a file or other location
   * into the specificied tag / element that exists on the 
   * index.html page
   *
   * @param {string} sourceURL
   * @param {string} destTag
   */
  function insertHTML(sourceURL, destTag) {
   //let target = document.getElementsByTagName(destTag)[0];
   //let target = document.querySelectorAll(destTag)[0];
  //let target = $(destTag)[0]; -> jQuery Version

   let target = document.querySelector(destTag);

    XHR = new XMLHttpRequest();
    XHR.addEventListener("readystatechange", function(){
      if(this.status === 200) {
        if(this.readyState === 4)  {
          target.innerHTML = this.responseText;
          setActiveNavLink();
        }
      }
    });
    XHR.open("GET", sourceURL);
    XHR.send();
  }

  /**
   * This function loads a JSON file and dumps it into the addressbook container
   *
   */
  function loadJSON() {
    XHR = new XMLHttpRequest();
    XHR.addEventListener("readystatechange", function(){
      if(this.status === 200) {
        if(this.readyState === 4)  {
          addressBook = JSON.parse(this.responseText);
        }
      }
    });
    XHR.open("GET", "/data.json");
    XHR.send();
  }


  /**
   * This function is used for Intialization
   */
  function Start() {
    console.log(
      `%c App Initializing...`,
      "font-weight: bold; font-size: 20px;"
    );

    Contacts = [];

    Main();
  }

  /**
   * This function is the where the main functionality for our
   * web app is happening
   */
  function Main() {
    console.log(`%c App Started...`, "font-weight: bold; font-size: 20px;");
    
    insertHTML("/Views/partials/header.html", "header");

    setPageContent("/Views/content/home.html");

    insertHTML("/Views/partials/footer.html", "footer");

    loadJSON();

    XHR.addEventListener("load", function(){
      let tbody = document.querySelector("tbody");
      let counter = 0;

      addressBook.Contacts.forEach(contact => {
        let newContact = new objects.Contact(
          contact.name, contact.number, contact.email);
        Contacts.push(newContact);
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = counter;
        tr.appendChild(th);

          let td1 = document.createElement("td");
          td1.textContent = contact.name;
          tr.appendChild(td1);
          let td2 = document.createElement("td");
          td2.textContent = contact.number;
          tr.appendChild(td2);
          let td3 = document.createElement("td");
          td3.textContent = contact.email;
          tr.appendChild(td3);
          
          tbody.appendChild(tr);
      });
  
    });

    

  }

  function setPageContent(url) {
    insertHTML(url, "main");
  }

  function Route() {
    // sanitize the url - remove the #
    hash = location.hash.slice(1);

    document.title = hash;

    // change the URL of my page
    history.pushState("", document.title, "/" + hash.toLowerCase() + "/");

    setPageContent("/Views/content/" + hash.toLowerCase() + ".html")
  }

  function setActiveNavLink() {
    // clears the "active" class from each of the list items in the navigation
    document.querySelectorAll("li.nav-item").forEach(function(listItem){
      listItem.setAttribute("class", "nav-item");
    });

    // add the "active" class to the class attribute of the appropriate list item
    document.getElementById(document.title).classList.add("active");


  }

  window.addEventListener("load", Start);

  window.addEventListener("hashchange", Route);
})();
