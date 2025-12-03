const flashcard_item = $(`<div class="card" draggable="true">
<div class="card-container">
    <div class="card-front">
        <h4 class="card-front-title dynapuff-font">Spørsmål</h4>
        <div class="card-front-text dynapuff-font">Sample only 123</div>
        <div class="card-back-action"><button class="card-action"><span class="material-symbols-outlined">delete</span></button></div>
    </div>
    <div class="card-back">
        <h4 class="card-back-title dynapuff-font">Svar</h4>
        <div class="card-back-text dynapuff-font">Sample only 123</div>
        <div class="card-edit-action"><button class="card-edit"><span class="material-symbols-outlined">edit</span></button></div>
    </div>
</div>
</div>`)





// Flashcard Items Container
const flashcardContainer = $(`.flashcards`)
// Flashcard Form Modal
const flashcardModal = $(`#form-modal`)
// Flashcard Form
const FCForm = $(`#flashcard-form`)
// New Flashcard Item Button
const newFCButton = $(`#btn-new-flashcard`)
// Flashcard Modal Close Button
const FCCloseButton = $(`#form-modal .form-modal-close`)
// Folder filter dropdown
const folderFilter = $('#folder-filter');
const folderList = $('#folder-list');

// Stored Flashcard Data
let FCData = localStorage.getItem('fc_data') || '[]';
FCData = JSON.parse(FCData);

// Hent alle unike mapper
function getFolders() {
    const folders = FCData.map(fc => fc.folder || '').filter(f => f.trim() !== '');
    return [...new Set(folders)];
}

// Oppdater mappevalg i filter og skjema
function updateFolderOptions() {
    const folders = getFolders();
    folderFilter.html('<option value="">Alle mapper</option>');
    folderList.html('');
    folders.forEach(folder => {
        folderFilter.append(`<option value="${folder}">${folder}</option>`);
        folderList.append(`<option value="${folder}">`);
    });
}

// New Flashcard Button Click Event Listener
newFCButton.click(function (e) {
    e.preventDefault();
    FCForm[0].reset();
    $('#fc_id').val("");
    $('#folder').val(folderFilter.val() || "");
    flashcardModal.addClass("shown");
})

// Flashcard Modal Close Button Click Event Listener
FCCloseButton.click(function (e) {
    e.preventDefault()
    FCForm[0].reset();
    $('#fc_id').val("")
    if (flashcardModal.hasClass("shown"))
        flashcardModal.removeClass("shown");
})

// Generate New Flashcard Item ID
function generateNewID() {
    let id = 0;
    if (FCData.length > 0) {
        for (let i = 0; i < FCData.length; i++) {
            if (id < Number(FCData[i].id)) {
                id = Number(FCData[i].id);
            }
        }
    }
    id++;
    return id;
}

// New Flashcard submit event

FCForm.submit(function (e) {
    e.preventDefault();
    var id = $('#fc_id').val();
    var folder = $('#folder').val().trim();
    var color = $('#color').val() || "#2E5077"; // 👈 Hent valgt farge
    var backcolor = $('#backcolor').val() || "#629cb8"; // 👈 Hent valgt farge bakside

    





    // ...existing code...
    if (id == "") {
        id = generateNewID();
        FCData.push({
            id: id,
            question: $(`#question`).val(),
            answer: $(`#answer`).val(),
            folder: folder,
            color: color,
            backcolor: backcolor // 👈 LEGG TIL DENNE
        });
    } else {
        for (var i = 0; i < FCData.length; i++) {
            if (id == FCData[i].id) {
                FCData[i] = {
                    id: id,
                    question: $(`#question`).val(),
                    answer: $(`#answer`).val(),
                    folder: folder,
                    color: color,
                    backcolor: backcolor // 👈 LEGG TIL DENNE
                };
            }
        }
    }
    // ...existing code...















    FCForm[0].reset();
    $('#fc_id').val("");
    localStorage.setItem("fc_data", JSON.stringify(FCData));
    updateFolderOptions();
    load_flashcards();
    if (flashcardModal.hasClass("shown"))
        flashcardModal.removeClass("shown");
});








// Load Flashcard Items
function load_flashcards() {
    flashcardContainer.html("");
    var selectedFolder = folderFilter.val();
    var filtered = FCData;


    
    if (selectedFolder) {
        filtered = FCData.filter(fc => (fc.folder || '') === selectedFolder);
    }
    for (let i = 0; i < filtered.length; i++) {
        let data = filtered[i];
        let fc_item = flashcard_item.clone(true);
        fc_item.find(`.card-front-text`).text(data.question)
        fc_item.find(`.card-back-text`).text(data.answer)
        fc_item[0].dataset.id = data.id
        flashcardContainer.append(fc_item)




        fc_item.find('.card-front').css('background-color', data.color || '#2E5077');
        fc_item.find('.card-back').css('background-color', data.backcolor || '#629cb8');







            
        // Legg til edit-event for hvert kort:
        fc_item.find(".card-edit").click(function (e) {
            e.stopPropagation();
            const id = $(this).closest(".card")[0].dataset.id;
            const fc = FCData.find(x => x.id == id);
            if (!fc) return;
            $('#fc_id').val(fc.id);
            $('#question').val(fc.question);
            $('#answer').val(fc.answer);
            $('#folder').val(fc.folder);

            $('#color').val(fc.color || "#2E5077"); // 👈 Denne linjen må med!
            $('#backcolor').val(fc.backcolor || "#629cb8");

            flashcardModal.addClass("shown");
        });




        // Flashcard item card flip event to view answer
        fc_item.click(function (e) {
            e.preventDefault()
            if ($.contains($(this).find("button.card-action")[0], e.target) || $(this).find("button.card-action")[0] == e.target)
                return;
            if ($(this).hasClass("active")) {
                $(this).removeClass("active")
            } else {
                $(this).addClass("active")
            }
        })

        // Flashcard item card delete button event
        fc_item.find("button.card-action").click(function (e) {
            e.preventDefault()
            var id = $(this).closest(".card")[0].dataset.id
            if (confirm(`Er du sikker på du vil slette dette flashcardet?`)) {
                for (var z = 0; z < FCData.length; z++) {
                    if (id == FCData[z].id) {
                        delete FCData[z];
                        FCData = FCData.filter(elm => elm)
                        localStorage.setItem("fc_data", JSON.stringify(FCData));
                        updateFolderOptions();
                        load_flashcards();
                    }
                }
            }
        })
    }



        



}












// Oppdater visning når mappe velges
folderFilter.change(function () {
    load_flashcards();
});

$(document).ready(function () {
    updateFolderOptions();
    load_flashcards();
})

// Legg til dette i script.js, etter $(document).ready(...)
$('#export-btn').click(function () {
    const dataStr = JSON.stringify(FCData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "flashcards.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

$('#import-btn').click(function () {
    $('#import-file').click();
});

$('#import-file').on('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            if (Array.isArray(imported)) {
                FCData = imported;
                localStorage.setItem("fc_data", JSON.stringify(FCData));
                updateFolderOptions();
                load_flashcards();
                alert("Flashcards importert!");
            } else {
                alert("Ugyldig filformat.");
            }
        } catch {
            alert("Kunne ikke lese filen.");
        }
    };
    reader.readAsText(file);
});







// Darkmode knapp:
function darkmodeFunksjon() {
    let element = document.body;
    let btn = document.querySelector('.ikonBakgrunn');

    btn.classList.toggle("active");
    element.classList.toggle("dark-mode");


    
}






$('#delete-folder-btn').click(function () {
    const selectedFolder = folderFilter.val();
    if (!selectedFolder) {
        alert("Velg en mappe du vil slette.");
        return;
    }
    if (!confirm(`Er du sikker på at du vil slette mappen "${selectedFolder}" og alle flashcards i den? Dette kan ikke angres.`)) {
        return;
    }
    // Slett alle flashcards i valgt mappe
    FCData = FCData.filter(fc => (fc.folder || '') !== selectedFolder);
    localStorage.setItem("fc_data", JSON.stringify(FCData));
    updateFolderOptions();
    folderFilter.val(""); // Tilbakestill til "Alle mapper"
    load_flashcards();
    alert(`Mappen "${selectedFolder}" og alle tilhørende flashcards er slettet.`);
});


















// ...existing code...
let isEditMode = false;
let draggedCard = null;

$('#edit-order-btn').click(function() {
    isEditMode = !isEditMode;
    console.debug('Edit mode toggled:', isEditMode);
    if (isEditMode) {
        flashcardContainer.addClass('edit-mode');
        $(this).addClass('active').text('✓ Ferdig');
    } else {
        flashcardContainer.removeClass('edit-mode');
        $(this).removeClass('active').text('Rediger rekkefølge');
        saveCardOrder();
    }
});

function swapElements(a, b) {
    const $a = $(a), $b = $(b);
    if ($a[0] === $b[0]) return;
    const $placeholder = $('<div>').hide();
    $a.before($placeholder);
    $b.before($a);
    $placeholder.replaceWith($b);
    console.debug('Swapped', $a.attr('data-id'), '↔', $b.attr('data-id'));
}

$(document).on('dragstart', '.flashcards.edit-mode .card', function(e) {
    if (!isEditMode) return;
    draggedCard = this;
    $(this).addClass('dragging');
    console.debug('dragstart', $(this).attr('data-id'));
    e.originalEvent.dataTransfer.effectAllowed = 'move';
    try { e.originalEvent.dataTransfer.setData('text/plain', 'drag'); } catch(e){ console.warn(e); }
});

$(document).on('dragenter', '.flashcards.edit-mode .card', function(e) {
    if (!isEditMode || !draggedCard) return;
    if (this === draggedCard) return;
    console.debug('dragenter target', $(this).attr('data-id'));
    swapElements(draggedCard, this);
    const draggedId = $(draggedCard).attr('data-id');
    draggedCard = $(`.flashcards .card[data-id='${draggedId}']`)[0];
});

$(document).on('dragover', '.flashcards.edit-mode .card', function(e) {
    if (!isEditMode || !draggedCard) return;
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'move';
});

$(document).on('dragleave', '.flashcards.edit-mode .card', function(e) {
    // no-op
});

$(document).on('drop', '.flashcards.edit-mode .card', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.debug('drop on', $(this).attr('data-id'));
});

$(document).on('dragend', '.flashcards.edit-mode .card', function(e) {
    console.debug('dragend');
    $('.flashcards .card').removeClass('dragging');
    draggedCard = null;
});

function saveCardOrder() {
    const cardIds = [];
    $('.flashcards .card').each(function() {
        const id = $(this).attr('data-id');
        if (id) cardIds.push(id);
    });
    console.debug('save order', cardIds);
    const newFCData = [];
    cardIds.forEach(id => {
        const card = FCData.find(c => c.id == id);
        if (card) newFCData.push(card);
    });
    FCData = newFCData;
    localStorage.setItem('fc_data', JSON.stringify(FCData));
    alert('Rekkefølgen er lagret!');
}
// ...existing code...