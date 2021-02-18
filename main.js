const UNLOCKED_ACHIEVEMENTS_LIST = document.querySelector('#unlocked-achievements ul');
const LOCKED_ACHIEVEMENTS_LIST = document.querySelector('#locked-achievements ul');

const KF2_APP_ID = '232090';
const STEAM_ID_64 = 76561198014652060;
const STEAM_WEB_API_KEY = '34A0FC27B44798376F8D9CFCA3AB711F';

const GAME_SCHEMA_URL = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_WEB_API_KEY}&appid=${KF2_APP_ID}`;
const PLAYER_ACHIEVEMENTS_URL = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${STEAM_WEB_API_KEY}&steamid=${STEAM_ID_64}&appid=${KF2_APP_ID}`;

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

        if (achievement.isUnlocked) {
            UNLOCKED_ACHIEVEMENTS_LIST.appendChild(li);
        } else {
            LOCKED_ACHIEVEMENTS_LIST.appendChild(li);
        }
    });
});