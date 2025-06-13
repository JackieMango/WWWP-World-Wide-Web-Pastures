import { breedAnimals } from './breeding.js';
import { saveData, db, deleteDoc,doc} from './firestore.js';
import { plantSeeds, harvestCrops } from './farm.js';
import { buySeeds, sellCrops } from './cropMarket.js';
import Cow from './cow.js';
import Goat from './goat.js';
import Chicken from './chicken.js';

// prices for selling/buying animals
const priceSelling= {
    "cow": 200,
    "goat": 150,
    "chicken": 100
}
const priceBuying={
    "Cow": 150,
    "Goat": 120,
    "Chicken":80
}

// removes animal from array/database
function removeAnimal(animal, animalArray, user)
{
const index = animalArray.findIndex(a => a.animalID === animal.anmalID);
if(index !== -1)
{
    animalArray.splice(index,1);
}
switch(animal.constructor.name){
    case 'Cow':
        user.removeCow(animal.animalID);
        break;
    case 'Goat':
        user.removeGoat(animal.animalID)
        break;
    case 'Chicken':
        user.removeChicken(animal.animalID);
        break;
}
deleteDoc(doc(db, "Users", user.uid, "Animals", animal.animalID));
}
const time = 5000;

//---------Displays the "Animalpen" popup---------
// Creates new Animal if breed button is clicked
// Shows animal list if button is clicked
// Takes the animal array and the scene
function showPopup(animalArray, scene) {


    const popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "block";

        //---------"View Animal List" button setup begins here-------
        const viewAnimalsBtn = document.getElementById("viewAnimalList");
        viewAnimalsBtn.onclick = null;
        if (viewAnimalsBtn) {
            viewAnimalsBtn.onclick = () => {
                document.getElementById("animalSelection").style.display = "none"; // hide breeding list when this option is clicked
                document.getElementById("naming").style.display = "none"; // hide rename
                document.getElementById("breedingAnimalList").style.display = "none"; // hide breed selection too (extra safe)
                document.getElementById("animalList").style.display = "block"; // show animal list
                showAnimalList(scene); // update the list
            };
        }

        //---------"Breed Animal" button setup begins here-------
        const breedAnimalsBtn = document.getElementById("breedAnimals");
        breedAnimalsBtn.onclick = null;
        if (breedAnimalsBtn) {
            breedAnimalsBtn.onclick = () => {
                clearBtn();
                document.getElementById("animalList").style.display = "none";
                document.getElementById("breedingAnimalList").style.display = "block";
                document.getElementById("animalSelection").style.display = "block";

                // Rebuild breeding animal list dynamically
                document.getElementById("naming").style.display = "none";
                document.getElementById("animalList").style.display = "none";
                const breedingList = document.getElementById("breedingAnimalList");
                breedingList.innerHTML = "";

                animalArray.forEach((animal, index) => {
                    // For each animal, create a label and a checkbox
                    const label = document.createElement("label");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.name = "animalSelect"; // Group all breeding checkboxes
                    checkbox.value = index; // Value is the index in the animalArray

                    // Prepare text displaying animal type and stats
                    const type = animal.texture?.key || animal.animalTexture || "Animal";
                    const stats = animal.stats || {};
                    const statText = Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join(", ");

                    const name = animal.name || "Unnamed"; // fallback if no name
                    label.innerHTML = `<strong>${name} (${type}):</strong><br><span style="margin-left: 55px">${statText}<span>`;

                    label.prepend(checkbox);
                    breedingList.appendChild(label);
                    breedingList.appendChild(document.createElement("br"));
                });

                // Restrict to 2 selections
                const allCheckboxes = document.querySelectorAll("input[name='animalSelect']");
                allCheckboxes.forEach((checkbox) => {
                    checkbox.addEventListener('change', () => {
                        const selected = Array.from(allCheckboxes).filter(cb => cb.checked);
                        if (selected.length >= 2) {
                            allCheckboxes.forEach(cb => {
                                if (!cb.checked) {
                                    cb.disabled = true;
                                }
                            });
                        } else {
                            allCheckboxes.forEach(cb => {
                                cb.disabled = false;
                            });
                        }
                    });
                });


                //---Handle Confirm Breed Button---
                const confirmBreedBtn = document.getElementById("confirmBreed");
                if (confirmBreedBtn) {
                    confirmBreedBtn.onclick = async () => {
                        const selected = Array.from(document.querySelectorAll("input[name='animalSelect']:checked"));
                        
                        if (selected.length != 2) {
                            const breedError2 = document.getElementById("breed-error2");
                            if (breedError2) {
                                breedError2.style.display = "block";
                                setTimeout(function() {
                                    breedError2.style.display = "none";
                                }, time);
                            }
                            return;
                        }
                        
                        const parentA = animalArray[selected[0].value];
                        const parentB = animalArray[selected[1].value];

                        // Validate both selected animals are of same type
                        const typeA = parentA.texture?.key || parentA.animalTexture;
                        const typeB = parentB.texture?.key || parentB.animalTexture;

                        if (!typeA || !typeB || typeA !== typeB) {
                            const breedError1 = document.getElementById("breed-error1");
                            if (breedError1) {
                                breedError1.style.display = "block";
                                setTimeout(function() {
                                    breedError1.style.display = "none";
                                }, time);
                            }
                            return;
                        }

                        //Breed operation
                        await breedAnimals(scene, parentA, parentB, animalArray, async () => {
                            //console.log("Breeding complete.");

                            allCheckboxes.checked = false;

                            //Show temporary success message
                            const successBreed = document.getElementById("breed");
                            if (successBreed) {
                                successBreed.style.display = "block";
                                setTimeout(function () {
                                    successBreed.style.display = "none";
                                }, time);
                            }

                            // Add new animal to user's own collection
                            if (scene.thisUser) {
                                const newAnimal = animalArray[animalArray.length - 1];
                                const type = newAnimal.texture?.key || newAnimal.animalTexture || "Unknown";

                                // Save newborn into right category
                                if (type.toLowerCase().includes("cow")) {
                                    scene.thisUser.addCow(newAnimal);
                                } else if (type.toLowerCase().includes("goat")) {
                                    scene.thisUser.addGoat(newAnimal);
                                } else if (type.toLowerCase().includes("chicken")) {
                                    scene.thisUser.addChicken(newAnimal);
                                } else {
                                    console.error("Unknown animal type:", type);
                                }

                                // Save updated user object (including new baby animal)
                                await saveData(scene.thisUser);
                            }
                        });
                    };
                }
            };
        }

        const renameBtn = document.getElementById("renameAnimals");
        renameBtn.onclick = () => {
            clearBtn();
            document.getElementById("animalSelection").style.display = "none";
            document.getElementById("animalList").style.display = "none";
            const renameList = document.getElementById("renameList");
            renameList.innerHTML = "";
            document.getElementById("naming").style.display = "block";

            // Show animals as checkbox list
            animalArray.forEach((animal, index) => {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "selectAnimal";
                checkbox.value = index;

                const name = animal.name;
                const type = animal.texture?.key || animal.animalTexture || "Animal";

                label.innerHTML = `<strong>${capitalize(name)}</strong> (${type})`;
                label.prepend(checkbox);
                renameList.appendChild(label);
                renameList.appendChild(document.createElement("br"));
            });

            // Rename confirmation
            const confirmName = document.getElementById("confirmName");
            if (confirmName) {
                confirmName.onclick = () => {
                    const renameAnimal = Array.from(document.querySelectorAll("input[name='selectAnimal']:checked"));

                    if (renameAnimal.length != 1) {
                        const renameError2 = document.getElementById("rename-error2");
                        if (renameError2) {
                            renameError2.style.display = "block";
                            setTimeout(function () {
                                renameError2.style.display = "none";
                            }, time);
                        }
                        return;
                    }
                    
                    const animal = animalArray[renameAnimal[0].value];
                    nameAnimals(animal);
                    updateName(scene, animal);
                    const rename = document.getElementById("rename");
                    if (rename) {
                        rename.style.display = "block";
                        setTimeout(function () {
                            rename.style.display = "none";
                        }, time);
                    }
                }
            }
        }

        // Handle Close Button
        const closeX = document.getElementById("closeAnimal");
        if (closeX) {
            closeX.onclick = () => {
                popup.style.display = "none";
                document.getElementById("animalSelection").style.display = "none"; // hide breeding
                document.getElementById("naming").style.display = "none"; // hide rename
                document.getElementById("animalList").style.display = "none";     // hise list
                //console.log("Animal Pen popup closed.");
            };
        }
    }
}
// Hides the animal popup
// Resets popup visibility
// Removes leftover animalList so it doesn't appear automatically next time
export function hidePopup(scene) {
    let popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
    }
    if (scene) {
        scene.popupVisible = false;
    }
    //Also remove the animal list so it doesn't persist when entered second time
    let oldList = document.getElementById("animalList");
    if (oldList) {
        let children = oldList.children;
        for (let i = 0; i < oldList.length; i++) {
            children[i].remove();
        }
    }
}

// Name an animal
function nameAnimals(selectedAnimal) {
    const name = document.getElementById("name").value;
    // Validate field
    if (name === "") {
        const renameError1 = document.getElementById("rename-error1");
        if (renameError1) {
            renameError1.style.display = "block";
            setTimeout(function () {
                renameError1.style.display = "none";
            }, time);
        }
        return;
    }
    selectedAnimal.name = name;
    //console.log("Rename success!", selectedAnimal.name);
}

// Update user
function updateName(scene, selectedAnimal) {
    if (scene.thisUser) {
        for (let i = 0; i < scene.animalArray.length; i++) {
            let name = scene.animalArray[i].name;
            if (selectedAnimal.breed === 1 && name != "Unnamed Animal") {
                scene.thisUser.getCow(i).name = name;
                saveData(scene.thisUser);
                return;
            }
            else if (selectedAnimal.breed === 2 && name != "Unnamed Animal") {
                scene.thisUser.getChicken(i).name = name;
                saveData(scene.thisUser);
                return;
            }
            else if (selectedAnimal.breed === 3 && name != "Unnamed Animal") {
                scene.thisUser.getGoat(i).name = name;
                saveData(scene.thisUser);
                return;
            }
        }
    }

}

function clearBtn() {
    const selected = document.querySelectorAll("input[name='animalSelect']");
    if (selected) {
        for (let i = 0; i < selected.length; i++) {
            selected.checked = false;
        }
    }
    const select = document.querySelector("input[name='selectAnimal']");
    if (select) {
        for (let i = 0; i < select.length; i++) {
            select.checked = false;
        }
    }
}

// Adds animals in animal array to list
// Dynamically displays the current animals in the pen
// Removes any existing list and rebuilds it from the current
function showAnimalList(scene) {
    const listContainer = document.getElementById("animalList");
    listContainer.innerHTML = ""; // Clear any previous list

    if (!scene.animalArray || scene.animalArray.length === 0) {
        listContainer.innerText = "You have no animals.";
        return;
    }

    scene.animalArray.forEach((animal) => {
        // Try to get the type from texture key or fallback to "Unknown"
        const type = animal.texture?.key || animal.animalTexture || "Unknown";
        const name = animal.name;

        // Get stats safely
        const stats = animal.stats || {};
        const statLines = Object.entries(stats)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        // Build list item
        const item = document.createElement('p');
        item.style.textAlign = 'left';
        const statsUl = document.createElement('p');
        statsUl.style.paddingLeft = '20px';
        item.innerHTML = `<strong>${capitalize(name)} (${capitalize(type)})</strong>:`;
        statsUl.innerHTML = `${statLines}`;
        listContainer.appendChild(item);
        listContainer.appendChild(statsUl);
    });
}

// Utility function to capitalize first letter
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Function to show the farm popup
function openFarm(scene) {

    // get farm element
    const farm = document.getElementById("farm");
    // when the user collides with the farm, open the popup
    if (farm) {
        farm.style.display = "block";
        //console.log("In openFarm()");
    }

    // get close button
    const span = document.getElementById("closeFarm");
    // get button for plant seeds
    const plantSeedsBtn = document.getElementById("plant-seeds");
    const seedOptions = document.getElementById("seed-options");
    const crops = document.getElementById("crops");
    const farmOptions = document.getElementById("farm-options");
    // get button for harvest crops
    const harvestCropsBtn = document.getElementById("harvest-crops");
    // when the user clicks on x, close the popup

    if (span) {
        span.onclick = function () {
            farm.style.display = "none";
            scene.farmVisible = false;
            //console.log("X pressed");
        }


        // resets popup to original state
        if (seedOptions) {
            seedOptions.style.display = "none";
        }
        if (crops) {
            crops.style.display = "none";
        }
        if (farmOptions) {
            farmOptions.style.display = "block"
        }
    }
    // when user clicks on plant seeds button, show plant seeds options
    if (plantSeedsBtn) {
        plantSeedsBtn.onclick = function () {
            //console.log("Plant button clicked");
            farmOptions.style.display = "none";
            seedOptions.style.display = "block";
            plantSeeds(scene);
        }
    }

    // when user clicks on harvest crops button, show harvest crops options
    if (harvestCropsBtn) {
        harvestCropsBtn.onclick = function () {
            //console.log("Harvest button clicked");
            crops.style.display = "block";
            farmOptions.style.display = "none";
            harvestCrops(scene);
        }
    }
}

// Function to close the popup
export function closeFarm(scene) {
    // get popup element
    const farm = document.getElementById("farm");
    if(farm) {
        farm.style.display = "none";
    }
    scene.farmVisible = false;
}

export function collisionCallback(player, layer, scene) {
    // Ensure player and layer bounds are updated dynamically
    const playerBounds = player.Bunny.getBounds();
    const layerBounds = layer.getBounds();

    // Debug logs to inspect bounds
    //console.log("Player Bounds:", playerBounds);
    //console.log("Layer Bounds:", layerBounds);

    // Check if the bounds are valid before performing collision detection
    if (!playerBounds || !layerBounds) {
        console.error("Bounds are not defined properly.");
        return;
    }

    // Perform collision detection
    const isColliding = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, layerBounds);
    //console.log("isColliding:", isColliding); // Log the result of the collision check
    if (window.location.pathname === scene.path) {
        if (layer === scene.farmLand) {
            if (isColliding && !scene.farmVisible) {
                closeAnimalPenIfOpen(scene); // close animal popup if open
                // Show the popup if the player is near the farm and not already visible
                openFarm(scene);
                //console.log("Opened farm popup");
                scene.farmVisible = true;
            } else if (!isColliding && scene.farmVisible) {
                // Hide the popup if the player is not near the farm
                closeFarm(scene);
                //console.log("Closed farm popup");
                scene.farmVisible = false;
            }
        }


        // --- AnimalPen popup ---
        if (layer === scene.pen) {
            if (isColliding && !scene.popupVisible) {
                closeFarmIfOpen(scene); // close farm popup if open
                showPopup(scene.animalArray, scene);
                scene.popupVisible = true;
            } else if (!isColliding && scene.popupVisible) {
                hidePopup(scene);
                scene.popupVisible = false;
            }
        }
    }

    if (layer === scene.animalMarketLayer) {
        if (isColliding && !scene.animalMarketVisible) {
            //console.log(isColliding);
            closeCropMarketIfOpen(scene);
            closeFarmIfOpen(scene);        // if farm is nearby
            closeAnimalPenIfOpen(scene);   //if pen is nearby

            openAnimalMarketPopup(scene);
            scene.animalMarketVisible = true;
        } else if (!isColliding && scene.animalMarketVisible) {
            closeAnimalMarket(scene);
            scene.animalMarketVisible = false;
        }
    }

    if (layer === scene.cropMarketLayer) {
        if (isColliding && !scene.cropMarketVisible) {
            closeAnimalMarketIfOpen(scene);
            closeFarmIfOpen(scene);
            closeAnimalPenIfOpen(scene);

            openCropMarketPopup(scene);
            scene.cropMarketVisible = true;
        } else if (!isColliding && scene.cropMarketVisible) {
            closeCropMarket(scene);
            scene.cropMarketVisible = false;
        }
    }
}

// Helper functions to close the other popup if it's open
function closeAnimalPenIfOpen(scene) {
    if (scene.popupVisible) {
        hidePopup(scene);
        scene.popupVisible = false;
    }
}

function closeFarmIfOpen(scene) {
    if (scene.farmVisible) {
        closeFarm(scene);
        scene.farmVisible = false;
    }
}



export function openAnimalMarketPopup(scene) {
    const popup = document.getElementById("animalMarketPopup");
    const cow = document.getElementById("cow-notif");
    const chicken = document.getElementById("chicken-notif");
    const goat = document.getElementById("goat-notif");
    const cowSold = document.getElementById("cow-sell");
    const chickenSold = document.getElementById("chicken-sell");
    const goatSold = document.getElementById("goat-sell");
    const buyError = document.getElementById("purchase-error");
    const sellError1 = document.getElementById("animal-sell-error1");
    const sellError2 = document.getElementById("animal-sell-error2")

    if(scene.thisUser)
    {
        scene.animalArray = [
            ...scene.thisUser.getAllCows() || [],
            ...scene.thisUser.getAllGoats() || [],
            ...scene.thisUser.getAllChickens() || [],

        ]
    }
    if (popup) popup.style.display = "block";

    // Hide all menus first
    const mainMenu = document.getElementById("animalMainMenu");
    const buyMenu = document.getElementById("buyMenu");
    const sellMenu = document.getElementById("sellMenu");

    mainMenu.style.display = "block";
    buyMenu.style.display = "none";
    sellMenu.style.display = "none";

    // Handle close button
    const closeBtn = document.getElementById("closeAnimal");
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeAnimalMarket(scene);
            //console.log("X pressed for market animal")

        };
    }
    // handles input for animal naming
    document.querySelectorAll(".animal-option").forEach(btn =>{
        btn.addEventListener("click", (e) =>{
            const container = e.target.closest(".buy-option");
            document.querySelectorAll(".animal-name-input").forEach(div => div.style.display = "none");
            const nameInputDiv = container.querySelector(".animal-name-input");
            if(nameInputDiv) nameInputDiv.style.display = "block";
        });
    });

    // makes sure eventlistener resets for duplicate buying
    document.querySelectorAll(".confirm-buy").forEach(btn =>{
        btn.replaceWith(btn.cloneNode(true));
    });

    // handles button to confirm name
    document.querySelectorAll(".confirm-buy").forEach(btn => {
        btn.addEventListener("click", (e) =>{
            const type = e.target.dataset.type;
            const input = e.target.previousElementSibling;
            const name = input.value.trim();
            const animalprice = priceBuying[type] || 0;

            if (scene.thisUser.coins < animalprice) {
                buyError.style.display = "block";
                setTimeout(function() {
                    buyError.style.display = "none";
                }, time);
                return;
            }

            scene.thisUser.incrementCoins(-animalprice)

            let newAnimal;
            switch (type)
            {
                case "Cow":
                    newAnimal = new Cow(scene, 300, 300, 'cow');
                    newAnimal.name = name;
                    scene.thisUser.addCow(newAnimal);
                    cow.style.display = "block";
                    setTimeout(function() {
                        cow.style.display = "none";
                    }, time);
                    break;
                case "Goat":
                    newAnimal = new Goat(scene, 300, 300, 'goat' );
                    newAnimal.name = name;
                    scene.thisUser.addGoat(newAnimal);
                    goat.style.display = "block";
                    setTimeout(function() {
                        goat.style.display = "none";
                    }, time);
                    break;
                case "Chicken":
                    newAnimal = new Chicken(scene, 300, 300, 'chicken');
                    newAnimal.name = name;
                    scene.thisUser.addChicken(newAnimal);
                    chicken.style.display = "block";
                    setTimeout(function() {
                        chicken.style.display = "none";
                    }, time);
                    break;
            }
            
            console.log(`${type} sold for ${animalprice} coins`);
            saveData(scene.thisUser);

            input.value = "";
            e.target.parentElement.style.display = "none";
        })
    })
  
    // Show Buy Menu
    document.getElementById("buyAnimals").onclick = () => {
        mainMenu.style.display = "none";
        buyMenu.style.display = "block";
    };
  
    
    // Show Sell Menu and list
    document.getElementById("sellAnimals").onclick = () => {
      mainMenu.style.display = "none";
      sellMenu.style.display = "block";
      //console.log("inselllistanimal");

      //updateSellMenu(scene.thisUser);
      const sellList = document.getElementById("sellAnimalList");
      sellList.innerHTML = "";

      //console.log("thisUser: ", scene.thisUser);
      //console.log("animalarray:",scene.animalArray);
      if(scene.thisUser && scene.animalArray && scene.animalArray.length> 0)
      {
        scene.animalArray.forEach((animal, index) =>
        {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "radio";
            checkbox.name = "animalToSell";
            checkbox.value = animal.animalID;

            const type = animal.texture?.key || animal.animalTexture || "unkown";
            const name = animal.name || "unamedd";
            const price = animal.sellPrice();//priceSelling[type];

            label.innerText = `${name} (${type}): ${price} coins`;
            label.prepend(checkbox);
            sellList.appendChild(label);
            sellList.appendChild(document.createElement('br'));
        });
        //console.log("sell List populated with,", scene.animalArray.length,"animals");

      }else{
        sellList.innerHTML ="no animals to sell,"
      }
    };
    // confirming sell button
    document.getElementById("confirmSell").onclick = () =>{
        const selected = document.querySelector("input[name = 'animalToSell']:checked");

        if(!selected){
            sellError2.style.display = "block";
            setTimeout(function () {
                sellError2.style.display = "none";
            }, time);
            //alert("please select animal");
            return;
        }
        const selectedID = selected.value;
        const animal = scene.animalArray.find(a => a.animalID === selectedID);
        const type = animal?.texture?.key|| animal?.animalTexture || "notknown";

        //const animalprice = priceSelling[type] || 0;
        const animalprice = animal.sellPrice();

        if (scene.thisUser) {
            removeAnimal(animal, scene.animalArray, scene.thisUser);

            scene.thisUser.incrementCoins(animalprice);
            //console.log(`${type} sold for ${animalprice} coins`);
            saveData(scene.thisUser);
            if (animal.texture === 'cow') {
                cowSold.style.display = "block";
                setTimeout(function () {
                    cowSold.style.display = "none";
                }, time);
            }
            else if (animal.texture === 'goat') {
                goatSold.style.display = "block";
                setTimeout(function () {
                    goatSold.style.display = "none";
                }, time);
            }
            else if (animal.texture === 'chicken') {
                chickenSold.style.display = "block";
                setTimeout(function () {
                    chickenSold.style.display = "none";
                }, time);
            }

           //const sellList = document.getElementById("sellAnimalList");
           //sellList.innerHTML = "";
            scene.animalArray = [
                ...scene.thisUser.getAllCows() || [],
                ...scene.thisUser.getAllGoats() || [],
                ...scene.thisUser.getAllChickens() || [],

            ];

            //scene.thisUser.incrementCoins(100);
            updateSellMenu(scene);
        }
        else {
            sellError1.style.display = "block";
            setTimeout(function() {
                sellError1.style.display = "none";
            }, time);
        }

        document.getElementById("sellAnimals").click();
    }
  
    // Back buttons
    document.querySelectorAll(".backBtn").forEach(btn => {
      btn.onclick = () => {
        buyMenu.style.display = "none";
        sellMenu.style.display = "none";
        mainMenu.style.display = "block";

        if(scene.thisUser)
        {
            scene.animalArray = [
                ...scene.thisUser.getAllCows() || [],
                ...scene.thisUser.getAllGoats() || [],
                ...scene.thisUser.getAllChickens() || [],

            ];
        }
      };
    });
}

export function closeAnimalMarket(scene) {
    const popup = document.getElementById("animalMarketPopup");
    if (popup) {
        popup.style.display = "none";
    }

    if (scene) {
        scene.animalMarketVisible = false;
    }

    //console.log("Animal Market popup closed");

}

// updating list array
function updateSellMenu(scene)
{
    const sellAnimalList = document.getElementById('sellAnimalList');
    sellAnimalList.innerHTML = "";

    if(scene.animalArray && scene.animalArray.length > 0 ){
        scene.animalArray.forEach((animal, index) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "radio";
            checkbox.name = "animalToSell";
            checkbox.value = animal.animalID;

            const type = animal.texture?.key || animal.animalTexture || "Animal";
            const name = animal.name || "unamed";

            label.innerText = `${name} (${type})`;
            label.prepend(checkbox);
            sellAnimalList.appendChild(label);
            sellAnimalList.appendChild(document.createElement("br"));
        });
    }
    const animalTypes = ['cow', 'goat', 'chicken'];
    const user = scene.thisUser;

    if(user){
        animalTypes.forEach(type =>
            {
                const methodName = `get${type.charAt(0).toUpperCase() + type.slice(1)}Cnt`;
                if(typeof user[methodName] === "function")
                {
                    const count = user[methodName]();
                    if(count > 0){
                    const animalItem = document.createElement('div');
                    animalItem.classList.add('animal-item');
                    animalItem.textContent = `${type.charAt(0).toUpperCase() +type.slice(1)} x ${count}`;
                    sellAnimalList.appendChild(animalItem);
                    }
                }
            }
            );
    }
    
    //const animalTypes = ['cow', 'goat', 'chicken'];
    
}

export function openCropMarketPopup(scene) {
    const popup = document.getElementById("cropMarketPopup");
    if (popup) popup.style.display = "block";

    const mainMenu = document.getElementById("cropMainMenu");
    const buyMenu = document.getElementById("buyCropMenu");
    const sellMenu = document.getElementById("sellCropMenu");

    mainMenu.style.display = "block";
    buyMenu.style.display = "none";
    sellMenu.style.display = "none";

    document.getElementById("closeCrop").onclick = () => {
        closeCropMarket(scene);
    };

    document.getElementById("buyCrops").onclick = () => {
        mainMenu.style.display = "none";
        buyMenu.style.display = "block";
        buySeeds(scene);
    };

    document.getElementById("sellCrops").onclick = () => {
        mainMenu.style.display = "none";
        sellMenu.style.display = "block";
        sellCrops(scene);
    };

    document.querySelectorAll(".cropBackBtn").forEach(btn => {
        btn.onclick = () => {
            buyMenu.style.display = "none";
            sellMenu.style.display = "none";
            mainMenu.style.display = "block";
        };
    });
}

export function closeCropMarket(scene) {
    const popup = document.getElementById("cropMarketPopup");
    if (popup) popup.style.display = "none";
    if (scene) scene.cropMarketVisible = false;
    //console.log("Crop Market popup closed");

}

function closeAnimalMarketIfOpen(scene) {
    if (scene.animalMarketVisible) {
        closeAnimalMarket(scene);
        scene.animalMarketVisible = false;
    }
}

function closeCropMarketIfOpen(scene) {
    if (scene.cropMarketVisible) {
        closeCropMarket(scene);
        scene.cropMarketVisible = false;
    }
}