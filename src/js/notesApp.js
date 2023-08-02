import { nanoid } from 'nanoid';
import initialNotesValues from './notes_db';
import { formatDate } from './formatDate';
import { dateParse } from './dateParse';

function NoteApp(initialNotes) {
  const categoriesInfo = [
    { category: 'Task', icon: 'shopping_cart' },
    { category: 'Random Thought', icon: 'psychology' },
    { category: 'Idea', icon: 'lightbulb' },
    { category: 'Quote', icon: 'format_quote' },
  ];
  const notesList = [...initialNotes];
  const archivedNote = [];
  let changedNote = {};

  // Selectors
  const refs = {
    notesTableBody: document.querySelector('.notes-body'),
    createNoteBtn: document.querySelector('.create-notes-button'),
    formEl: document.querySelector('.create-note-form'),
    backdropNoteEl: document.querySelector('.backdrop-note'),
    noteNameInput: document.querySelector('#note-name'),
    noteDateInput: document.querySelector('#note-date'),
    noteContentInput: document.querySelector('#note-content'),
    noteCategorySelect: document.querySelector('#note-category'),
    showArchiveSelect: document.querySelector('#show-archive'),
    summaryNotesTableBodyEl: document.querySelector('.summary-notes-body'),
    submitFormBtnEdit: document.querySelector('.button-edit-note'),
    submitFormBtn: document.querySelector('.button-add-note'),
    closeModalBtn: document.querySelector('.button-close'),
  };

  // Event listeners
  document.addEventListener('DOMContentLoaded', function () {
    renderNotesList(notesList, categoriesInfo);
    renderSummaryNotesInfo(notesList, archivedNote, categoriesInfo);
  });
  refs.submitFormBtn.addEventListener('click', e =>
    addNote(e, notesList, archivedNote, categoriesInfo)
  );
  refs.notesTableBody.addEventListener('click', onСontrolsClick);
  refs.submitFormBtnEdit.addEventListener('click', e =>
    changeNote(e, notesList, changedNote, archivedNote, categoriesInfo)
  );
  refs.showArchiveSelect.addEventListener('change', e =>
    onShowArchiveSelectChange(e, notesList, archivedNote, categoriesInfo)
  );
  refs.closeModalBtn.addEventListener('click', closeModal);
  refs.createNoteBtn.addEventListener('click', showModal);

  function addNote(event, notes, archive, categories) {
    event.preventDefault();

    const formData = new FormData(refs.formEl);
    if (refs.noteNameInput.value === '') {
      alert('Please enter note name');
      return;
    }
    if (refs.noteContentInput.value === '') {
      alert('Please enter some note content');
      return;
    }
    if (refs.noteDateInput.value === '') {
      alert('Please enter note date');
      return;
    }
    const newNote = {
      id: nanoid(),
      name: formData.get('note-name'),
      created: formData.get('note-date'),
      category: formData.get('note-category'),
      content: formData.get('note-content'),
    };

    notes.push(newNote);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archive, categories);
    closeModal();
  }

  function onСontrolsClick(e) {
    if (e.target.classList.contains('edit')) {
      prefillFormWithNoteData(e.target, changedNote);
    } else if (e.target.classList.contains('archive')) {
      addToArchive(
        e.target.parentElement.parentElement.id,
        notesList,
        archivedNote,
        categoriesInfo
      );
    } else if (e.target.classList.contains('unarchive')) {
      removeFromArchive(
        e.target.parentElement.parentElement.id,
        notesList,
        archivedNote,
        categoriesInfo
      );
    } else if (e.target.classList.contains('delete')) {
      deleteNote(
        e.target.parentElement.parentElement.id,
        notesList,
        archivedNote,
        categoriesInfo
      );
    }
  }

  function prefillFormWithNoteData(elem, noteToEdit) {
    showModal();
    refs.submitFormBtn.classList.add('is-hidden');
    refs.submitFormBtnEdit.classList.remove('is-hidden');
    noteToEdit.id = elem.parentElement.parentElement.id;
    refs.noteNameInput.value =
      elem.parentElement.parentElement.children[1].innerText;
    refs.noteDateInput.value = formatDate(
      new Date(
        Date.parse(elem.parentElement.parentElement.children[2].innerText)
      )
    );
    refs.noteDateInput.setAttribute('disabled', 'disabled');
    refs.noteCategorySelect.value =
      elem.parentElement.parentElement.children[3].innerText;
    refs.noteContentInput.value =
      elem.parentElement.parentElement.children[4].innerText;
  }

  function changeNote(event, notes, noteToEdit, archive, categories) {
    event.preventDefault();

    const editdNoteIndex = notes.indexOf(
      notes.find(note => note.id === noteToEdit.id)
    );

    noteToEdit.name = refs.noteNameInput.value;
    noteToEdit.created = refs.noteDateInput.value;
    noteToEdit.category = refs.noteCategorySelect.value;
    noteToEdit.content = refs.noteContentInput.value;
    noteToEdit.dates = dateParse(refs.noteContentInput.value);

    notes.splice(editdNoteIndex, 1, noteToEdit);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archive, categories);
    noteToEdit = {};
    closeModal();
  }

  function addToArchive(id, notes, archive, categories) {
    const noteToArchivate = notes.find(note => note.id === id);
    archive.push(noteToArchivate);
    const noteToArchivateIndex = notes.findIndex(note => note.id === id);
    notes.splice(noteToArchivateIndex, 1);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archive, categories);
  }

  function removeFromArchive(id, notes, archive, categories) {
    const noteToUnarchivate = archive.find(note => note.id === id);
    notes.push(noteToUnarchivate);
    const noteToUnarchivateIndex = archive.findIndex(note => note.id === id);
    archive.splice(noteToUnarchivateIndex, 1);
    renderNotesList(archive, categories);
    renderSummaryNotesInfo(notes, archive, categories);
    const archiveElList = document.querySelectorAll('.archive');
    const unarchiveElList = document.querySelectorAll('.unarchive');
    archiveElList.forEach(elem => elem.classList.add('is-hidden'));
    unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));
    const editElList = document.querySelectorAll('.edit');
    editElList.forEach(elem => elem.classList.add('is-hidden'));
  }

  function deleteNote(id, notes, archive, categories) {
    const isActiveNote = !!notes.find(note => note.id === id);

    if (isActiveNote) {
      const noteToDeliteIndex = notes.findIndex(note => note.id === id);
      notes.splice(noteToDeliteIndex, 1);
      renderNotesList(notes, categories);
      renderSummaryNotesInfo(notes, archive, categories);
      return;
    }
    const noteToDeliteIndex = archive.findIndex(note => note.id === id);
    archive.splice(noteToDeliteIndex, 1);
    renderNotesList(archive, categories);
    renderSummaryNotesInfo(notes, archive, categories);
    const archiveElList = document.querySelectorAll('.archive');
    const unarchiveElList = document.querySelectorAll('.unarchive');
    archiveElList.forEach(elem => elem.classList.add('is-hidden'));
    unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));
    const editElList = document.querySelectorAll('.edit');
    editElList.forEach(elem => elem.classList.add('is-hidden'));
  }

  function onShowArchiveSelectChange(event, notes, archive, categories) {
    switch (event.target.value) {
      case 'archived':
        renderNotesList(archive, categories);
        const archiveElList = document.querySelectorAll('.archive');
        const unarchiveElList = document.querySelectorAll('.unarchive');
        archiveElList.forEach(elem => elem.classList.add('is-hidden'));
        unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));
        const editElList = document.querySelectorAll('.edit');
        editElList.forEach(elem => elem.classList.add('is-hidden'));
        break;

      case 'active':
        renderNotesList(notes, categories);
        break;

      default:
        break;
    }
  }

  function closeModal() {
    refs.backdropNoteEl.classList.toggle('is-hidden');
    refs.formEl.reset();
    refs.noteDateInput.removeAttribute('disabled', 'false');
    refs.submitFormBtn.classList.remove('is-hidden');
    refs.submitFormBtnEdit.classList.add('is-hidden');
  }

  function showModal() {
    refs.backdropNoteEl.classList.toggle('is-hidden');
  }

  function renderNotesList(notes, categories) {
    refs.notesTableBody.innerHTML = '';
    //  render notes
    return notes.map(note => {
      renderOneNote(note, categories);
    });
  }

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
}

NoteApp(initialNotesValues);
