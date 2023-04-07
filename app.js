//UI Vars
let $ = document;
let container = $.querySelector(".container");
let form = $.querySelector("#form-list");
let title = $.querySelector("#title");
let author = $.querySelector("#author");
let isbn = $.querySelector("#isbn");
let submit = $.querySelector("#submit");
let book_List = $.querySelector("#book-list");

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class BookList {
  static addBookToList(book) {
    let tr = $.createElement("tr");
    tr.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a class="delete" href="#">X</a></td>
		`;

    book_List.appendChild(tr);
    Store.addBook(book);
		BookList.showMessage("Book Added...", "success");
  }

  static deleteBookFromList(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
			Store.removeBook(target.parentElement.previousElementSibling.textContent)
			BookList.showMessage("Book deleted...", "success");
    }
  }

  static showMessage(msg, alertClass) {
    let alertDiv = document.createElement("div");
    alertDiv.textContent = msg;
    alertDiv.className = `alert ${alertClass}`;
    container.insertBefore(alertDiv, form);

    setTimeout(() => {
      $.querySelector(".alert").remove();
    }, 2000);
  }

  static clearInput() {
    title.value = "";
    author.value = "";
    isbn.value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static showBooks() {
    let book = Store.getBooks();
    book.forEach((book) => {
      let tr = $.createElement("tr");
      tr.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a class="delete" href="#">X</a></td>
		`;

      book_List.appendChild(tr);
    });
  }

	static removeBook(isbn){
		let books = Store.getBooks();
		books.forEach((book,index)=>{
			if (isbn === book.isbn) {
				books.splice(index,1)
			}
		})
		localStorage.setItem("books",JSON.stringify(books))
	}
}

$.addEventListener("DOMContentLoaded",()=>{
	Store.showBooks();
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (title.value === "" || author.value === "" || isbn.value === "") {
    BookList.showMessage("Please fill the following fields...", "error");
  } else {
    let book = new Book(title.value, author.value, isbn.value);
    BookList.addBookToList(book);
    BookList.clearInput();
  }
});

book_List.addEventListener("click", (e) => {
  BookList.deleteBookFromList(e.target);
});
