let objects;
(function(objects){

    class Contact {
        constructor(id = "", name = "", number = "", email ="") {
            this.id = id;
            this.name = name;
            this.number = number;
            this.email = email;
        }
    }

    objects.Contact = Contact;

})(objects || (objects = {}));