const LOCKED_ACHIEVEMENTS_LIST = document.querySelector('#locked-achievements ul');
const UNLOCKED_ACHIEVEMENTS_LIST = document.querySelector('#unlocked-achievements ul');
const GAMEMODE_SELECT = document.querySelector('#gamemode');
const DIFFICULTY_SELECT = document.querySelector('#difficulty');
const APPLY_FILTERS_BUTTON = document.querySelector('#apply-filters');

const KF2_APP_ID = '232090';
const STEAM_ID_64 = 76561198014652060;
const STEAM_WEB_API_KEY = '225F191E000A2874BE746FE028470C5C';

const GAME_SCHEMA_URL = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_WEB_API_KEY}&appid=${KF2_APP_ID}`;
const PLAYER_ACHIEVEMENTS_URL = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${STEAM_WEB_API_KEY}&steamid=${STEAM_ID_64}&appid=${KF2_APP_ID}`;

const LOCKED_ACHIEVEMENTS = [];

Promise.all([fetch(GAME_SCHEMA_URL).then((response) => response.json()), fetch(PLAYER_ACHIEVEMENTS_URL).then((response) => response.json())]).then((response) => {
    const [gameSchema, playerAchievementsData] = response;
    const achievements = [];

    let gameAchievements = gameSchema.game.availableGameStats.achievements;
    let playerAchievements = playerAchievementsData.playerstats.achievements;
    for (let i = 0; i < gameAchievements.length - 1; i++) {
        achievements[i] = {
            name: gameAchievements[i].displayName,
            description: gameAchievements[i].description,
            unlockedIcon: gameAchievements[i].icon,
            lockedIcon: gameAchievements[i].icongray,
            isUnlocked: playerAchievements[i].achieved
        }
    }
    
    achievements.forEach(achievement => {
        // If achievement description contains game mode, add gamemode property
        if (achievement.description.toLowerCase().includes('survival')) {
            achievement.gamemode = 'survival';
        } else if (achievement.description.toLowerCase().includes('objective')) {
            achievement.gamemode = 'objective';
        } else if (achievement.description.toLowerCase().includes('endless')) {
            achievement.gamemode = 'endless';
        }

        // If achievement description contains difficulty, add difficulty property
        if (achievement.description.toLowerCase().includes('normal')) {
            achievement.difficulty = 'normal';
        } else if (achievement.description.toLowerCase().includes('hard')) {
            achievement.difficulty = 'hard';
        } else if (achievement.description.toLowerCase().includes('suicidal')) {
            achievement.difficulty = 'suicidal';
        } else if (achievement.description.toLowerCase().includes('hell on earth')) {
            achievement.difficulty = 'hell on earth';
        }

        if (achievement.isUnlocked) {
            UNLOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
        } else {
            LOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
            LOCKED_ACHIEVEMENTS.push(achievement);
        }
    });
});

APPLY_FILTERS_BUTTON.onclick = function() {
    LOCKED_ACHIEVEMENTS_LIST.innerHTML = '';
    
    LOCKED_ACHIEVEMENTS.forEach(achievement => {
        if (GAMEMODE_SELECT.value != 'Any' && DIFFICULTY_SELECT.value != 'Any') {
            if (achievement.gamemode == GAMEMODE_SELECT.value.toLowerCase() && achievement.difficulty == DIFFICULTY_SELECT.value.toLowerCase()) {
                LOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
            }
        } else if (GAMEMODE_SELECT.value != 'Any' && DIFFICULTY_SELECT.value == 'Any') {
            if (achievement.gamemode == GAMEMODE_SELECT.value.toLowerCase()) {
                LOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
            }
        } else if (GAMEMODE_SELECT.value == 'Any' && DIFFICULTY_SELECT.value != 'Any') {
            if (achievement.difficulty == DIFFICULTY_SELECT.value.toLowerCase()) {
                LOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
            }
        } else {
            LOCKED_ACHIEVEMENTS_LIST.appendChild(listItemFromAchievement(achievement));
        }
    });
}

function listItemFromAchievement(achievement) {
    let li = document.createElement('li');

    let img = document.createElement('img');
    let h3 = document.createElement('h3');
    let p = document.createElement('p');

    img.src = achievement.isUnlocked ? achievement.unlockedIcon : achievement.lockedIcon;
    h3.innerText = achievement.name;
    p.innerText = achievement.description;

    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(p);

    return li;
}