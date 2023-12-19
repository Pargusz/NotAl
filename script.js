const notForm = document.getElementById('notForm');
const isimInput = document.getElementById('isim');
const notTextarea = document.getElementById('not');
const notlarListesi = document.getElementById('notlarListesi');
let notToEdit = null;

notForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const isim = isimInput.value.trim();
    const not = notTextarea.value.trim();
    if (isim === '' || not === '') {
        return;
    }

    if (notToEdit) {
        notToEdit.querySelector('.isim').innerText = isim;
        notToEdit.querySelector('.not-text').innerText = not;
        notToEdit = null;

        updateLocalStorage();
    } else {
        const notItem = document.createElement('div');
        notItem.classList.add('not-item');
        notItem.innerHTML = `<span class="isim">${isim}</span><span class="duzenle" onclick="duzenleNot(this)">Düzenle</span><span class="sil" onclick="silNot(this)">Sil</span><br><span class="not-text">${not}</span>`;
        notlarListesi.appendChild(notItem);

        addToLocalStorage(isim, not);
    }
    isimInput.value = '';
    notTextarea.value = '';
    notTextarea.focus();
});

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

function loadFromLocalStorage() {
    const notlar = getNotesFromLocalStorage();
    if (notlar) {
        notlar.forEach(note => {
            addNoteToUI(note.isim, note.not);
        });
    }
}

function addNoteToUI(isim, not) {
    const notItem = document.createElement('div');
    notItem.classList.add('not-item');
    notItem.innerHTML = `<span class="isim">${isim}</span><span class="duzenle" onclick="duzenleNot(this)">Düzenle</span><span class="sil" onclick="silNot(this)">Sil</span><br><span class="not-text">${not}</span>`;
    notlarListesi.appendChild(notItem);
}

function getNotesFromLocalStorage() {
    const notlar = localStorage.getItem('notlar');
    return notlar ? JSON.parse(notlar) : [];
}

function addToLocalStorage(isim, not) {
    const notlar = getNotesFromLocalStorage();
    notlar.push({ isim, not });
    localStorage.setItem('notlar', JSON.stringify(notlar));
}

function updateLocalStorage() {
    const notItems = document.querySelectorAll('.not-item');
    const notlar = Array.from(notItems).map(item => {
        return {
            isim: item.querySelector('.isim').innerText,
            not: item.querySelector('.not-text').innerText
        };
    });
    localStorage.setItem('notlar', JSON.stringify(notlar));
}

function duzenleNot(element) {
    notToEdit = element.parentElement;
    const isim = notToEdit.querySelector('.isim').innerText;
    const notMetni = notToEdit.querySelector('.not-text').innerText;
    isimInput.value = isim;
    notTextarea.value = notMetni;
}

function silNot(element) {
    const silinecekIsim = element.parentElement.querySelector('.isim').innerText;
    if (confirm(`Bu notu silmek istediğinizden emin misiniz? (${silinecekIsim})`)) {
        element.parentElement.remove();
        updateLocalStorage();
    }
}

function silTumNotlari() {
    const notlarListesi = document.getElementById('notlarListesi');
    notlarListesi.innerHTML = ''; // Tüm notları siler

    // Yerel depolamadaki tüm notları temizler
    localStorage.removeItem('notlar');
}
