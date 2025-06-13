import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { saveData } from "./firestore.js";

const time = 5000;

export function openCompetitionPopup(scene) {
    //console.log("openCompetitionPopup() triggered");

    const popup = document.getElementById("competitionPopup");

    if (scene.competitionPopupOpened) {
        //console.log("Popup already opened. Skipping.");
        return;
    }
    scene.competitionPopupOpened = true;

    if (popup) {
        popup.style.display = 'block';
        popup.classList.add('show');
        popup.classList.remove('hide');

        const dropdown = document.getElementById("userAnimal");
        if (dropdown) {
            dropdown.innerHTML = `<option value="">-- Select --</option>`;
            const db = getFirestore();
            const animalsRef = collection(db, "Users", scene.thisUser.uid, "Animals");
            const breedMap = { 1: 'Cow', 2: 'Chicken', 3: 'Goat' };

            getDocs(animalsRef).then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(docSnap => {
                        const animalData = docSnap.data();
                        const breedName = breedMap[animalData.breed] || 'Unknown';
                        const option = document.createElement("option");
                        option.value = docSnap.id;
                        option.textContent = `${animalData.name} (${breedName})`;
                        dropdown.appendChild(option);
                    });
                } else {
                    const compError1 = document.getElementById("comp-error1");
                    compError1.style.display = "block";
                    setTimeout(() => compError1.style.display = "none", time);
                }
            }).catch(error => {
                console.error("Error fetching animals for dropdown:", error);
            });
        }

        const startBtn = document.getElementById("startCompetitionBtn");
        if (startBtn) {
            startBtn.onclick = () => {
                const entryPrompt = document.getElementById("entryPrompt");
                entryPrompt.classList.add("show");

                document.getElementById("confirmEntry").onclick = async () => {
                    entryPrompt.classList.remove("show");

                    // Show error message in popup if not enough coins
                    if (scene.thisUser.coins < 50) {
                        const entryError = document.getElementById("purchase-error");
                        if (entryError) {
                            entryError.style.display = "block";
                            setTimeout(() => {
                                entryError.style.display = "none";
                            }, time);
                        }
                        return;
                    }

                    // Deduct 50 coins using the method
                    scene.thisUser.incrementCoins(-50);

                    // Sync coin update to Firebase
                    const db = getFirestore();
                    await setDoc(doc(db, "Users", scene.thisUser.uid), {
                        coins: scene.thisUser.coins
                    }, { merge: true });

                    runCompetition(scene);
                };

                document.getElementById("cancelEntry").onclick = () => {
                    entryPrompt.classList.remove("show");
                };
            };
        }

        const viewAnimalsBtn = document.getElementById("viewAnimalListCompetition");
        if (viewAnimalsBtn) {
            viewAnimalsBtn.onclick = async () => {
                const animalListDiv = document.getElementById("animalListCompetition");
                const animalListContent = document.getElementById("animalListContent");
                const hideAnimalsBtn = document.getElementById("hideAnimalListCompetition");

                animalListContent.innerHTML = '';
                const breedMap = { 1: 'Cow', 2: 'Chicken', 3: 'Goat' };

                try {
                    const db = getFirestore();
                    const animalsRef = collection(db, "Users", scene.thisUser.uid, "Animals");
                    const snapshot = await getDocs(animalsRef);

                    if (!snapshot.empty) {
                        snapshot.forEach(docSnap => {
                            const animalData = docSnap.data();
                            const breedName = breedMap[animalData.breed] || 'Unknown';
                            const ul = document.createElement('ul');
                            const li = document.createElement('li');
                            li.style.color = 'white';
                            li.style.marginBottom = '4px';
                            li.style.textAlign = 'left';
                            li.innerHTML = `<strong>${animalData.name} (${breedName}):</strong>`
                            ul.style.color = 'white';
                            ul.style.marginBottom = '8px';
                            ul.style.paddingLeft = '20px';
                            ul.innerHTML = `Speed: ${animalData.speed ?? "N/A"}, 
                                Strength: ${animalData.strength ?? "N/A"}, 
                                Smarts: ${animalData.smarts ?? "N/A"}, 
                                Style: ${animalData.style ?? "N/A"}`;
                            animalListContent.appendChild(li);
                            animalListContent.appendChild(ul);
                        });
                    } else {
                        animalListContent.innerHTML = '<li>No animals found.</li>';
                    }

                    animalListDiv.style.display = 'block';
                    hideAnimalsBtn.style.display = 'inline-block';
                } catch (error) {
                    console.error("Error loading animal list:", error);
                    animalListContent.innerHTML = '<li>Error loading animals.</li>';
                }
            };
        }

        const hideAnimalsBtn = document.getElementById("hideAnimalListCompetition");
        if (hideAnimalsBtn) {
            hideAnimalsBtn.onclick = () => {
                const animalListDiv = document.getElementById("animalListCompetition");
                animalListDiv.style.display = 'none';
                hideAnimalsBtn.style.display = 'none';
            };
        }

        const closeBtn = document.getElementById("closeCompetition");
        if (closeBtn) {
            closeBtn.onclick = () => {
                closeCompetitionPopup(scene);
            };
        }
    }
}

export function runCompetition(scene) {
    const dropdown = document.getElementById("userAnimal");
    const competitionType = document.getElementById("competitionType");
    const resultText = document.getElementById("competitionResult");

    const userAnimalName = dropdown.options[dropdown.selectedIndex].text;
    const userAnimal = dropdown.value;
    const type = competitionType.value;

    if (!userAnimal || !type) {
        const compError2 = document.getElementById("comp-error2");
        compError2.style.display = "block";
        setTimeout(() => compError2.style.display = "none", time);
        return;
    }

    const db = getFirestore();
    const animalsRef = collection(db, "Users", scene.thisUser.uid, "Animals");

    getDocs(animalsRef).then(snapshot => {
        let userAnimalObj = null;
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (docSnap.id === userAnimal) userAnimalObj = data;
        });

        if (!userAnimalObj) {
            const compError3 = document.getElementById("comp-error3");
            compError3.style.display = "block";
            setTimeout(() => compError3.style.display = "none", time);
            return;
        }

        const userStats = {
            Speed: userAnimalObj.speed,
            Strength: userAnimalObj.strength,
            Smarts: userAnimalObj.smarts,
            Style: userAnimalObj.style
        };

        const userStat = userStats[type];
        const selectedBreed = userAnimalObj.texture;

        const randomComputerAnimal = {
            name: `Wild ${capitalize(selectedBreed)}`,
            breed: capitalize(selectedBreed),
            speed: Phaser.Math.Between(1, 20),
            strength: Phaser.Math.Between(1, 20),
            smarts: Phaser.Math.Between(1, 20),
            style: Phaser.Math.Between(1, 20)
        };

        const compStat = randomComputerAnimal[type.toLowerCase()];
        let outcome;

        if (userStat > compStat) {
            outcome = 'You win!';
            document.getElementById("win-notification").style.display = "block";
            setTimeout(() => document.getElementById("win-notification").style.display = "none", time);
        } else if (userStat < compStat) {
            outcome = 'You lose!';
            document.getElementById("lose-notification").style.display = "block";
            setTimeout(() => document.getElementById("lose-notification").style.display = "none", time);
        } else {
            outcome = "It's a tie!";
            document.getElementById("tie-notification").style.display = "block";
            setTimeout(() => document.getElementById("tie-notification").style.display = "none", time);
        }

        const difference = userStat - compStat;
        const prize = outcome === 'You win!' ? Math.max(100, 100 + difference * 10) : 0;

        if (outcome === 'You win!') {
            scene.thisUser.incrementCoins(prize);
            saveData(scene.thisUser);
        } else if (outcome === "It's a tie!") {
            scene.thisUser.incrementCoins(5); // refund
            saveData(scene.thisUser);
        }

        resultText.innerHTML = `
            <strong>Competition Type:</strong> ${type}<br>
            <strong>Your Animal:</strong> ${userAnimalName} — ${type}: ${userStat}<br>
            <strong>Opponent's Animal:</strong> ${randomComputerAnimal.name} — ${type}: ${compStat}<br><br>
            <strong>${outcome}</strong><br>
            <strong>Prize:</strong> ${prize} coins
        `;
    });
}

export function closeCompetitionPopup(scene) {
    const popup = document.getElementById("competitionPopup");
    if (popup) {
        popup.style.display = 'none';
        popup.classList.remove('show');
        popup.classList.add('hide');
    }

    if (scene) {
        scene.competitionPopupOpened = false;
        document.getElementById("userAnimal").selectedIndex = 0;
        document.getElementById("competitionType").selectedIndex = 0;
        document.getElementById("competitionResult").innerHTML = '';
        document.getElementById("animalListCompetition").style.display = 'none';
        document.getElementById("hideAnimalListCompetition").style.display = 'none';
    }
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}