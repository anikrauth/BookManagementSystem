//get UI Element
let form = document.querySelector('#form_Data');
let bookList = document.querySelector('#book_list');

//Define class

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static addToBookList(book) {
        let list = document.querySelector('#book_list');
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="delete">X</a></td>
        `
            //console.log(list);
        list.appendChild(row);

    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(messege, className) {
        let createDiv = document.createElement('div');
        createDiv.className = `alert ${className}`;
        createDiv.appendChild(document.createTextNode(messege));
        let container = document.querySelector('.container');
        let form = document.querySelector('#form_Data');
        container.insertBefore(createDiv, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    static deleteFromBook(target) {
        if (target.hasAttribute('href')) {
            if (confirm('Are you sure?')) {
                target.parentElement.parentElement.remove();
                //remove from store
                Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
                UI.showAlert('Remove Book Successfully', 'error');

            }
        }
    }
}

//local stroage Class

class Store {
    static getBooks() { //local store a kono book ase kina check korbe
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);



        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBook() {
        let books = Store.getBooks();
        books.forEach(book => {
            UI.addToBookList(book);
        });
    }


    static removeBook(isbn) {
        let books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}





//addEvent
form.addEventListener('submit', newBook);

bookList.addEventListener('click', removeBook);

document.addEventListener('DOMContentLoaded', Store.displayBook());

//Define Function

function newBook(e) {
    let title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;


    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all the box!', 'error');
    } else {
        let book = new Book(title, author, isbn);
        UI.addToBookList(book);
        UI.clearFields();
        UI.showAlert('Well Done! Successfully Book added!', 'success');
        //local store dunction call
        Store.addBook(book);
    }


    e.preventDefault();
}

//remove boook function
function removeBook(e) {
    UI.deleteFromBook(e.target);


    e.preventDefault();
}