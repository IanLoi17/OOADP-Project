function search() {
    let patientcards = document.querySelectorAll(".patientcards");
    let inputname = document.getElementById("query").value;
    let filter = inputname.toUpperCase();
    let name = document.querySelectorAll('.names');
    
    for (var i=0; i < patientcards.length; i++) {
        let focus = patientcards[i];
        let compare = name[i].dataset.pname;
        if (compare.toUpperCase().includes(filter)) {
            focus.style.display = "";
        }

        else {
            focus.style.display = "none";
        }
    }
}


function findHistory() {
    let consultcards = document.querySelectorAll(".consultcards");
    let patientname = document.getElementById("patientname").value;
    let filter = patientname.toUpperCase();
    let names = document.querySelectorAll(".patientnames");

    for (var i=0; i < consultcards.length; i++) {
        let focus = consultcards[i];
        let compare = names[i].dataset.name;
        if (compare.toUpperCase().includes(filter)) {
            focus.style.display = "";
        }

        else {
            focus.style.display = "none";
        }
    }
}


function findConsultation() {
    let consultationcards = document.querySelectorAll(".consultationcards");
    let patientName = document.getElementById("patientname").value;
    let filter = patientName.toUpperCase();
    let patientnames = document.querySelectorAll(".patientname");

    for (var i=0; i < consultationcards.length; i++) {
        let focus = consultationcards[i];
        let compare = patientnames[i].dataset.patientname;
        if (compare.toUpperCase().includes(filter)) {
            focus.style.display = "";
        }

        else {
            focus.style.display = "none";
        }
    }
}