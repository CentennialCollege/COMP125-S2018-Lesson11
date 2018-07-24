let objects;
(function(objects){

    class Contact {
        constructor(name = "", number = "", email ="") {
            this.name = name;
            this.number = number;
            this.email = email;
        }
    }

    objects.Contact = Contact;

})(objects || (objects = {}));