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
   let target = document.querySelector(destTag);

    XHR = new XMLHttpRequest();
    XHR.addEventListener("readystatechange", function(){
      if(this.status === 200) {
        if(this.readyState === 4)  {
          target.innerHTML = this.responseText;
          setActiveNavLink();

          if(document.title == "Contact") {
            loadJSON();
          }
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
          console.log("Data finished loading");

          displayData();
        }
      }
    });
    XHR.open("GET", "/data.json");
    XHR.send();
  }

  function insertDataToSession(data) {

    sessionStorage.setItem(data.id, JSON.stringify(data)); 
  }

  function insertDataToLocalStorage(data) {
    localStorage.setItem(data.id, JSON.stringify(data));
  }

  function displayData() {

      let tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      let counter = 0;

      addressBook.Contacts.forEach(contact => {
        let newContact = new objects.Contact(
          contact.id, contact.name, contact.number, contact.email);
        Contacts.push(newContact);

        insertDataToSession(contact);

        insertDataToLocalStorage(contact);

        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = contact.id;
        tr.appendChild(th);

        // loop through each property of the contact object
        // then add the property value to the column
        for (const property in contact) {
          if (contact.hasOwnProperty(property)) {           
            if(property != "id") {
              let td = document.createElement("td");
              td.textContent = contact[property];
              tr.appendChild(td);
            }
          }
        }
        
        let editTd = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.setAttribute("class", "btn btn-primary btn-sm");
        editButton.setAttribute("data-id", contact.id);
        editButton.innerHTML = "<i class='fa fa-edit fa-lg'></i> Edit";
        editTd.appendChild(editButton);
        tr.appendChild(editTd);

        editButton.addEventListener("click", (event)=>{
          console.log(`Editing Item: ${event.currentTarget.getAttribute("data-id")}`);
        });


        let deleteTd = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn btn-danger btn-sm");
        deleteButton.setAttribute("data-id", contact.id);
        deleteButton.innerHTML = "<i class='fa fa-trash fa-lg'></i> Delete";
        deleteTd.appendChild(deleteButton);
        tr.appendChild(deleteTd);

        deleteButton.addEventListener("click", (event)=>{
          console.log(`Deleting Item: ${event.currentTarget.getAttribute("data-id")}`);
        });



          tbody.appendChild(tr);
          counter++;
      });
  
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
