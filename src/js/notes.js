import { nanoid } from 'nanoid';
import initialNotesValues from './notes_db';
// import { noteCategoriesIcons } from './notesCategoriesInfo';
import { formatDate } from './formatDate';
import { dateParse } from './dateParse';

function Notepad(notes) {
  const categories = [
    { category: 'Task', icon: 'shopping_cart' },
    { category: 'Random Thought', icon: 'psychology' },
    { category: 'Idea', icon: 'lightbulb' },
    { category: 'Quote', icon: 'format_quote' },
  ];
  const notesList = [...notes];
  const archivedNote = [];
  let changedNote = {};

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

  // Event listeners

  refs.createNoteBtn.addEventListener('click', showModal);
  refs.closeModalBtn.addEventListener('click', closeModal);
  refs.submitFormBtn.addEventListener('click', e =>
    addNote(e, notesList, archivedNote, categories)
  );
  refs.submitFormBtnEdit.addEventListener('click', e =>
    changeNote(e, notesList, changedNote, archivedNote, categories)
  );
  refs.showArchiveSelect.addEventListener('change', e =>
    onShowArchiveSelectChange(e, notesList, archivedNote, categories)
  );

  document.addEventListener('DOMContentLoaded', function () {
    renderNotesList(notesList, categories);
    renderSummaryNotesInfo(notesList, archivedNote, categories);
  });

  function renderNotesList(notesArr, categories) {
    refs.notesTableBody.innerHTML = '';
    //  render notes
    notesArr.map(note => {
      renderOneNote(note, categories);
    });

    // note remove
    const deleteElList = document.querySelectorAll('td>span.delete');
    deleteElList.forEach(deleteEl => {
      deleteEl.addEventListener('click', e =>
        deleteNote(
          e.target.parentElement.parentElement.id,
          notesList,
          archivedNote,
          categories
        )
      );
    });

    // note edit
    const editElList = document.querySelectorAll('.edit');
    editElList.forEach(editEl => {
      editEl.addEventListener('click', e =>
        prefillFormWithNoteData(e.target, changedNote)
      );
    });

    // note archivate and unarchivate
    const archiveElList = document.querySelectorAll('.archive');
    const unarchiveElList = document.querySelectorAll('.unarchive');
    archiveElList.forEach(archiveEl => {
      archiveEl.addEventListener('click', e =>
        addToArchive(
          e.target.parentElement.parentElement.id,
          notes,
          archivedNote,
          categories
        )
      );
    });

    unarchiveElList.forEach(unarchiveEl => {
      unarchiveEl.addEventListener('click', e =>
        removeFromArchive(
          e.target.parentElement.parentElement.id,
          notes,
          archivedNote,
          categories
        )
      );
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

  function addNote(event, notes, archivedNote, categories) {
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
      archived: false,
    };

    notes.push(newNote);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archivedNote, categories);
    closeModal();
  }

  function deleteNote(id, notes, archivedNote, categories) {
    noteToDeliteIndex = notes.findIndex(note => note.id === id);
    notes.splice(noteToDeliteIndex, 1);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archivedNote, categories);
  }

  function changeNote(event, notes, changedNote, archivedNote, categories) {
    event.preventDefault();

    const editdNoteIndex = notes.indexOf(
      notes.find(note => note.id === changedNote.id)
    );

    changedNote.name = refs.noteNameInput.value;
    changedNote.created = refs.noteDateInput.value;
    changedNote.category = refs.noteCategorySelect.value;
    changedNote.content = refs.noteContentInput.value;
    changedNote.dates = dateParse(refs.noteContentInput.value);
    changedNote.archived = false;

    notes.splice(editdNoteIndex, 1, changedNote);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archivedNote, categories);
    changedNote = {};
    closeModal();
  }

  function prefillFormWithNoteData(elem, changedNote) {
    showModal();
    refs.submitFormBtn.classList.add('is-hidden');
    refs.submitFormBtnEdit.classList.remove('is-hidden');
    changedNote.id = elem.parentElement.parentElement.id;
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

  function addToArchive(id, notes, archivedNote, categories) {
    noteToArchivate = notes.find(note => note.id === id);
    archivedNote.push(noteToArchivate);
    noteToArchivateIndex = notes.findIndex(note => note.id === id);
    notes.splice(noteToArchivateIndex, 1);
    renderNotesList(notes, categories);
    renderSummaryNotesInfo(notes, archivedNote, categories);
  }

  function removeFromArchive(id, notes, archivedNote, categories) {
    noteToUnarchivate = archivedNote.find(note => note.id === id);
    notes.push(noteToUnarchivate);
    noteToUnarchivateIndex = archivedNote.findIndex(note => note.id === id);
    archivedNote.splice(noteToUnarchivateIndex, 1);
    renderNotesList(archivedNote, categories);
    renderSummaryNotesInfo(notes, archivedNote, categories);
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

  function onShowArchiveSelectChange(event, notes, archivedNote, categories) {
    switch (event.target.value) {
      case 'archived':
        renderNotesList(archivedNote, categories);
        const archiveElList = document.querySelectorAll('.archive');
        const unarchiveElList = document.querySelectorAll('.unarchive');
        archiveElList.forEach(elem => elem.classList.add('is-hidden'));
        unarchiveElList.forEach(elem => elem.classList.remove('is-hidden'));

        break;

      case 'active':
        renderNotesList(notes, categories);
        break;

      default:
        break;
    }
  }
}

Notepad(initialNotesValues);
