import { nanoid } from 'nanoid';
import { notes } from './notes_db';
import { noteCategoriesIcons } from './notesCategoriesInfo';

// Selectors
const refs = {
  notesTableBody: document.querySelector('.notes-body'),
  createNoteBtn: document.querySelector('.create-notes-button'),
  closeModalBtn: document.querySelector('.button-close'),
  formEl: document.querySelector('.create-note-form'),
  submitFormBtn: document.querySelector('.button-add-note'),
  submitFormBtnEdit: document.querySelector('.button-edit-note'),
  backdropNoteEl: document.querySelector('.backdrop-note'),
  noteNameInput: document.querySelector('#note-name'),
  noteDateInput: document.querySelector('#note-date'),
  noteContentInput: document.querySelector('#note-content'),
  noteCategorySelect: document.querySelector('#note-category'),
  showArchiveSelect: document.querySelector('#show-archive'),
};

let changedNote = {};
let archivedNote = [];
console.log(changedNote);

// Event listeners
document.addEventListener('DOMContentLoaded', () => renderNotesList(notes));
refs.createNoteBtn.addEventListener('click', showModal);
refs.closeModalBtn.addEventListener('click', closeModal);
refs.submitFormBtn.addEventListener('click', addNote);
refs.submitFormBtnEdit.addEventListener('click', changeNote);
refs.showArchiveSelect.addEventListener('change', onShowArchiveSelectChange);

function renderOneNote(note) {
  const categoryForRender = noteCategoriesIcons.find(
    item => item.category === note.category
  );
  const noteTableRowEl = document.createElement('tr');
  noteTableRowEl.id = note.id;

  const noteIconTableDatadEl = document.createElement('td');
  noteIconTableDatadEl.innerHTML = `<span class="material-symbols-outlined category">${categoryForRender.icon}</span>`;
  noteTableRowEl.appendChild(noteIconTableDatadEl);

  const noteNameTableDataEl = document.createElement('td');
  noteNameTableDataEl.innerText = note.name;
  noteNameTableDataEl.classList.add('table-data-note-name');
  noteTableRowEl.appendChild(noteNameTableDataEl);

  const noteCreatedTableDataEl = document.createElement('td');
  noteCreatedTableDataEl.innerText = note.created;
  noteTableRowEl.appendChild(noteCreatedTableDataEl);

  const noteCategoryTableDataEl = document.createElement('td');
  noteCategoryTableDataEl.innerText = note.category;
  noteCategoryTableDataEl.classList.add('table-data-note-category');
  noteTableRowEl.appendChild(noteCategoryTableDataEl);

  const noteContentTableDataEl = document.createElement('td');
  noteContentTableDataEl.innerText = note.content;
  noteContentTableDataEl.classList.add('table-data-note-content');
  noteTableRowEl.appendChild(noteContentTableDataEl);

  const noteDatesTableDataEl = document.createElement('td');
  noteDatesTableDataEl.innerText = note.dates;
  noteDatesTableDataEl.classList.add('table-data-note-dates');
  noteTableRowEl.appendChild(noteDatesTableDataEl);

  const noteEditTableDataEl = document.createElement('td');
  noteEditTableDataEl.innerHTML = `<span class="material-symbols-outlined edit">edit</span>`;
  noteTableRowEl.appendChild(noteEditTableDataEl);

  const noteArchiveTableDataEl = document.createElement('td');
  noteArchiveTableDataEl.innerHTML = `<span class="material-symbols-outlined archive">archive</span>`;
  noteTableRowEl.appendChild(noteArchiveTableDataEl);

  const noteDeleteTableDataEl = document.createElement('td');
  noteDeleteTableDataEl.innerHTML = `<span class="material-symbols-outlined delete">delete</span>`;
  noteTableRowEl.appendChild(noteDeleteTableDataEl);

  refs.notesTableBody.appendChild(noteTableRowEl);
}

function renderNotesList(notesArr) {
  refs.notesTableBody.innerHTML = '';
  // рендер notes з масиву
  console.log(notesArr);
  notesArr.map(note => {
    renderOneNote(note);
  });

  // видалення нотатки
  const deleteElList = document.querySelectorAll('.delete');
  deleteElList.forEach(deleteEl => {
    deleteEl.addEventListener('click', () =>
      deleteNote(deleteEl.parentElement.parentElement.id)
    );
  });

  // редагування нотатки
  const editElList = document.querySelectorAll('.edit');
  editElList.forEach(editEl => {
    editEl.addEventListener('click', () => prefillFormWithNoteData(editEl));
  });

  // архівація нотаток
  const archiveElList = document.querySelectorAll('.archive');
  archiveElList.forEach(archiveEl => {
    archiveEl.addEventListener('click', () =>
      addToArchive(archiveEl.parentElement.parentElement.id)
    );
  });
}

function addNote(event) {
  event.preventDefault();
  const formData = new FormData(refs.formEl);
  if (refs.noteNameInput.value === '') {
    alert('Please enter note name');
    return;
  }
  const newNote = {
    id: nanoid(),
    name: formData.get('note-name'),
    created: formData.get('note-date'),
    category: formData.get('note-category'),
    content: formData.get('note-content'),
    dates: '',
    archived: false,
  };

  notes.push(newNote);
  renderNotesList(notes);
  closeModal();
}

function deleteNote(id) {
  noteToDeliteIndex = notes.findIndex(note => note.id === id);
  notes.splice(noteToDeliteIndex, 1);
  renderNotesList(notes);
}

function changeNote(event) {
  event.preventDefault();

  editdNoteIndex = notes.indexOf(
    notes.find(note => note.id === changedNote.id)
  );

  changedNote.name = refs.noteNameInput.value;
  changedNote.created = refs.noteDateInput.value;
  changedNote.category = refs.noteCategorySelect.value;
  changedNote.content = refs.noteContentInput.value;
  changedNote.dates = '';
  changedNote.archived = false;

  console.log(changedNote);

  notes.splice(editdNoteIndex, 1, changedNote);
  renderNotesList(notes);
  changedNote = {};
  closeModal();
}

function prefillFormWithNoteData(elem) {
  showModal();
  refs.submitFormBtn.classList.add('is-hidden');
  refs.submitFormBtnEdit.classList.remove('is-hidden');
  id = elem.parentElement.parentElement.id;
  changedNote.id = id;
  // editedTdValues = elem.parentElement.parentElement.children;
  refs.noteNameInput.value =
    elem.parentElement.parentElement.children[1].innerText;
  //   refs.noteDateInput.value = Date.parse(editNote.created);
  refs.noteDateInput.setAttribute('disabled', 'disabled');
  refs.noteCategorySelect.value =
    elem.parentElement.parentElement.children[3].innerText;
  refs.noteContentInput.value =
    elem.parentElement.parentElement.children[4].innerText;
}

function addToArchive(id) {
  noteToArchivate = notes.find(note => note.id === id);
  archivedNote.push(noteToArchivate);
  console.log(archivedNote);
  noteToArchivateIndex = notes.findIndex(note => note.id === id);
  notes.splice(noteToArchivateIndex, 1);
  renderNotesList(notes);
}

function showModal() {
  refs.backdropNoteEl.classList.toggle('is-hidden');
}

function closeModal() {
  refs.backdropNoteEl.classList.toggle('is-hidden');
  refs.formEl.reset();
  refs.noteDateInput.removeAttribute('disabled', 'false');
  refs.submitFormBtn.classList.toggle('is-hidden');
  refs.submitFormBtnEdit.classList.toggle('is-hidden');
}

function onShowArchiveSelectChange(event) {
  if (event.target.value === 'archived') {
    renderNotesList(archivedNote);
  }
  switch (event.target.value) {
    case 'archived':
      renderNotesList(archivedNote);
      break;

    case 'active':
      renderNotesList(notes);
      break;

    default:
      break;
  }
}
