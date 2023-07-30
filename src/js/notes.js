import { nanoid } from 'nanoid';
import initialNotesValues from './notes_db';
import { noteCategoriesIcons } from './notesCategoriesInfo';
import { formatDate } from './formatDate';
import { dateParse } from './dateParse';

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
  summaryNotesTableBodyEl: document.querySelector('.summary-notes-body'),
};

const notesList = [...initialNotesValues];
const archivedNote = [];
let changedNote = {};

// Event listeners
document.addEventListener('DOMContentLoaded', () => renderNotesList(notesList));
document.addEventListener('DOMContentLoaded', () =>
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons)
);
refs.createNoteBtn.addEventListener('click', showModal);
refs.closeModalBtn.addEventListener('click', closeModal);
refs.submitFormBtn.addEventListener('click', addNote);
refs.submitFormBtnEdit.addEventListener('click', changeNote);
refs.showArchiveSelect.addEventListener('change', onShowArchiveSelectChange);

function renderOneNote(note, categories) {
  const categoryForRender = categories.find(
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
  noteDatesTableDataEl.innerText = dateParse(note.content);
  noteDatesTableDataEl.classList.add('table-data-note-dates');
  noteTableRowEl.appendChild(noteDatesTableDataEl);

  const noteEditTableDataEl = document.createElement('td');
  noteEditTableDataEl.innerHTML = `<span class="material-symbols-outlined edit">edit</span>`;
  noteTableRowEl.appendChild(noteEditTableDataEl);

  const noteArchiveTableDataEl = document.createElement('td');
  noteArchiveTableDataEl.innerHTML = `<span class="material-symbols-outlined archive">archive</span>
  <span class="material-symbols-outlined unarchive is-hidden">unarchive</span>`;

  noteTableRowEl.appendChild(noteArchiveTableDataEl);

  const noteDeleteTableDataEl = document.createElement('td');
  noteDeleteTableDataEl.innerHTML = `<span class="material-symbols-outlined delete">delete</span>`;
  noteTableRowEl.appendChild(noteDeleteTableDataEl);

  refs.notesTableBody.appendChild(noteTableRowEl);
}

function renderNotesList(notesArr) {
  refs.notesTableBody.innerHTML = '';
  //  render notes
  notesArr.map(note => {
    renderOneNote(note, noteCategoriesIcons);
  });

  // note remove
  const deleteElList = document.querySelectorAll('.delete');
  deleteElList.forEach(deleteEl => {
    deleteEl.addEventListener('click', () =>
      deleteNote(deleteEl.parentElement.parentElement.id)
    );
  });

  // note edit
  const editElList = document.querySelectorAll('.edit');
  editElList.forEach(editEl => {
    editEl.addEventListener('click', () => prefillFormWithNoteData(editEl));
  });

  // note archivate
  const archiveElList = document.querySelectorAll('.archive');
  const unarchiveElList = document.querySelectorAll('.unarchive');
  archiveElList.forEach(archiveEl => {
    archiveEl.addEventListener('click', e =>
      addToArchive(archiveEl.parentElement.parentElement.id, e)
    );
  });
  unarchiveElList.forEach(unarchiveEl => {
    unarchiveEl.addEventListener('click', e =>
      removeFromArchive(unarchiveEl.parentElement.parentElement.id, e)
    );
  });
}

function renderSummaryNotesInfo(notes, archive, categories) {
  refs.summaryNotesTableBodyEl.innerHTML = '';
  categories.map(category => {
    const noteTableRowEl = document.createElement('tr');
    const noteIconTableDatadEl = document.createElement('td');
    noteIconTableDatadEl.innerHTML = `<span class="material-symbols-outlined category">${category.icon}</span>`;
    noteTableRowEl.appendChild(noteIconTableDatadEl);
    const noteCategoryNameTableDatadEl = document.createElement('td');
    noteCategoryNameTableDatadEl.innerText = `${category.category}`;
    noteTableRowEl.appendChild(noteCategoryNameTableDatadEl);
    const amountActiveNotesPerCategoryEl = document.createElement('td');
    amountActiveNotesPerCategoryEl.innerText = `${
      notes.filter(note => note.category === category.category).length
    }`;
    noteTableRowEl.appendChild(amountActiveNotesPerCategoryEl);
    const amountArchivedNotesPerCategoryEl = document.createElement('td');
    amountArchivedNotesPerCategoryEl.innerText = `${
      archive.filter(note => note.category === category.category).length
    }`;
    noteTableRowEl.appendChild(amountArchivedNotesPerCategoryEl);
    refs.summaryNotesTableBodyEl.appendChild(noteTableRowEl);
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
    archived: false,
  };

  notesList.push(newNote);
  renderNotesList(notesList);
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons);
  closeModal();
}

function deleteNote(id) {
  noteToDeliteIndex = notesList.findIndex(note => note.id === id);
  notesList.splice(noteToDeliteIndex, 1);
  renderNotesList(notesList);
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons);
}

function changeNote(event) {
  event.preventDefault();

  editdNoteIndex = notesList.indexOf(
    notes.find(note => note.id === changedNote.id)
  );

  changedNote.name = refs.noteNameInput.value;
  changedNote.created = refs.noteDateInput.value;
  changedNote.category = refs.noteCategorySelect.value;
  changedNote.content = refs.noteContentInput.value;
  changedNote.dates = dateParse(refs.noteContentInput.value);
  changedNote.archived = false;

  notesList.splice(editdNoteIndex, 1, changedNote);
  renderNotesList(notesList);
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons);
  changedNote = {};
  closeModal();
}

function prefillFormWithNoteData(elem) {
  showModal();
  refs.submitFormBtn.classList.add('is-hidden');
  refs.submitFormBtnEdit.classList.remove('is-hidden');
  id = elem.parentElement.parentElement.id;
  changedNote.id = id;
  refs.noteNameInput.value =
    elem.parentElement.parentElement.children[1].innerText;
  refs.noteDateInput.value = formatDate(
    new Date(Date.parse(elem.parentElement.parentElement.children[2].innerText))
  );
  refs.noteDateInput.setAttribute('disabled', 'disabled');
  refs.noteCategorySelect.value =
    elem.parentElement.parentElement.children[3].innerText;
  refs.noteContentInput.value =
    elem.parentElement.parentElement.children[4].innerText;
}

function addToArchive(id, event) {
  noteToArchivate = notesList.find(note => note.id === id);
  archivedNote.push(noteToArchivate);
  noteToArchivateIndex = notesList.findIndex(note => note.id === id);
  notesList.splice(noteToArchivateIndex, 1);
  renderNotesList(notesList);
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons);
  //   event.target.classList.add('is-hidden');
  //   event.target.nextElementSibling.classList.remove('is-hidden');
}

function removeFromArchive(id, event) {
  noteToUnarchivate = archivedNote.find(note => note.id === id);
  notesList.push(noteToUnarchivate);
  noteToUnarchivateIndex = archivedNote.findIndex(note => note.id === id);
  archivedNote.splice(noteToUnarchivateIndex, 1);
  renderNotesList(archivedNote);
  renderSummaryNotesInfo(notesList, archivedNote, noteCategoriesIcons);
  //   event.target.classList.add('is-hidden');
  //   console.log(event.target.previousElementSibling);
  //   event.target.previousElementSibling.classList.remove('is-hidden');
  const archiveElList = document.querySelectorAll('.archive');
  const unarchiveElList = document.querySelectorAll('.unarchive');
  archiveElList.forEach(elem => elem.classList.add('is-hidden'));
  unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));
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
  switch (event.target.value) {
    case 'archived':
      renderNotesList(archivedNote);
      const archiveElList = document.querySelectorAll('.archive');
      const unarchiveElList = document.querySelectorAll('.unarchive');
      archiveElList.forEach(elem => elem.classList.add('is-hidden'));
      unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));

      break;

    case 'active':
      renderNotesList(notesList);
      break;

    default:
      break;
  }
}
