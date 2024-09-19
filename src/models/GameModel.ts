import axios from "axios";
import EventEmitter from "eventemitter3";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class GameModel extends EventEmitter {

    private _currentLevel: number;

    get currentLevel() {
        return this._currentLevel;
    }

    set currentLevel(value: number) {
        this._currentLevel = value;
        localStorage.setItem("currentLevel", value.toString());
    }

    private _currentLevelProgress: number[];

    get currentLevelProgress() {
        return this._currentLevelProgress;
    }

    set currentLevelProgress(value: number[]) {
        this._currentLevelProgress = value;
        localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
    }

    get currentLevelConfig() {
        const convertedLevelNum = this.convertCurrentLevelToReal(this._currentLevel);
        return this.levels[`level${convertedLevelNum}`];
    }

    private readonly uuid: string;

    private levels: Record<string, string[]> = {};

    constructor(@inject("InitialLevel") initialLevel: number) {
        super();
        const currentStorageLevel = localStorage.getItem("currentLevel");
        if (!currentStorageLevel) {
            this._currentLevel = initialLevel;
            localStorage.setItem("currentLevel", this._currentLevel.toString());
        } else {
            this._currentLevel = Number.parseInt(currentStorageLevel);
        }

        const currentStorageLevelProgress = localStorage.getItem(`level[${this._currentLevel}].progress`);
        if (!currentStorageLevelProgress) {
            this._currentLevelProgress = [];
            localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
        } else {
            this._currentLevelProgress = currentStorageLevelProgress.split(',').map(i => Number.parseInt(i));
        }

        this.uuid = uuidv4();
        localStorage.setItem("activeId", this.uuid);
    }

    addCurrentLevelProgress(value: number) {
        this._currentLevelProgress.push(value);
        localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
    }

    async fetchLevels(levelsToLoad = 4) {
        for (let i = 1; i < levelsToLoad; i++) {
            const { data } = await axios.get<{ words: string[] }>(`public/levels/${i}.json`);
            this.levels[`level${i}`] = data.words;
        }
    }

    checkIsGameActive() {
        const activeAppId = localStorage.getItem("activeId");
        if (activeAppId !== this.uuid) {
            this.emit("gameModel:showReloadPopup");
        }
    }

    get isLevelCompleted() {
        return this.currentLevelConfig.length === this.currentLevelProgress.length;
    }

    convertCurrentLevelToReal(level: number) {
        const realLevel = level % 3;
        return realLevel === 0 ? 3 : realLevel;
    }

    getCurrentLevelLetters() {
        const allWords = this.currentLevelConfig.join("");
        const uniqueChars = [...new Set(allWords)];
        return uniqueChars;
    }

    handleWordSelectionComplete(word: string) {
        const index = this.currentLevelConfig.findIndex(levelWord => levelWord == word);

        if (index !== -1 && !this.currentLevelProgress.includes(index)) {
            this.addCurrentLevelProgress(index);
            this.emit("gameModel:openLine", index);
        }

        if (this.isLevelCompleted) {
            this.emit("gameModel:showWinPopup");
        }
    }
}
