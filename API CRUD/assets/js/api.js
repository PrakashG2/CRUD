//LOAD TABLE
function loadTable(breed = '', sortColumn = '', sortOrder = 'asc', defaultSortColumn = 'id') {
    const xhttp = new XMLHttpRequest();
    const sortParam = sortColumn ? `_sort=${sortColumn}&_order=${sortOrder}` : `_sort=${defaultSortColumn}&_order=${sortOrder}`;
    xhttp.open("GET", `http://localhost:3000/PetDetails?Breed_like=${breed}&${sortParam}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = "";
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += "<tr>";
                trHTML += "<td>" + object["id"] + "</td>";
                trHTML += "<td>" + object["PetType"] + "</td>";
                trHTML += "<td>" + object["Breed"] + "</td>";
                const dob = new Date(object["DOB"]);
                const dobFormatted = dob.getDate().toString().padStart(2, '0') + '/' + (dob.getMonth() + 1).toString().padStart(2, '0') + '/' + dob.getFullYear().toString();
                trHTML += "<td>" + dobFormatted + "</td>";
                trHTML += "<td>" + object["LifeSpan"] + "</td>";
                trHTML += "<td>" + object["Cost"] + "</td>";
                trHTML += '<td><img width="50px" src="' + object["avatar"] + '" class="avatar"></td>';
                trHTML += "<td>" + object["created"] + "</td>";
                trHTML += "<td>" + object["modified"] + "</td>";
                trHTML += '<td><button type="button" id="edit" class="btn btn-outline-secondary" onclick="showUserEditBox(' + object["id"] + ')"><i class="fas fa-edit"></i>EDIT</button>&nbsp';
                trHTML += '&nbsp<button type="button" class="btn btn-outline-danger" onclick="userDelete(' + object["id"] + ')"><i class="fas fa-trash"></i></button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

//SORTING
function sortTable(column) {
    const sortOrder = document.getElementById("sortOrder").value;
    loadTable('', column, sortOrder);
}

//SEARCH
function searchTable() {
    const breed = document.getElementById("searchInput").value;
    loadTable(breed);
}
loadTable();

//...........................................................................................................................................

//USER CREATE SWEET ALERT INPUT

function showUserCreateBox() {
    Swal.fire({
        title: "NEW PET",
        html:
            '<div class="swal2-content">' +
            '<div class="input-group mb-3">' +
            '<span class="input-group-text"><i class="fa-solid fa-paw" style="color: #b89da4;"></i></span>' +
            '<select id="PetType" class="form-select custom-select">' +
            '  <option value="" disabled selected>--- PET TYPE ---</option>' +
            '<option value="DOG">DOG</option>' +
            '<option value="CAT">CAT</option>' +
            ' <option value="PARROT">PARROT</option>' +
            ' <option value="RABBIT">RABBIT</option>' +
            ' <option value="GOAT">GOAT</option>' +
            ' <option value="COW">COW</option>' +
            ' </select>' +
            '</div>' +
            '<div class="input-group mb-3">' +
            '<span class="input-group-text"><i class="fa-solid fa-bone" style="color: #b7bcbd;"></i></span>' +
            '<input id="Breed" class="form-control" type="text" placeholder="Enter Breed... ex: labourader">' +
            '</div>' +
            '<div class="input-group mb-3">' +
            '<span class="input-group-text"><i class="fa-sharp fa-solid fa-cake-candles" style="color: #d367d5;"></i></span>' +
            '<input id="DOB" class="form-control" type="date">' +
            '</div>' +
            '<div class="input-group mb-3">' +
            '<span class="input-group-text"><i class="fa-solid fa-heart-pulse" style="color: #ff0a0a;"></i></span>' +
            '<input id="LifeSpan" class="form-control" type="text" placeholder="Lifespan in years... ex: 15">' +
            '</div>' +
            '<div class="input-group mb-3">' +
            '<span class="input-group-text"><i class="fa-solid fa-indian-rupee-sign" style="color: #8e8a10;"></i></span>' +
            '<input id="Cost" class="form-control" type="text" placeholder="Cost in rupees... ex: 15000">' +
            '</div>' +
            '</div>',


        preConfirm: () => {
            userCreate();
        },
    });
}

//............................................................................................................................................

//USER CREATE METHOD
function userCreate() {
    const PetType = document.getElementById("PetType").value;
    const Breed = document.getElementById("Breed").value;
    const DOB = document.getElementById("DOB").value;
    const LifeSpan = document.getElementById("LifeSpan").value;
    const Cost = document.getElementById("Cost").value;

    // Validation for required fields
    if (
        PetType.trim() === "" ||
        Breed.trim() === "" ||
        DOB.trim() === "" ||
        LifeSpan.trim() === "" ||
        Cost.trim() === ""
    ) {
        Swal.fire({
            title: "FIELDS CAN'T BE EMPTY",
            icon: "error",
            showConfirmButton: true,
            customClass: {
                popup: "frosted-glass",
            },
        }).then((res) => {
            if (res.value) {
                showUserCreateBox();
            }
        });
        return;
    }

    // Validation for LifeSpan and Cost
    const lifespanRegex = /^\d+$/;
    const costRegex = /^\d+(\.\d{1,2})?$/;
    if (!lifespanRegex.test(LifeSpan)) {
        Swal.fire({
            title: "INVALID VALUE FOR LIFESPAN",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
            // customClass: {
            //     popup: "frosted-glass",
            // },
        });
        return;
    }
    if (!costRegex.test(Cost)) {
        Swal.fire({
            title: "INVALID VALUE FOR COST",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
                popup: "frosted-glass",
            },
        });

        return;
    }

    // Determine pet image based on pet type
    let petimage;
    if (PetType.toLowerCase() === "dog") {
        petimage = "https://images.pexels.com/photos/2951921/pexels-photo-2951921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "cat") {
        petimage = "https://images.pexels.com/photos/3687770/pexels-photo-3687770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "parrot") {
        petimage = "https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "rabbit") {
        petimage = "https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "cow") {
        petimage = "https://images.pexels.com/photos/36347/cow-pasture-animal-almabtrieb.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "goat") {
        petimage = "https://images.pexels.com/photos/58914/pexels-photo-58914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else {
        petimage = "default.jpg";
    }

    const created = new Date();
    const modified = new Date();

    //CONVERTING DATE FORMATS INTO CUSTOM FORMATS
    const createdString = created.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });

    const modifiedString = modified.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/PetDetails");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            PetType: PetType,
            Breed: Breed,
            DOB: DOB,
            LifeSpan: LifeSpan,
            Cost: Cost,
            avatar: petimage,
            created: createdString,
            modified: modifiedString,
        })
    );

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            Swal.fire({
                title: "PET DETAILS CREATED SUCCESSFULLY ! ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: "frosted-glass",
                },
            });
           
        } else if (this.readyState === 4 && this.status !== 201) {
            Swal.fire({
                title: "SOMETHING WENT WRONG",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: "frosted-glass",
                },
            }).then((res) => {
                if (res.value) {
                    showUserEditBox(id);
                }
            });
            return;
        }
    };
    loadTable();

}


//.........................................................................................................................................

//USER EDIT SWEETALERT INPUT
function showUserEditBox(id) {

    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/PetDetails/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            //const user = objects["objects"];
            // console.log(objects);
            Swal.fire({
                title: "UPDATE",
                html:
                    '<form id="editForm">' +
                    '<input id="id" type="hidden" value="' + objects[`${id}`] + '">' +
                    '<div class="form-group">' +
                    '<div class="input-group mb-3">' +
                    ' <span class="input-group-text"><i class="fa-solid fa-paw" style="color: #b89da4;"></i></span>' +
                    '<select id="PetType" class="form-control">' +
                    '<option value="DOG" ' + (objects["PetType"] === "DOG" ? 'selected' : '') + '>DOG</option>' +
                    '<option value="CAT" ' + (objects["PetType"] === "CAT" ? 'selected' : '') + '>CAT</option>' +
                    '<option value="PARROT" ' + (objects["PetType"] === "PARROT" ? 'selected' : '') + '>PARROT</option>' +
                    '<option value="RABBIT" ' + (objects["PetType"] === "RABBIT" ? 'selected' : '') + '>RABBIT</option>' +
                    '<option value="GOAT" ' + (objects["PetType"] === "GOAT" ? 'selected' : '') + '>GOAT</option>' +
                    '<option value="COW" ' + (objects["PetType"] === "COW" ? 'selected' : '') + '>COW</option>' +
                    '</select>' +
                    '</div>' +

                    '<div class="form-group">' +
                    ' <div class="input-group">' +
                    '   <span class="input-group-text"><i class="fa-solid fa-bone"></i></span>' +
                    '   <input id="Breed" class="form-control" placeholder="Enter Breed... ex: labourader" value="' + objects["Breed"] + '">' +
                    ' </div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    ' <div class="input-group">' +
                    '   <span class="input-group-text"><i class="fa-solid fa-cake-candles"></i></span>' +
                    '   <input id="DOB" class="form-control" placeholder="DATE OF BIRTH" value="' + objects["DOB"] + '">' +
                    ' </div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    ' <div class="input-group">' +
                    '   <span class="input-group-text"><i class="fa-solid fa-heart-pulse"></i></span>' +
                    '   <input id="LifeSpan" class="form-control" placeholder="Lifespan in years... ex: 15" value="' + objects["LifeSpan"] + '">' +
                    ' </div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    ' <div class="input-group">' +
                    '   <span class="input-group-text"><i class="fa-solid fa-indian-rupee-sign"></i></span>' +
                    '   <input id="Cost" class="form-control" placeholder="Cost in rupees... ex: 15000" value="' + objects["Cost"] + '">' +
                    ' </div>' +
                    '</div>' +
                    '<input id="created" type="hidden" value="' + objects["created"] + '">' +
                    '</form>',

                preConfirm: () => {
                    userEdit(id);
                },
            });

        }
    };
}


//USER EDIT FUNCTION
function userEdit(id) {
    //const id = document.getElementById("id").value;
    const PetType = document.getElementById("PetType").value;
    const Breed = document.getElementById("Breed").value;
    const DOB = document.getElementById("DOB").value;
    const LifeSpan = document.getElementById("LifeSpan").value;
    const Cost = document.getElementById("Cost").value;

    // VALIDATION FOR NOT NULL
    if (
        PetType.trim() === "" ||
        Breed.trim() === "" ||
        DOB.trim() === "" ||
        LifeSpan.trim() === "" ||
        Cost.trim() === ""
    ) {
        Swal.fire({
            title: "FIELDS CAN'T BE EMPTY",
            icon: "error",
            showConfirmButton: true,
            timer: 1500,
            customClass: {
                popup: "frosted-glass",
            },
        }).then((res) => {
            if (res.value) {
                showUserEditBox(id);
            }
        });
        return;
    }

    // VALIDATION FOR LIPESPAN AND COST
    const lifespanRegex = /^\d+$/;
    const costRegex = /^\d+(\.\d{1,2})?$/;
    if (!lifespanRegex.test(LifeSpan)) {
        Swal.fire({
            title: "INVALID INPUT FOR LIFESPAN",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
                popup: "frosted-glass",
            },
        });
        return;
    }
    if (!costRegex.test(Cost)) {
        Swal.fire({
            title: "INVALID INPUT FOR COST",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
                popup: "frosted-glass",
            },
        });
        return;
    }

    // PET IMAGE BASED ON TYPE
    let petimage;
    if (PetType.toLowerCase() === "dog") {
        petimage = "https://images.pexels.com/photos/2951921/pexels-photo-2951921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "cat") {
        petimage = "https://images.pexels.com/photos/3687770/pexels-photo-3687770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "parrot") {
        petimage = "https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "rabbit") {
        petimage = "https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "cow") {
        petimage = "https://images.pexels.com/photos/36347/cow-pasture-animal-almabtrieb.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else if (PetType.toLowerCase() === "goat") {
        petimage = "https://images.pexels.com/photos/58914/pexels-photo-58914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    } else {
        petimage = "default.jpg";
    }

    const modified = new Date();

    const modifiedString = modified.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });


    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:3000/PetDetails/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            // id: id,
            PetType: PetType,
            Breed: Breed,
            DOB: DOB,
            LifeSpan: LifeSpan,
            Cost: Cost,
            avatar: petimage,
            created: document.getElementById("created").value, // BEFORE MODIFYING THE DATE FETCHING AND STORING THE CREATED DATE
            modified: modifiedString,
        })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire({
                title: "UPDATION SUCCESS",
                icon: "success",
            });
            loadTable();
        }
    };
}

//....................................................................................................................................

//USER DELETE FUNCTION
function userDelete(id) {
    Swal.fire({
        title: "ATTENTION !",
        text: "YOU ARE ABOUT TO DELETE A RECORD",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes. Delete It !",
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `http://localhost:3000/PetDetails/${id}`);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire({
                        title: "DELETION SUCCESS !",
                        icon: "success",
                    });
                    loadTable();
                    const loader = document.querySelector(".loader");
                    loader.classList.add("show");
                    setTimeout(function () {
                        loader.classList.remove("show");
                    }, 3000);
                }
            };
        }
    });
}

