// core module - IIFE
(function() {
  // App variables
  let XHR;
  let hash;
  let addressBook;
  let Contacts;


  function insertHTML(sourceURL, destTag) {
    let target = document.getElementsByTagName(destTag)[0];
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
      addressBook.Contacts.forEach(contact => {
        let newContact = new objects.Contact(contact.name, contact.number, contact.email);
        console.log(newContact);
        Contacts.push(newContact);
      });

      console.log(Contacts);
    })

    
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
